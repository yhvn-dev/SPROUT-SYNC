#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid     = "4G-MIFI-8339";
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
  {33, "PECHAY",  2900, 1750, 22, 50, 75},
  {34, "MUSTASA", 2800, 1700, 23, 55, 75}
};

/************ OUTPUT ************/
const int pumpPin = 18;

/************ SYSTEM SWITCH ************/
const int LOCK_SWITCH = 19;
const int SWITCH_LED  = 5;

/************ PLANT BUTTONS ************/
const int bokchoyBtn = 25;
const int petchayBtn = 26;
const int mustasaBtn = 27;
  
/************ PLANT LED PINS ************/
const int BOKCHOY_LED = 4;
const int PECHAY_LED  = 13;
const int MUSTASA_LED = 14;     
const int plantLedPins[3] = {BOKCHOY_LED, PECHAY_LED, MUSTASA_LED};

// ============================================================
//  SHARED STATE
// ============================================================
portMUX_TYPE stateMux = portMUX_INITIALIZER_UNLOCKED;

volatile bool systemEnabled       = false;
volatile bool systemSwitchPressed = false;
volatile bool plantBtnPressed[3]  = {false, false, false};

bool buttonManualOn[3]  = {false, false, false};
bool buttonManualOff[3] = {false, false, false};
bool wateringState[3]   = {false, false, false};

bool nodeJsOverride[3] = {false, false, false};
bool nodeJsForceOff[3] = {false, false, false};

volatile bool wifiShouldBeConnected = false;
bool wifiConnected = false;

/************ TIMING ************/
unsigned long lastReadTime  = 0;
const unsigned long readInterval = 5000;

/************ MOISTURE POSTING - 10 MIN ************/
unsigned long lastMoisturePost[3]        = {0, 0, 0};
const unsigned long moisturePostInterval = 600000;

/************ WATERING CYCLE TRACKING ************/
bool previousWateringState[3]  = {false, false, false};
bool wateringCycleAlertSent[3] = {false, false, false};

/************ WATER LEVEL TRACKING ************/
unsigned long lastWaterLevelPost           = 0;
const unsigned long waterLevelPostInterval = 900000;

bool waterLevelFirstReadingDone = false;
volatile int stableWaterLevel   = 0;

bool waterLevel30AlertSent = false;
bool waterLevel20AlertSent = false;
int  previousWaterLevel    = 100;
bool waterLevelBootSent    = false;

// ============================================================
//  QUEUES
//  postQueue    — Core 0 queues HTTP jobs, Core 1 sends them
//  commandQueue — Core 1 WS fills it, Core 0 reads it
// ============================================================
struct PostJob {
  int  sensorId;
  int  value;
  char status[16];
};

QueueHandle_t postQueue;
QueueHandle_t commandQueue;

// ============================================================
//  ISRs
// ============================================================
void IRAM_ATTR systemSwitchISR() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last > 200) { systemSwitchPressed = true; }
  last = now;
}
void IRAM_ATTR bokchoyISR() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last > 200) { plantBtnPressed[0] = true; }
  last = now;
}
void IRAM_ATTR petchayISR() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last > 200) { plantBtnPressed[1] = true; }
  last = now;
}
void IRAM_ATTR mustasaISR() {
  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last > 200) { plantBtnPressed[2] = true; }
  last = now;
}

// ============================================================
//  HELPERS
// ============================================================
void setRelay(int pin, bool on)  { digitalWrite(pin, on ? LOW : HIGH); }
void setSwitchLED(bool on)       { digitalWrite(SWITCH_LED, on ? LOW : HIGH); }

bool getValveState(int i) {
  if (!systemEnabled)    return false;
  if (nodeJsOverride[i]) return !nodeJsForceOff[i];
  if (buttonManualOn[i]) return true;
  if (buttonManualOff[i])return false;
  return wateringState[i];
}

void updatePlantLEDs() {
  for (int i = 0; i < 3; i++)
    digitalWrite(plantLedPins[i], getValveState(i) ? HIGH : LOW);
}

