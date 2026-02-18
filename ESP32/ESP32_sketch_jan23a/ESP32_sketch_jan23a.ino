#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "4G-MIFI-8339";
const char* password = "1234567890";

/************ NODE.JS SERVER ************/
const char* wsHost = "192.168.100.231";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://192.168.100.231:5000/readings/post/readings";

/************ WEBSOCKET OBJECT ************/
WebSocketsClient webSocket;

/************ ULTRASONIC SENSOR ************/
const int TRIG_PIN = 16;
const int ECHO_PIN = 17;
const float MAX_DISTANCE_INCHES = 36.0;
const float MIN_DISTANCE_INCHES = 0.0;

/************ SENSORS / VALVES ************/
struct PlantSensor {
  int pin;
  String name;
  int dryValue;
  int wetValue;
  int valvePin;
  int minMoisture;
  int maxMoisture;
};

PlantSensor sensors[3] = {
  {32, "BOKCHOY", 3000, 1800, 21, 50, 75},
  {33, "PECHAY", 2900, 1750, 22, 50, 75},
  {34, "MUSTASA", 2800, 1700, 23, 55, 75}
};

/************ OUTPUT ************/
const int pumpPin = 18;

/************ SYSTEM SWITCH ************/
const int LOCK_SWITCH = 19;
const int SWITCH_LED = 2;

/************ PLANT BUTTONS ************/
const int bokchoyBtn = 25;
const int petchayBtn = 26;
const int mustasaBtn = 27;

/************ STATE ************/
volatile bool systemEnabled = false;
volatile bool systemSwitchPressed = false;
volatile bool plantBtnPressed[3] = {false, false, false};

// buttonManualOn = true means user MANUALLY turned ON via button
// buttonManualOff = true means user MANUALLY turned OFF via button
bool buttonManualOn[3] = {false, false, false};
bool buttonManualOff[3] = {false, false, false};

bool wateringState[3] = {false, false, false};

// Node.js remote control override
bool nodeJsOverride[3] = {false, false, false};
bool nodeJsForceOff[3] = {false, false, false};

bool wifiShouldBeConnected = false;
bool wifiConnected = false;

/************ TIMING ************/
unsigned long lastReadTime = 0;
unsigned long lastWiFiCheck = 0;
const unsigned long readInterval = 5000;
const unsigned long wifiCheckInterval = 100;

/************ MOISTURE SENSOR POSTING - 10 MINUTE INTERVALS ************/
unsigned long lastMoisturePost[3] = {0, 0, 0};
const unsigned long moisturePostInterval = 600000;

/************ WATERING CYCLE TRACKING ************/
bool previousWateringState[3] = {false, false, false};
bool wateringCycleAlertSent[3] = {false, false, false};

/************ WATER LEVEL TRACKING ************/
unsigned long lastWaterLevelPost = 0;
const unsigned long waterLevelPostInterval = 900000;

bool waterLevelFirstReadingDone = false;
int stableWaterLevel = 0;

bool waterLevel30AlertSent = false;
bool waterLevel20AlertSent = false;

int previousWaterLevel = 100;
bool waterLevelBootSent = false;

/************ INTERRUPT SERVICE ROUTINES ************/
void IRAM_ATTR systemSwitchISR() {
  static unsigned long lastInterruptTime = 0;
  unsigned long interruptTime = millis();
  if (interruptTime - lastInterruptTime > 200) {
    systemSwitchPressed = true;
  }
  lastInterruptTime = interruptTime;
}

void IRAM_ATTR bokchoyISR() {
  static unsigned long lastInterruptTime = 0;
  unsigned long interruptTime = millis();
  if (interruptTime - lastInterruptTime > 200) {
    plantBtnPressed[0] = true;
  }
  lastInterruptTime = interruptTime;
}

void IRAM_ATTR petchayISR() {
  static unsigned long lastInterruptTime = 0;
  unsigned long interruptTime = millis();
  if (interruptTime - lastInterruptTime > 200) {
    plantBtnPressed[1] = true;
  }
  lastInterruptTime = interruptTime;
}

void IRAM_ATTR mustasaISR() {
  static unsigned long lastInterruptTime = 0;
  unsigned long interruptTime = millis();
  if (interruptTime - lastInterruptTime > 200) {
    plantBtnPressed[2] = true;
  }
  lastInterruptTime = interruptTime;
}

/************ ULTRASONIC SENSOR ************/
float getDistanceInches() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float inches = duration / 74.0 / 2.0;
  return inches;
}

