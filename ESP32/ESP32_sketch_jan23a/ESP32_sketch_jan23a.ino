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
  {32, "BOKCHOY",  3000, 1800, 21, 50, 75},
  {33, "PECHAY",  2900, 1750, 22, 50, 75},
  {34, "MUSTASA",  2800, 1700, 23, 55, 75}
};

/************ OUTPUT ************/
const int pumpPin = 18;

/************ SYSTEM SWITCH ************/
const int LOCK_SWITCH = 19;
const int SWITCH_LED  = 2;

/************ PLANT BUTTONS ************/
const int bokchoyBtn  = 25;
const int petchayBtn  = 26;
const int mustasaBtn  = 27;

/************ STATE ************/
volatile bool systemEnabled = false;
volatile bool systemSwitchPressed = false;
volatile bool plantBtnPressed[3] = {false, false, false};

bool buttonForceOff[3] = {false, false, false};
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

/************ INDIVIDUAL SENSOR POST TIMING ************/
unsigned long lastMoisturePost[3] = {0, 0, 0};
unsigned long lastWaterLevelPost = 0;
const unsigned long moisturePostInterval = 600000; // 10 minutes
const unsigned long waterLevelPostInterval = 600000; // 10 minutes

bool lastMoistureLowState[3] = {false, false, false};
bool lowMoistureAlertSent[3] = {false, false, false};

bool lastWaterLevelLowState = false;
bool lowWaterLevelAlertSent = false;

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

/************ ULTRASONIC SENSOR FUNCTIONS ************/
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

int getWaterLevelPercentage() {
  float distance = getDistanceInches();
  
  if (distance > MAX_DISTANCE_INCHES) distance = MAX_DISTANCE_INCHES;
  if (distance < 0) distance = 0;
  
  int percentage = (int)((MAX_DISTANCE_INCHES - distance) / MAX_DISTANCE_INCHES * 100.0);
  percentage = constrain(percentage, 0, 100);
  
  return percentage;
}

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