void turnOffAllValvesAndPump() {
  for (int i = 0; i < 3; i++) {
    buttonManualOn[i] = buttonManualOff[i] = wateringState[i] = false;
    nodeJsOverride[i] = nodeJsForceOff[i]  = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
  updatePlantLEDs();
}

void updatePumpState() {
  bool pumpNeeded = false;
  int  waterLevel = stableWaterLevel;

  if (waterLevel <= 20) {
    for (int i = 0; i < 3; i++) setRelay(sensors[i].valvePin, false);
    setRelay(pumpPin, false);
    updatePlantLEDs();
    return;
  }
  for (int i = 0; i < 3; i++) {
    bool open = getValveState(i);
    setRelay(sensors[i].valvePin, open);
    if (open) pumpNeeded = true;
  }
  setRelay(pumpPin, pumpNeeded);
  updatePlantLEDs();
}

// Queue an HTTP POST (non-blocking, safe to call from Core 0)
void queuePost(int sensorId, int value, const char* status) {
  PostJob job;
  job.sensorId = sensorId;
  job.value    = value;
  strncpy(job.status, status, sizeof(job.status) - 1);
  job.status[sizeof(job.status) - 1] = '\0';
  xQueueSend(postQueue, &job, 0);
}

// ============================================================
//  SENSOR HELPERS
// ============================================================
float getDistanceInches() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  return duration / 74.0 / 2.0;
}

int getWaterLevelPercentage() {
  float distance = getDistanceInches();
  if (distance > MAX_DISTANCE_INCHES) distance = MAX_DISTANCE_INCHES;
  if (distance < MIN_DISTANCE_INCHES) distance = MIN_DISTANCE_INCHES;
  return constrain((int)(100.0 - (distance / MAX_DISTANCE_INCHES * 100.0)), 0, 100);
}

int getMoisturePercent(int i) {
  int raw     = analogRead(sensors[i].pin);
  int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
  return constrain(percent, 0, 100);
}