/************ WATER LEVEL ************/
int getWaterLevelPercentage() {
  float distance = getDistanceInches();
  if (distance > MAX_DISTANCE_INCHES) distance = MAX_DISTANCE_INCHES;
  if (distance < MIN_DISTANCE_INCHES) distance = MIN_DISTANCE_INCHES;
  int percentage = (int)(100.0 - (distance / MAX_DISTANCE_INCHES * 100.0));
  percentage = constrain(percentage, 0, 100);
  return percentage;
}

/************ MOISTURE READING ************/
int getMoisturePercent(int sensorIndex) {
  int raw = analogRead(sensors[sensorIndex].pin);
  int percent = map(raw, sensors[sensorIndex].dryValue, sensors[sensorIndex].wetValue, 0, 100);
  percent = constrain(percent, 0, 100);
  return percent;
}

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

void turnOffAllValvesAndPump() {
  for (int i = 0; i < 3; i++) {
    buttonManualOn[i] = false;
    buttonManualOff[i] = false;
    wateringState[i] = false;
    nodeJsOverride[i] = false;
    nodeJsForceOff[i] = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
}

/************ UPDATE PUMP STATE ************/
void updatePumpState() {
  bool pumpNeeded = false;
  int currentWaterLevel = getWaterLevelPercentage();

  if (currentWaterLevel <= 20) {
    for (int i = 0; i < 3; i++) {
      setRelay(sensors[i].valvePin, false);
    }
    setRelay(pumpPin, false);
    static unsigned long lastLowWaterWarning = 0;
    if (millis() - lastLowWaterWarning > 30000) {
      Serial.println("⚠️⚠️⚠️ WATER LEVEL TOO LOW (" + String(currentWaterLevel) + "%) - PUMP DISABLED ⚠️⚠️⚠️");
      lastLowWaterWarning = millis();
    }
    return;
  }

  for (int i = 0; i < 3; i++) {
    bool valveOpen = false;

    if (nodeJsOverride[i]) {
      valveOpen = !nodeJsForceOff[i];
    } else if (buttonManualOn[i]) {
      valveOpen = true;
    } else if (buttonManualOff[i]) {
      valveOpen = false;
    } else {
      valveOpen = wateringState[i];
    }

    setRelay(sensors[i].valvePin, valveOpen);
    if (valveOpen) pumpNeeded = true;
  }

  setRelay(pumpPin, pumpNeeded);
}

/************ NODE.JS COMMAND HANDLER ************/
void handleNodeJsCommand(String command) {
  command.trim();
  command.toUpperCase();

  if (command == "BOKCHOY_OFF") {
    nodeJsOverride[0] = true;
    nodeJsForceOff[0] = true;
    buttonManualOn[0] = false;
    buttonManualOff[0] = false;
    Serial.println("🔴 NODE.JS → BOKCHOY FORCED OFF ⚡");
  } else if (command == "BOKCHOY_AUTO") {
    nodeJsOverride[0] = false;
    nodeJsForceOff[0] = false;
    buttonManualOn[0] = false;
    buttonManualOff[0] = false;
    Serial.println("🟢 NODE.JS → BOKCHOY AUTO MODE ⚡");
  } else if (command == "PECHAY_OFF") {
    nodeJsOverride[1] = true;
    nodeJsForceOff[1] = true;
    buttonManualOn[1] = false;
    buttonManualOff[1] = false;
    Serial.println("🔴 NODE.JS → PECHAY FORCED OFF ⚡");
  } else if (command == "PECHAY_AUTO") {
    nodeJsOverride[1] = false;
    nodeJsForceOff[1] = false;
    buttonManualOn[1] = false;
    buttonManualOff[1] = false;
    Serial.println("🟢 NODE.JS → PECHAY AUTO MODE ⚡");
  } else if (command == "MUSTASA_OFF") {
    nodeJsOverride[2] = true;
    nodeJsForceOff[2] = true;
    buttonManualOn[2] = false;
    buttonManualOff[2] = false;
    Serial.println("🔴 NODE.JS → MUSTASA FORCED OFF ⚡");
  } else if (command == "MUSTASA_AUTO") {
    nodeJsOverride[2] = false;
    nodeJsForceOff[2] = false;
    buttonManualOn[2] = false;
    buttonManualOff[2] = false;
    Serial.println("🟢 NODE.JS → MUSTASA AUTO MODE ⚡");
  }

  updatePumpState();
}

/************ POST INDIVIDUAL SENSOR ************/
void postIndividualSensor(int sensorId, int value, String status) {
  if (!wifiConnected) return;

  HTTPClient http;
  http.setTimeout(500);
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"sensor_id\":" + String(sensorId) + ",";
  payload += "\"value\":" + String(value) + ",";
  payload += "\"status\":\"" + status + "\"";
  payload += "}";

  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    Serial.println("✅ Posted sensor_id " + String(sensorId) + " | Value: " + String(value) + " | Status: " + status);
  } else {
    Serial.println("❌ Failed to post sensor_id " + String(sensorId));
  }

  http.end();
}