void turnOffAllValvesAndPump() {
  for (int i = 0; i < 3; i++) {
    buttonForceOff[i] = false;
    wateringState[i] = false;
    nodeJsOverride[i] = false;
    nodeJsForceOff[i] = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
}

/************ UPDATE PUMP STATE - INSTANT ************/
void updatePumpState() {
  bool pumpNeeded = false;
  
  for (int i = 0; i < 3; i++) {
    bool valveOpen = false;
    
    // Priority: Node.js override > Button force off > Auto
    if (nodeJsOverride[i]) {
      valveOpen = !nodeJsForceOff[i];
    } else if (buttonForceOff[i]) {
      valveOpen = false;
    } else {
      valveOpen = wateringState[i];
    }
    
    // Apply valve state IMMEDIATELY
    setRelay(sensors[i].valvePin, valveOpen);
    
    if (valveOpen) {
      pumpNeeded = true;
    }
  }
  
  setRelay(pumpPin, pumpNeeded);
}

/************ NODE.JS COMMAND HANDLER - REAL-TIME ************/
void handleNodeJsCommand(String command) {
  command.trim();
  command.toUpperCase();
  
  // BOKCHOY COMMANDS
  if (command == "BOKCHOY_OFF") {
    nodeJsOverride[0] = true;
    nodeJsForceOff[0] = true;
    buttonForceOff[0] = false;
    Serial.println("🔴 NODE.JS → BOKCHOY FORCED OFF ⚡");
    
  } else if (command == "BOKCHOY_AUTO") {
    nodeJsOverride[0] = false;
    nodeJsForceOff[0] = false;
    buttonForceOff[0] = false;
    Serial.println("🟢 NODE.JS → BOKCHOY AUTO MODE ⚡");
  }
  
  // PECHAY COMMANDS
  else if (command == "PECHAY_OFF") {
    nodeJsOverride[1] = true;
    nodeJsForceOff[1] = true;
    buttonForceOff[1] = false;
    Serial.println("🔴 NODE.JS → PECHAY FORCED OFF ⚡");
    
  } else if (command == "PECHAY_AUTO") {
    nodeJsOverride[1] = false;
    nodeJsForceOff[1] = false;
    buttonForceOff[1] = false;
    Serial.println("🟢 NODE.JS → PECHAY AUTO MODE ⚡");
  }
  
  // MUSTASA COMMANDS
  else if (command == "MUSTASA_OFF") {
    nodeJsOverride[2] = true;
    nodeJsForceOff[2] = true;
    buttonForceOff[2] = false;
    Serial.println("🔴 NODE.JS → MUSTASA FORCED OFF ⚡");
    
  } else if (command == "MUSTASA_AUTO") {
    nodeJsOverride[2] = false;
    nodeJsForceOff[2] = false;
    buttonForceOff[2] = false;
    Serial.println("🟢 NODE.JS → MUSTASA AUTO MODE ⚡");
  }
  
  updatePumpState();
}

/************ INDIVIDUAL SENSOR POST FUNCTIONS ************/
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

void checkAndPostMoistureSensors() {
  unsigned long now = millis();
  
  for (int i = 0; i < 3; i++) {
    int raw = analogRead(sensors[i].pin);
    int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
    percent = constrain(percent, 0, 100);
    
    bool isLowMoisture = (percent < sensors[i].minMoisture);
    
    // WATERING CYCLE LOGIC:
    // Step 1: Moisture becomes LOW → Send alert ONCE
    // Step 2: System waters → Moisture goes back to NORMAL
    // Step 3: Flag resets → Ready for next cycle
    // Step 4: Moisture becomes LOW again → Send new alert
    
    if (isLowMoisture) {
      // Moisture is currently LOW
      if (!lastMoistureLowState[i]) {
        // TRANSITION: Normal → Low (START OF NEW WATERING CYCLE)
        if (!lowMoistureAlertSent[i]) {
          int sensorId = 5 + i;
          postIndividualSensor(sensorId, percent, "active");
          lowMoistureAlertSent[i] = true;
          Serial.println("🚨 " + sensors[i].name + " MOISTURE LOW - ALERT SENT (Watering Cycle Started)!");
        }
      }
      // else: Moisture is STILL low (already sent alert, don't send again)
    } else {
      // Moisture is currently NORMAL
      if (lastMoistureLowState[i]) {
        // TRANSITION: Low → Normal (END OF WATERING CYCLE)
        lowMoistureAlertSent[i] = false; // Reset flag for next cycle
        Serial.println("✅ " + sensors[i].name + " moisture back to NORMAL - ready for next cycle");
      }
      
      // Regular 10-minute posting when moisture is normal
      if (now - lastMoisturePost[i] >= moisturePostInterval) {
        int sensorId = 5 + i;
        postIndividualSensor(sensorId, percent, "inactive");
        lastMoisturePost[i] = now;
        Serial.println("📊 " + sensors[i].name + " normal moisture - 10min update");
      }
    }
    
    lastMoistureLowState[i] = isLowMoisture;
  }
}

void checkAndPostWaterLevel() {
  unsigned long now = millis();
  int waterLevel = getWaterLevelPercentage();
  
  bool isLowWater = (waterLevel <= 10);
  
  if (isLowWater) {
    // Water level is currently LOW
    if (!lastWaterLevelLowState) {
      // TRANSITION: Normal → Low
      if (!lowWaterLevelAlertSent) {
        postIndividualSensor(8, waterLevel, "active");
        lowWaterLevelAlertSent = true;
        Serial.println("🚨 WATER LEVEL LOW (≤10%) - ALERT SENT!");
      }
    }
    // else: Water is STILL low (already sent alert, don't send again)
  } else {
    // Water level is currently NORMAL
    if (lastWaterLevelLowState) {
      // TRANSITION: Low → Normal
      lowWaterLevelAlertSent = false; // Reset flag
      Serial.println("✅ Water level back to NORMAL");
    }
    
    // Regular 10-minute posting when water is normal
    if (now - lastWaterLevelPost >= waterLevelPostInterval) {
      postIndividualSensor(8, waterLevel, "inactive");
      lastWaterLevelPost = now;
      Serial.println("📊 Water level normal - 10min update");
    }
  }
  
  lastWaterLevelLowState = isLowWater;
}

/************ SEND READINGS - NON-BLOCKING ************/
void sendReadings(const char* reason) {
  if (!wifiConnected) return;

  HTTPClient http;
  http.setTimeout(500);
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"reason\":\"" + String(reason) + "\",";
  
  float distance = getDistanceInches();
  int waterLevel = getWaterLevelPercentage();
  payload += "\"waterLevel\":{";
  payload += "\"distance\":" + String(distance, 2) + ",";
  payload += "\"percentage\":" + String(waterLevel);
  payload += "},";
  
  payload += "\"sensors\":[";

  for (int i = 0; i < 3; i++) {
    int raw = analogRead(sensors[i].pin);
    int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
    percent = constrain(percent, 0, 100);

    bool actualValveState = false;
    if (nodeJsOverride[i]) {
      actualValveState = !nodeJsForceOff[i];
    } else if (buttonForceOff[i]) {
      actualValveState = false;
    } else {
      actualValveState = wateringState[i];
    }

    payload += "{";
    payload += "\"id\":" + String(i+1) + ",";
    payload += "\"name\":\"" + sensors[i].name + "\",";
    payload += "\"raw\":" + String(raw) + ",";
    payload += "\"percent\":" + String(percent) + ",";
    payload += "\"valve\":" + String(actualValveState ? "1" : "0");
    payload += "}";

    if (i < 2) payload += ",";
  }

  payload += "]}";
  
  http.POST(payload);
  http.end();
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

/************ WIFI HANDLER - LIGHTWEIGHT ************/
void handleWiFi() {
  unsigned long now = millis();
  
  if (now - lastWiFiCheck < wifiCheckInterval) {
    return;
  }
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

/************ HANDLE SYSTEM SWITCH - INSTANT ************/
void handleSystemSwitch() {
  if (systemSwitchPressed) {
    systemSwitchPressed = false;
    systemEnabled = !systemEnabled;
    
    if (systemEnabled) {
      Serial.println("\n🟢🟢🟢 SYSTEM ON - INSTANT 🟢🟢🟢\n");
      digitalWrite(SWITCH_LED, HIGH);
      lastReadTime = 0;
      WiFi.mode(WIFI_STA);
      wifiShouldBeConnected = true;
    } else {
      Serial.println("\n🔴🔴🔴 SYSTEM OFF - INSTANT 🔴🔴🔴\n");
      digitalWrite(SWITCH_LED, LOW);
      turnOffAllValvesAndPump();
      wifiShouldBeConnected = false;
    }
  }
}

/************ HANDLE PLANT BUTTONS - TRUE INSTANT ************/
void handlePlantButtons() {
  for (int i = 0; i < 3; i++) {
    if (plantBtnPressed[i]) {
      plantBtnPressed[i] = false;
      
      // Clear Node.js override when physical button is pressed
      nodeJsOverride[i] = false;
      nodeJsForceOff[i] = false;
      
      // TOGGLE: OFF ↔ AUTO
      buttonForceOff[i] = !buttonForceOff[i];
      
      if (buttonForceOff[i]) {
        // Button pressed → FORCE OFF
        setRelay(sensors[i].valvePin, false);
        Serial.println("🔴 " + sensors[i].name + " → FORCED OFF ⚡INSTANT⚡");
      } else {
        // Button pressed again → AUTO MODE
        Serial.println("🟢 " + sensors[i].name + " → AUTO MODE ⚡INSTANT⚡");
      }
      
      // Update pump IMMEDIATELY
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
  Serial.println("🚀 ESP32 READY - WATERING CYCLE MODE");
  Serial.println("⚡ PLANT BUTTONS: ANYTIME INSTANT");
  Serial.println("   • Press = FORCE OFF (ANYTIME)");
  Serial.println("   • Press Again = AUTO MODE (ANYTIME)");
  Serial.println("📡 WiFi: ONLY WHEN SYSTEM ON");
  Serial.println("🤖 SENSORS: AUTO (5s cycle)");
  Serial.println("💧 ULTRASONIC: TRIG=16, ECHO=17");
  Serial.println("🌐 NODE.JS COMMANDS: REAL-TIME");
  Serial.println("📤 INDIVIDUAL POSTS:");
  Serial.println("   • Moisture LOW: ONCE per watering cycle");
  Serial.println("   • Moisture NORMAL: Every 10min");
  Serial.println("   • Water LOW (≤10%): ONCE per cycle");
  Serial.println("   • Water NORMAL: Every 10min");
  Serial.println("========================================\n");
}

/************ LOOP - MAXIMUM BUTTON RESPONSIVENESS ************/
void loop() {
  // ⚡⚡⚡ CRITICAL: CHECK BUTTONS FIRST - ALWAYS ⚡⚡⚡
  handlePlantButtons();
  handleSystemSwitch();

  if (!systemEnabled) {
    turnOffAllValvesAndPump();
    handleWiFi();
    handlePlantButtons(); // Check again before delay
    delay(1); // Minimal delay
    return;
  }

  // === SYSTEM IS ON ===
  
  // Check buttons between every operation
  handlePlantButtons();
  handleWiFi();
  
  handlePlantButtons();
  if (wifiConnected) {
    webSocket.loop();
  }

  handlePlantButtons();

  // === CHECK AND POST INDIVIDUAL SENSORS ===
  if (wifiConnected) {
    checkAndPostMoistureSensors();
    checkAndPostWaterLevel();
  }

  handlePlantButtons();

  // === SENSOR READING - EVERY 5s ===
  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();

    Serial.println("\n📊 SENSOR READING (5s update):");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    handlePlantButtons(); // Check before ultrasonic read
    
    float distance = getDistanceInches();
    int waterLevel = getWaterLevelPercentage();
    
    Serial.print("💧 WATER TANK | DISTANCE: ");
    Serial.print(distance, 2);
    Serial.print(" inches | LEVEL: ");
    Serial.print(waterLevel);
    Serial.println("%");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    handlePlantButtons(); // Check before sensor loop

    for (int i = 0; i < 3; i++) {
      handlePlantButtons(); // Check during each sensor read
      
      int raw = analogRead(sensors[i].pin);
      int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
      percent = constrain(percent, 0, 100);

      // AUTO MODE LOGIC (only if NO overrides)
      if (!nodeJsOverride[i] && !buttonForceOff[i]) {
        if (percent < sensors[i].minMoisture) {
          wateringState[i] = true;
        }
        
        if (wateringState[i] && percent >= sensors[i].maxMoisture) {
          wateringState[i] = false;
        }
      }

      // Determine actual state
      bool actualValveState = false;
      String mode = "AUTO";
      
      if (nodeJsOverride[i]) {
        actualValveState = !nodeJsForceOff[i];
        mode = nodeJsForceOff[i] ? "NODE.JS-OFF" : "NODE.JS";
      } else if (buttonForceOff[i]) {
        actualValveState = false;
        mode = "BUTTON-OFF";
      } else {
        actualValveState = wateringState[i];
        mode = "AUTO";
      }

      // Print status
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

    handlePlantButtons(); // Check after sensor reads

    // Update all valve states based on current logic
    updatePumpState();

    Serial.print("💧 PUMP: ");
    bool pumpOn = digitalRead(pumpPin) == LOW;
    Serial.println(pumpOn ? "ON ✅" : "OFF ❌");

    handlePlantButtons(); // Check before HTTP POST

    if (wifiConnected) {
      sendReadings("PERIODIC");
    }
    
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  // Final button check before loop repeats
  handlePlantButtons();
}