// ============================================================
//  CORE 0 TASK — control (buttons, switch, sensors, watering)
//  NO WiFi, NO HTTP, NO WebSocket here. Runs instantly always.
// ============================================================
void controlTask(void* pvParameters) {
  for (;;) {

    // ── 1. System switch ──────────────────────────────────────
    if (systemSwitchPressed) {
      systemSwitchPressed = false;
      systemEnabled = !systemEnabled;

      if (systemEnabled) {
        Serial.println("\n🟢🟢🟢 SYSTEM ON 🟢🟢🟢\n");
        setSwitchLED(true);
        updatePlantLEDs();
        portENTER_CRITICAL(&stateMux);
        wifiShouldBeConnected = true;
        portEXIT_CRITICAL(&stateMux);

        unsigned long now = millis();
        lastReadTime = 0;
        for (int i = 0; i < 3; i++) {
          lastMoisturePost[i]       = now;
          previousWateringState[i]  = false;
          wateringCycleAlertSent[i] = false;
        }
        waterLevelFirstReadingDone = false;
        stableWaterLevel           = 0;
        lastWaterLevelPost         = now;
        previousWaterLevel         = 100;
        waterLevel30AlertSent      = false;
        waterLevel20AlertSent      = false;
        waterLevelBootSent         = false;

      } else {
        Serial.println("\n🔴🔴🔴 SYSTEM OFF 🔴🔴🔴\n");
        setSwitchLED(false);
        turnOffAllValvesAndPump();
        portENTER_CRITICAL(&stateMux);
        wifiShouldBeConnected = false;
        portEXIT_CRITICAL(&stateMux);
      }
    }

    // ── 2. Plant buttons ─────────────────────────────────────
    for (int i = 0; i < 3; i++) {
      if (!plantBtnPressed[i]) continue;
      plantBtnPressed[i] = false;
      if (!systemEnabled) continue;

      nodeJsOverride[i] = nodeJsForceOff[i] = false;

      if (buttonManualOn[i]) {
        buttonManualOn[i]  = false;
        buttonManualOff[i] = true;
        setRelay(sensors[i].valvePin, false);
        Serial.println("🔴 " + sensors[i].name + " → BUTTON OFF ⚡INSTANT⚡");
      } else {
        buttonManualOn[i]  = true;
        buttonManualOff[i] = false;
        setRelay(sensors[i].valvePin, true);
        Serial.println("🟢 " + sensors[i].name + " → BUTTON ON ⚡INSTANT⚡");
      }
      updatePlantLEDs();
      updatePumpState();
    }

    // ── 3. Apply Node.js commands from queue ─────────────────
    String* cmdPtr = nullptr;
    if (xQueueReceive(commandQueue, &cmdPtr, 0) == pdTRUE && cmdPtr != nullptr) {
      String command = *cmdPtr;
      delete cmdPtr;
      command.trim();
      command.toUpperCase();

      auto applyCmd = [&](int idx, bool forceOff, const char* label) {
        nodeJsOverride[idx] = forceOff;
        nodeJsForceOff[idx] = forceOff;
        buttonManualOn[idx] = buttonManualOff[idx] = false;
        Serial.println(String(forceOff ? "🔴" : "🟢") + " NODE.JS → " + label);
      };

      if      (command == "BOKCHOY_OFF")  applyCmd(0, true,  "BOKCHOY FORCED OFF");
      else if (command == "BOKCHOY_AUTO") applyCmd(0, false, "BOKCHOY AUTO MODE");
      else if (command == "PECHAY_OFF")   applyCmd(1, true,  "PECHAY FORCED OFF");
      else if (command == "PECHAY_AUTO")  applyCmd(1, false, "PECHAY AUTO MODE");
      else if (command == "MUSTASA_OFF")  applyCmd(2, true,  "MUSTASA FORCED OFF");
      else if (command == "MUSTASA_AUTO") applyCmd(2, false, "MUSTASA AUTO MODE");

      updatePumpState();
    }

    // ── 4. Sensor read + auto-watering every 5s ──────────────
    if (systemEnabled && millis() - lastReadTime >= readInterval) {
      lastReadTime = millis();

      Serial.println("\n📊 SENSOR READING (5s update):");
      Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Water level
      float distance   = getDistanceInches();
      int   waterLevel = getWaterLevelPercentage();

      stableWaterLevel = waterLevel;
      if (!waterLevelFirstReadingDone) {
        waterLevelFirstReadingDone = true;
        Serial.println("✅ First water level reading: " + String(waterLevel) + "%");
      }

      Serial.print("💧 WATER TANK | DISTANCE: ");
      Serial.print(distance, 2);
      Serial.print(" inches | LEVEL: ");
      Serial.print(waterLevel);
      if (waterLevel <= 20)      Serial.println("% ⚠️ CRITICAL - PUMP DISABLED");
      else if (waterLevel <= 30) Serial.println("% ⚠️ LOW");
      else                       Serial.println("% ✓");

      // Check water level alerts — queue posts, don't block
      if (waterLevelFirstReadingDone && !waterLevelBootSent && wifiConnected) {
        const char* st = (waterLevel <= 30) ? "active" : "inactive";
        queuePost(8, waterLevel, st);
        waterLevelBootSent = true;
        if (waterLevel <= 30) waterLevel30AlertSent = true;
        if (waterLevel <= 20) waterLevel20AlertSent = true;
        previousWaterLevel = waterLevel;
      }

      if (waterLevel <= 30 && previousWaterLevel > 30 && !waterLevel30AlertSent) {
        queuePost(8, waterLevel, "active");
        waterLevel30AlertSent = true;
      }
      if (waterLevel <= 20 && previousWaterLevel > 20 && !waterLevel20AlertSent) {
        queuePost(8, waterLevel, "active");
        waterLevel20AlertSent = true;
      }
      if (waterLevel > 35) waterLevel30AlertSent = false;
      if (waterLevel > 25) waterLevel20AlertSent = false;

      if (millis() - lastWaterLevelPost >= waterLevelPostInterval) {
        const char* st = (waterLevel <= 30) ? "active" : "inactive";
        queuePost(8, waterLevel, st);
        lastWaterLevelPost = millis();
        Serial.println("📅 15-min water level update queued: " + String(waterLevel) + "%");
      }
      previousWaterLevel = waterLevel;

      Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Moisture + auto-watering
      for (int i = 0; i < 3; i++) {
        int raw     = analogRead(sensors[i].pin);
        int percent = getMoisturePercent(i);

        // Auto watering logic
        if (!nodeJsOverride[i] && !buttonManualOn[i] && !buttonManualOff[i]) {
          if (percent < sensors[i].minMoisture)  wateringState[i] = true;
          if (wateringState[i] && percent >= sensors[i].maxMoisture) wateringState[i] = false;
        }

        // Watering cycle started?
        bool currentlyWatering = getValveState(i);
        if (currentlyWatering && !previousWateringState[i]) {
          if (!wateringCycleAlertSent[i]) {
            queuePost(5 + i, percent, "active");
            wateringCycleAlertSent[i] = true;
            Serial.println("🚨 " + sensors[i].name + " WATERING CYCLE STARTED — post queued");
          }
        } else if (!currentlyWatering && previousWateringState[i]) {
          wateringCycleAlertSent[i] = false;
          Serial.println("✅ " + sensors[i].name + " WATERING CYCLE ENDED");
        }
        previousWateringState[i] = currentlyWatering;

        // 10-min moisture post
        if (millis() - lastMoisturePost[i] >= moisturePostInterval) {
          const char* st = (percent < sensors[i].minMoisture) ? "active" : "inactive";
          queuePost(5 + i, percent, st);
          lastMoisturePost[i] = millis();
          Serial.println("📊 " + sensors[i].name + " 10-min update queued: " + String(percent) + "%");
        }

        String mode = "AUTO";
        if (nodeJsOverride[i]) mode = nodeJsForceOff[i] ? "NODE.JS-OFF" : "NODE.JS-ON";
        else if (buttonManualOn[i])  mode = "BUTTON-ON";
        else if (buttonManualOff[i]) mode = "BUTTON-OFF";

        Serial.print("🌱 ");
        Serial.print(sensors[i].name);
        Serial.print(" | RAW:");
        Serial.print(raw);
        Serial.print(" | ");
        Serial.print(percent);
        Serial.print("% | MODE:");
        Serial.print(mode);
        Serial.print(" | VALVE:");
        Serial.println(currentlyWatering ? "OPEN ✅" : "CLOSED ❌");
      }

      updatePumpState();

      bool pumpOn = digitalRead(pumpPin) == LOW;
      Serial.print("💧 PUMP: ");
      Serial.println(pumpOn ? "ON ✅" : "OFF ❌");
      Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }

    vTaskDelay(1 / portTICK_PERIOD_MS);  // yield 1ms, never blocks buttons
  }
}