/************ CHECK AND POST MOISTURE - 10 MIN ************/
void checkAndPostMoistureSensors() {
  unsigned long now = millis();
  for (int i = 0; i < 3; i++) {
    if (now - lastMoisturePost[i] >= moisturePostInterval) {
      int percent = getMoisturePercent(i);
      String status = (percent < sensors[i].minMoisture) ? "active" : "inactive";
      postIndividualSensor(5 + i, percent, status);
      lastMoisturePost[i] = now;
      Serial.println("📊 " + sensors[i].name + " 10-minute update: " + String(percent) + "% (" + status + ")");
    }
  }
}

/************ CHECK WATERING CYCLE START ************/
void checkWateringCycleStart() {
  for (int i = 0; i < 3; i++) {
    bool currentlyWatering = false;

    if (nodeJsOverride[i]) {
      currentlyWatering = !nodeJsForceOff[i];
    } else if (buttonManualOn[i]) {
      currentlyWatering = true;
    } else if (buttonManualOff[i]) {
      currentlyWatering = false;
    } else {
      currentlyWatering = wateringState[i];
    }

    if (currentlyWatering && !previousWateringState[i]) {
      if (!wateringCycleAlertSent[i]) {
        int percent = getMoisturePercent(i);
        postIndividualSensor(5 + i, percent, "active");
        wateringCycleAlertSent[i] = true;
        Serial.println("🚨 " + sensors[i].name + " WATERING CYCLE STARTED!");
        Serial.println("   ├─ Moisture: " + String(percent) + "%");
        Serial.println("   └─ Data sent (ONCE per cycle)");
      }
    } else if (!currentlyWatering && previousWateringState[i]) {
      wateringCycleAlertSent[i] = false;
      Serial.println("✅ " + sensors[i].name + " WATERING CYCLE ENDED");
      Serial.println("   └─ Ready for next cycle");
    }

    previousWateringState[i] = currentlyWatering;
  }
}

/************ CHECK AND POST WATER LEVEL ************/
void checkAndPostWaterLevel() {
  if (!waterLevelFirstReadingDone) {
    Serial.println("⏳ Waiting for first water level reading (5s cycle)...");
    return;
  }

  unsigned long now = millis();
  int waterLevel = stableWaterLevel;

  if (!waterLevelBootSent && wifiConnected) {
    String status = (waterLevel <= 30) ? "active" : "inactive";
    postIndividualSensor(8, waterLevel, status);
    waterLevelBootSent = true;
    Serial.println("🚀 BOOT WATER LEVEL SENT: " + String(waterLevel) + "%");

    if (waterLevel <= 30 && !waterLevel30AlertSent) {
      postIndividualSensor(8, waterLevel, "active");
      waterLevel30AlertSent = true;
      Serial.println("⚠️ BOOT: Water level ≤30% alert sent: " + String(waterLevel) + "%");
    }
    if (waterLevel <= 20 && !waterLevel20AlertSent) {
      postIndividualSensor(8, waterLevel, "active");
      waterLevel20AlertSent = true;
      Serial.println("🚨 BOOT: Water level ≤20% alert sent: " + String(waterLevel) + "%");
    }

    previousWaterLevel = waterLevel;
  }

  if (waterLevel <= 30 && previousWaterLevel > 30 && !waterLevel30AlertSent) {
    postIndividualSensor(8, waterLevel, "active");
    waterLevel30AlertSent = true;
    Serial.println("⚠️ RUNTIME: Water level crossed ≤30%: " + String(waterLevel) + "%");
  }

  if (waterLevel <= 20 && previousWaterLevel > 20 && !waterLevel20AlertSent) {
    postIndividualSensor(8, waterLevel, "active");
    waterLevel20AlertSent = true;
    Serial.println("🚨 RUNTIME: Water level crossed ≤20%: " + String(waterLevel) + "%");
  }

  if (waterLevel > 35) waterLevel30AlertSent = false;
  if (waterLevel > 25) waterLevel20AlertSent = false;

  if (now - lastWaterLevelPost >= waterLevelPostInterval) {
    String status = (waterLevel <= 30) ? "active" : "inactive";
    postIndividualSensor(8, waterLevel, status);
    lastWaterLevelPost = now;
    Serial.println("📅 15-minute water level update: " + String(waterLevel) + "%");
  }

  previousWaterLevel = waterLevel;
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("🟢 WebSocket Connected");
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("🔴 WebSocket Disconnected");
  } else if (type == WStype_TEXT) {
    String msg = String((char*)payload);
    msg.trim();
    Serial.println("📥 WS MESSAGE: " + msg);
    handleNodeJsCommand(msg);
  }
}

/************ WIFI HANDLER ************/
void handleWiFi() {
  unsigned long now = millis();
  if (now - lastWiFiCheck < wifiCheckInterval) return;
  lastWiFiCheck = now;

  static unsigned long lastAttempt = 0;

  if (wifiShouldBeConnected) {
    if (WiFi.status() == WL_CONNECTED) {
      if (!wifiConnected) {
        wifiConnected = true;
        Serial.println("🟢 WiFi CONNECTED: " + WiFi.localIP().toString());
        webSocket.begin(wsHost, wsPort, wsPath);
        webSocket.onEvent(webSocketEvent);
      }
    } else {
      wifiConnected = false;
      if (now - lastAttempt > 5000) {
        lastAttempt = now;
        WiFi.begin(ssid, password);
        Serial.println("🔄 Connecting WiFi...");
      }
    }
  } else {
    if (wifiConnected || WiFi.status() == WL_CONNECTED) {
      Serial.println("🔴 WiFi DISCONNECTING...");
      webSocket.disconnect();
      WiFi.disconnect(true);
      WiFi.mode(WIFI_OFF);
      wifiConnected = false;
    }
  }
}

/************ HANDLE SYSTEM SWITCH ************/
void handleSystemSwitch() {
  if (systemSwitchPressed) {
    systemSwitchPressed = false;
    systemEnabled = !systemEnabled;

    if (systemEnabled) {
      Serial.println("\n🟢🟢🟢 SYSTEM ON 🟢🟢🟢\n");
      digitalWrite(SWITCH_LED, HIGH);
      lastReadTime = 0;
      WiFi.mode(WIFI_STA);
      wifiShouldBeConnected = true;

      unsigned long now = millis();
      for (int i = 0; i < 3; i++) {
        lastMoisturePost[i] = now;
        previousWateringState[i] = false;
        wateringCycleAlertSent[i] = false;
      }

      waterLevelFirstReadingDone = false;
      stableWaterLevel = 0;
      lastWaterLevelPost = millis();
      previousWaterLevel = 100;
      waterLevel30AlertSent = false;
      waterLevel20AlertSent = false;
      waterLevelBootSent = false;

      Serial.println("⏳ Water level will be sent after first 5s reading cycle");

    } else {
      Serial.println("\n🔴🔴🔴 SYSTEM OFF 🔴🔴🔴\n");
      digitalWrite(SWITCH_LED, LOW);
      turnOffAllValvesAndPump();
      wifiShouldBeConnected = false;
    }
  }
}

/************ HANDLE PLANT BUTTONS - PRESS=ON / PRESS AGAIN=OFF ************/
void handlePlantButtons() {
  for (int i = 0; i < 3; i++) {
    if (plantBtnPressed[i]) {
      plantBtnPressed[i] = false;

      // Clear Node.js override when physical button is pressed
      nodeJsOverride[i] = false;
      nodeJsForceOff[i] = false;

      if (buttonManualOn[i]) {
        // Currently manually ON → turn OFF
        buttonManualOn[i] = false;
        buttonManualOff[i] = true;
        setRelay(sensors[i].valvePin, false);
        Serial.println("🔴 " + sensors[i].name + " → BUTTON OFF ⚡INSTANT⚡");
      } else {
        // Currently OFF (manual off or auto) → turn ON
        buttonManualOn[i] = true;
        buttonManualOff[i] = false;
        setRelay(sensors[i].valvePin, true);
        Serial.println("🟢 " + sensors[i].name + " → BUTTON ON ⚡INSTANT⚡");
      }

      updatePumpState();
    }
  }
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);
  delay(100);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  for (int i = 0; i < 3; i++) {
    pinMode(sensors[i].pin, INPUT);
    pinMode(sensors[i].valvePin, OUTPUT);
    setRelay(sensors[i].valvePin, false);
  }

  pinMode(pumpPin, OUTPUT);
  setRelay(pumpPin, false);

  pinMode(LOCK_SWITCH, INPUT_PULLUP);
  pinMode(SWITCH_LED, OUTPUT);
  digitalWrite(SWITCH_LED, LOW);

  pinMode(bokchoyBtn, INPUT_PULLUP);
  pinMode(petchayBtn, INPUT_PULLUP);
  pinMode(mustasaBtn, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(LOCK_SWITCH), systemSwitchISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(bokchoyBtn), bokchoyISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(petchayBtn), petchayISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(mustasaBtn), mustasaISR, FALLING);

  WiFi.mode(WIFI_OFF);

  Serial.println("\n========================================");
  Serial.println("🚀 ESP32 READY");
  Serial.println("⚡ PLANT BUTTONS: PRESS=ON / PRESS AGAIN=OFF");
  Serial.println("📡 WiFi: ONLY WHEN SYSTEM ON");
  Serial.println("🤖 SENSORS: AUTO (5s cycle)");
  Serial.println("⚠️ PUMP DISABLED when water ≤20%");
  Serial.println("========================================\n");
}