// ============================================================
//  CORE 1 TASK — WiFi, WebSocket, HTTP POST
//  ALL blocking network calls live here. Core 0 never waits.
// ============================================================
void networkTask(void* pvParameters) {
  unsigned long lastWiFiCheck = 0;
  unsigned long lastAttempt   = 0;

  for (;;) {
    unsigned long now = millis();

    // ── WiFi management ──────────────────────────────────────
    bool shouldConnect;
    portENTER_CRITICAL(&stateMux);
    shouldConnect = wifiShouldBeConnected;
    portEXIT_CRITICAL(&stateMux);

    if (shouldConnect) {
      if (WiFi.status() == WL_CONNECTED) {
        if (!wifiConnected) {
          wifiConnected = true;
          Serial.println("🟢 WiFi CONNECTED: " + WiFi.localIP().toString());
          webSocket.begin(wsHost, wsPort, wsPath);
          webSocket.onEvent(webSocketEvent);
          webSocket.setReconnectInterval(5000);
        }
        webSocket.loop();   // only called here on Core 1
      } else {
        if (wifiConnected) {
          wifiConnected = false;
          Serial.println("🔴 WiFi lost");
        }
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

    // ── Drain HTTP post queue ─────────────────────────────────
    PostJob job;
    while (wifiConnected && xQueueReceive(postQueue, &job, 0) == pdTRUE) {
      HTTPClient http;
      http.setTimeout(500);
      http.begin(apiUrl);
      http.addHeader("Content-Type", "application/json");

      String payload = "{";
      payload += "\"sensor_id\":" + String(job.sensorId) + ",";
      payload += "\"value\":"     + String(job.value)    + ",";
      payload += "\"status\":\""  + String(job.status)   + "\"";
      payload += "}";

      int httpCode = http.POST(payload);
      if (httpCode > 0) {
        Serial.println("✅ Posted sensor_id " + String(job.sensorId) +
                       " | Value: " + String(job.value) +
                       " | Status: " + String(job.status));
      } else {
        Serial.println("❌ Failed sensor_id " + String(job.sensorId));
      }
      http.end();
    }

    vTaskDelay(10 / portTICK_PERIOD_MS);  // 10ms yield
  }
}

// ============================================================
//  WEBSOCKET EVENT (runs inside Core 1 networkTask)
// ============================================================
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("🟢 WebSocket Connected");
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("🔴 WebSocket Disconnected");
  } else if (type == WStype_TEXT) {
    String msg = String((char*)payload);
    msg.trim();
    Serial.println("📥 WS MESSAGE: " + msg);
    // Pass to Core 0 via queue (heap-allocated String)
    String* ptr = new String(msg);
    if (xQueueSend(commandQueue, &ptr, 0) != pdTRUE) {
      delete ptr;  // queue full, discard
    }
  }
}

// ============================================================
//  SETUP
// ============================================================
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
  pinMode(SWITCH_LED,  OUTPUT);
  setSwitchLED(false);

  pinMode(bokchoyBtn, INPUT_PULLUP);
  pinMode(petchayBtn, INPUT_PULLUP);
  pinMode(mustasaBtn, INPUT_PULLUP);

  pinMode(BOKCHOY_LED, OUTPUT); digitalWrite(BOKCHOY_LED, LOW);
  pinMode(PECHAY_LED,  OUTPUT); digitalWrite(PECHAY_LED,  LOW);
  pinMode(MUSTASA_LED, OUTPUT); digitalWrite(MUSTASA_LED, LOW);

  attachInterrupt(digitalPinToInterrupt(LOCK_SWITCH), systemSwitchISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(bokchoyBtn),  bokchoyISR,      FALLING);
  attachInterrupt(digitalPinToInterrupt(petchayBtn),  petchayISR,      FALLING);
  attachInterrupt(digitalPinToInterrupt(mustasaBtn),  mustasaISR,      FALLING);

  WiFi.mode(WIFI_OFF);

  // Create queues
  postQueue    = xQueueCreate(20, sizeof(PostJob));   // up to 20 pending HTTP posts
  commandQueue = xQueueCreate(10, sizeof(String*));   // up to 10 WS commands

  // Pin controlTask to Core 0 (real-time control, no network)
  xTaskCreatePinnedToCore(controlTask, "ControlTask", 8192, NULL, 2, NULL, 0);

  // Pin networkTask to Core 1 (WiFi/HTTP/WS, can block freely)
  xTaskCreatePinnedToCore(networkTask, "NetworkTask", 8192, NULL, 1, NULL, 1);

  Serial.println("\n========================================");
  Serial.println("🚀 ESP32 DUAL-CORE READY");
  Serial.println("⚡ Core 0 → Control (buttons, switch, sensors)");
  Serial.println("📡 Core 1 → Network (WiFi, HTTP, WebSocket)");
  Serial.println("🔘 Switch/Buttons: ZERO delay, always responsive");
  Serial.println("========================================\n");
}

// ============================================================
//  LOOP — empty, both tasks run independently on their cores
// ============================================================
void loop() {
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}