/************ LOOP ************/
void loop() {
  handlePlantButtons();
  handleSystemSwitch();

  if (!systemEnabled) {
    turnOffAllValvesAndPump();
    handleWiFi();
    handlePlantButtons();
    delay(1);
    return;
  }

  handlePlantButtons();
  handleWiFi();
  handlePlantButtons();

  if (wifiConnected) {
    webSocket.loop();
  }

  handlePlantButtons();

  if (wifiConnected) {
    checkWateringCycleStart();
  }

  handlePlantButtons();

  if (wifiConnected) {
    checkAndPostMoistureSensors();
    checkAndPostWaterLevel();
  }

  handlePlantButtons();


  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();

    Serial.println("\n📊 SENSOR READING (5s update):");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    handlePlantButtons();

    float distance = getDistanceInches();
    int waterLevel = getWaterLevelPercentage();

    stableWaterLevel = waterLevel;
    if (!waterLevelFirstReadingDone) {
      waterLevelFirstReadingDone = true;
      Serial.println("✅ First water level reading captured: " + String(waterLevel) + "%");
    }

    Serial.print("💧 WATER TANK | DISTANCE: ");
    Serial.print(distance, 2);
    Serial.print(" inches | LEVEL: ");
    Serial.print(waterLevel);
    Serial.print("% ");

    if (waterLevel <= 20) {
      Serial.println("⚠️ CRITICAL - PUMP DISABLED");
    } else if (waterLevel <= 30) {
      Serial.println("⚠️ LOW");
    } else {
      Serial.println("✓");
    }

    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    handlePlantButtons();

    for (int i = 0; i < 3; i++) {
      handlePlantButtons();

      int raw = analogRead(sensors[i].pin);
      int percent = getMoisturePercent(i);

      // AUTO MODE LOGIC - only when no button or Node.js override
      if (!nodeJsOverride[i] && !buttonManualOn[i] && !buttonManualOff[i]) {
        if (percent < sensors[i].minMoisture) {
          wateringState[i] = true;
        }
        if (wateringState[i] && percent >= sensors[i].maxMoisture) {
          wateringState[i] = false;
        }
      }




      bool actualValveState = false;
      String mode = "AUTO";

      if (nodeJsOverride[i]) {
        actualValveState = !nodeJsForceOff[i];
        mode = nodeJsForceOff[i] ? "NODE.JS-OFF" : "NODE.JS-ON";
      } else if (buttonManualOn[i]) {
        actualValveState = true;
        mode = "BUTTON-ON";
      } else if (buttonManualOff[i]) {
        actualValveState = false;
        mode = "BUTTON-OFF";
      } else {
        actualValveState = wateringState[i];
        mode = "AUTO";
      }

      Serial.print("🌱 ");
      Serial.print(sensors[i].name);
      Serial.print(" | RAW:");
      Serial.print(raw);
      Serial.print(" | ");
      Serial.print(percent);
      Serial.print("% | MODE:");
      Serial.print(mode);
      Serial.print(" | VALVE:");
      Serial.println(actualValveState ? "OPEN ✅" : "CLOSED ❌");
    }

    handlePlantButtons();
    updatePumpState();

    Serial.print("💧 PUMP: ");
    bool pumpOn = digitalRead(pumpPin) == LOW;
    Serial.println(pumpOn ? "ON ✅" : "OFF ❌");

    handlePlantButtons();
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
  handlePlantButtons(); 
}





