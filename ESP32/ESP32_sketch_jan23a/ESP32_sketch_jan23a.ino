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
const float MAX_DISTANCE_INCHES = 36.0;  // Maximum distance when tank is EMPTY
const float MIN_DISTANCE_INCHES = 0.0;   // Minimum distance when tank is FULL

/************ SENSORS / VALVES ************/
struct PlantSensor {
  int pin;
  String name;
  int dryValue;   // HIGH raw value = DRY soil
  int wetValue;   // LOW raw value = WET soil
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

/************ MOISTURE SENSOR POSTING - 10 MINUTE INTERVALS ************/
unsigned long lastMoisturePost[3] = {0, 0, 0};
const unsigned long moisturePostInterval = 600000; // 10 minutes

/************ WATERING CYCLE TRACKING - ONE POST PER CYCLE START ************/
bool previousWateringState[3] = {false, false, false};
bool wateringCycleAlertSent[3] = {false, false, false};

/************ WATER LEVEL TRACKING - SMART POSTING WITH STABILIZATION ************/
unsigned long lastWaterLevelPost = 0;
const unsigned long waterLevelPostInterval = 900000; // 15 minutes

// Water level stabilization - wait for first 5s reading before sending ANY data
bool waterLevelFirstReadingDone = false;
int stableWaterLevel = 0;

// Threshold tracking - one alert per threshold crossing
bool waterLevel30AlertSent = false;
bool waterLevel20AlertSent = false;

// Previous level tracking for detecting threshold crossings
int previousWaterLevel = 100;

// Boot flag - to send water level AFTER first stable reading
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

/************ ACCURATE WATER LEVEL CALCULATION - FIXED ************/
int getWaterLevelPercentage() {
  float distance = getDistanceInches();
  
  // Constrain distance to valid range
  if (distance > MAX_DISTANCE_INCHES) distance = MAX_DISTANCE_INCHES;
  if (distance < MIN_DISTANCE_INCHES) distance = MIN_DISTANCE_INCHES;
  
  // CRITICAL FIX: Water level is INVERTED from distance
  // HIGH distance (36 inches) = EMPTY tank (0% water)
  // LOW distance (0 inches) = FULL tank (100% water)
  // Formula: 100% - (distance / max_distance * 100%)
  
  int percentage = (int)(100.0 - (distance / MAX_DISTANCE_INCHES * 100.0));
  percentage = constrain(percentage, 0, 100);
  
  return percentage;
}

/************ ACCURATE MOISTURE READING - FIXED MAPPING ************/
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
    buttonForceOff[i] = false;
    wateringState[i] = false;
    nodeJsOverride[i] = false;
    nodeJsForceOff[i] = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
}

/************ UPDATE PUMP STATE - WITH WATER LEVEL CHECK ************/
void updatePumpState() {
  bool pumpNeeded = false;
  
  // ⚠️ NEW: Check water level - disable pump if water level <= 20%
  int currentWaterLevel = getWaterLevelPercentage();
  
  if (currentWaterLevel <= 20) {
    // Water level too low - force all valves closed and pump off
    for (int i = 0; i < 3; i++) {
      setRelay(sensors[i].valvePin, false);
    }
    setRelay(pumpPin, false);
    
    static unsigned long lastLowWaterWarning = 0;
    if (millis() - lastLowWaterWarning > 30000) { // Print warning every 30 seconds
      Serial.println("⚠️⚠️⚠️ WATER LEVEL TOO LOW (" + String(currentWaterLevel) + "%) - PUMP DISABLED ⚠️⚠️⚠️");
      lastLowWaterWarning = millis();
    }
    return;
  }
  
  // Water level OK (>20%) - normal operation
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

/************ POST INDIVIDUAL SENSOR - HELPER FUNCTION ************/
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

/************ CHECK AND POST MOISTURE SENSORS - 10 MINUTE INTERVALS ************/
void checkAndPostMoistureSensors() {
  unsigned long now = millis();
  
  for (int i = 0; i < 3; i++) {
    // Check if 10 minutes have passed since last post
    if (now - lastMoisturePost[i] >= moisturePostInterval) {
      int percent = getMoisturePercent(i);
      
      // Determine status based on moisture level
      String status = (percent < sensors[i].minMoisture) ? "active" : "inactive";
      
      // Post the data
      postIndividualSensor(5 + i, percent, status);
      
      // Update last post time
      lastMoisturePost[i] = now;
      
      Serial.println("📊 " + sensors[i].name + " 10-minute update: " + String(percent) + "% (" + status + ")");
    }
  }
}

/************ CHECK WATERING CYCLE START - SEND DATA ONCE PER CYCLE ************/
void checkWateringCycleStart() {
  for (int i = 0; i < 3; i++) {
    // Determine current actual watering state
    bool currentlyWatering = false;
    
    if (nodeJsOverride[i]) {
      currentlyWatering = !nodeJsForceOff[i];
    } else if (buttonForceOff[i]) {
      currentlyWatering = false;
    } else {
      currentlyWatering = wateringState[i];
    }
    
    // WATERING CYCLE LOGIC - SEND DATA ONLY ONCE AT START OF CYCLE
    if (currentlyWatering && !previousWateringState[i]) {
      // ⚡ TRANSITION: Not watering → Watering (CYCLE START)
      if (!wateringCycleAlertSent[i]) {
        int percent = getMoisturePercent(i);
        
        // Post the moisture data that triggered watering
        postIndividualSensor(5 + i, percent, "active");
        wateringCycleAlertSent[i] = true;
        
        Serial.println("🚨 " + sensors[i].name + " WATERING CYCLE STARTED!");
        Serial.println("   ├─ Moisture: " + String(percent) + "%");
        Serial.println("   └─ Data sent (ONCE per cycle)");
      }
    } 
    else if (!currentlyWatering && previousWateringState[i]) {
      // ⚡ TRANSITION: Watering → Not watering (CYCLE END)
      wateringCycleAlertSent[i] = false;
      
      Serial.println("✅ " + sensors[i].name + " WATERING CYCLE ENDED");
      Serial.println("   └─ Ready for next cycle");
    }
    
    // Update previous state
    previousWateringState[i] = currentlyWatering;
  }
}

/************ CHECK AND POST WATER LEVEL - WAITS FOR FIRST 5S READING ************/
void checkAndPostWaterLevel() {
  // === CRITICAL FIX: WAIT FOR FIRST STABLE READING (5s cycle) ===
  if (!waterLevelFirstReadingDone) {
    // Don't send ANY water level data until we have the first stable reading
    Serial.println("⏳ Waiting for first water level reading (5s cycle)...");
    return;
  }
  
  unsigned long now = millis();
  int waterLevel = stableWaterLevel;
  
  // === 1. BOOT SEND - USING FIRST STABLE READING ===
  if (!waterLevelBootSent && wifiConnected) {
    String status = (waterLevel <= 30) ? "active" : "inactive";
    postIndividualSensor(8, waterLevel, status);
    waterLevelBootSent = true;
    
    Serial.println("🚀 BOOT WATER LEVEL SENT (STABLE READING)");
    Serial.println("   └─ Level: " + String(waterLevel) + "% ✓");
    
    // ⚡ NEW FIX: CHECK AND SEND THRESHOLD ALERTS AT BOOT TIME (ONE TIME ONLY)
    if (waterLevel <= 30) {
      if (!waterLevel30AlertSent) {
        postIndividualSensor(8, waterLevel, "active");
        waterLevel30AlertSent = true;
        Serial.println("⚠️ BOOT: Water level ≤30% alert sent: " + String(waterLevel) + "% (ONE TIME)");
      }
    }
    
    if (waterLevel <= 20) {
      if (!waterLevel20AlertSent) {
        postIndividualSensor(8, waterLevel, "active");
        waterLevel20AlertSent = true;
        Serial.println("🚨 BOOT: Water level ≤20% alert sent: " + String(waterLevel) + "% (ONE TIME)");
      }
    }
    
    // Set previousWaterLevel for future threshold crossings
    previousWaterLevel = waterLevel;
  }
  
  // === 2. THRESHOLD CROSSING - USING STABLE READING (DURING RUNTIME) ===
  if (waterLevel <= 30 && previousWaterLevel > 30 && !waterLevel30AlertSent) {
    postIndividualSensor(8, waterLevel, "active");
    waterLevel30AlertSent = true;
    Serial.println("⚠️ RUNTIME: Water level crossed ≤30% threshold: " + String(waterLevel) + "% (ONE TIME)");
  }
  
  if (waterLevel <= 20 && previousWaterLevel > 20 && !waterLevel20AlertSent) {
    postIndividualSensor(8, waterLevel, "active");
    waterLevel20AlertSent = true;
    Serial.println("🚨 RUNTIME: Water level crossed ≤20% threshold: " + String(waterLevel) + "% (ONE TIME)");
  }
  
  // === 3. RESET FLAGS WHEN WATER REFILLED ===
  if (waterLevel > 35) waterLevel30AlertSent = false;
  if (waterLevel > 25) waterLevel20AlertSent = false;
  
  // === 4. PERIODIC UPDATE (15 MINUTES) ===
  if (now - lastWaterLevelPost >= waterLevelPostInterval) {
    String status = (waterLevel <= 30) ? "active" : "inactive";
    postIndividualSensor(8, waterLevel, status);
    lastWaterLevelPost = now;
    Serial.println("📅 15-minute water level update: " + String(waterLevel) + "%");
  }
  
  previousWaterLevel = waterLevel;
}

/************ SEND READINGS - NON-BLOCKING (LEGACY - NOT USED) ************/
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
    int percent = getMoisturePercent(i);
    
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
    payload += "\"raw\":" + String(analogRead(sensors[i].pin)) + ",";
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
      lastReadTime = 0; // Force immediate sensor reading
      WiFi.mode(WIFI_STA);
      wifiShouldBeConnected = true;
      
      // Initialize moisture post timers
      unsigned long now = millis();
      for (int i = 0; i < 3; i++) {
        lastMoisturePost[i] = now;
        previousWateringState[i] = false;
        wateringCycleAlertSent[i] = false;
      }
      
      // === CRITICAL FIX: RESET WATER LEVEL FLAGS ===
      waterLevelFirstReadingDone = false;  // Wait for first 5s reading
      stableWaterLevel = 0;
      lastWaterLevelPost = now;
      previousWaterLevel = 100;
      waterLevel30AlertSent = false;
      waterLevel20AlertSent = false;
      waterLevelBootSent = false;
      
      Serial.println("⏳ Water level will be sent after first 5s reading cycle");
      
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
  Serial.println("🚀 ESP32 READY - ACCURATE READINGS");
  Serial.println("⚡ PLANT BUTTONS: ANYTIME INSTANT");
  Serial.println("   • Press = FORCE OFF (ANYTIME)");
  Serial.println("   • Press Again = AUTO MODE (ANYTIME)");
  Serial.println("📡 WiFi: ONLY WHEN SYSTEM ON");
  Serial.println("🤖 SENSORS: AUTO (5s cycle)");
  Serial.println("💧 ULTRASONIC: TRIG=16, ECHO=17");
  Serial.println("🌐 NODE.JS COMMANDS: REAL-TIME");
  Serial.println("📤 SMART DATA POSTING:");
  Serial.println("   • Moisture → Every 10 minutes (normal)");
  Serial.println("   • Moisture → START of watering cycle (ONCE)");
  Serial.println("   • Water → AFTER FIRST 5s READING (sensor_id: 8) ✓");
  Serial.println("   • Water → Every 15min (sensor_id: 8)");
  Serial.println("   • Water → ≤30% AT BOOT (sensor_id: 8) ✓ NEW FIX");
  Serial.println("   • Water → ≤20% AT BOOT (sensor_id: 8) ✓ NEW FIX");
  Serial.println("   • Water → ≤30% THRESHOLD CROSS (sensor_id: 8) ✓");
  Serial.println("   • Water → ≤20% THRESHOLD CROSS (sensor_id: 8) ✓");
  Serial.println("🔧 FIXED: All readings now ACCURATE!");
  Serial.println("   • High distance = Low water level ✓");
  Serial.println("   • Low distance = High water level ✓");
  Serial.println("   • Water level waits for 5s reading ✓");
  Serial.println("⚠️ PUMP DISABLED when water ≤20% ✓");
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
    handlePlantButtons();
    delay(1);
    return;
  }
  
  // === SYSTEM IS ON ===
  handlePlantButtons();
  handleWiFi();
  handlePlantButtons();
  
  if (wifiConnected) {
    webSocket.loop();
  }
  
  handlePlantButtons();
  
  // === CHECK WATERING CYCLE START ===
  if (wifiConnected) {
    checkWateringCycleStart();
  }
  
  handlePlantButtons();
  
  // === CHECK AND POST SENSORS (SMART INTERVALS) ===
  if (wifiConnected) {
    checkAndPostMoistureSensors();
    checkAndPostWaterLevel(); // Now waits for first stable reading
  }
  
  handlePlantButtons();
  
  // === SENSOR READING - EVERY 5s ===
  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();
    
    Serial.println("\n📊 SENSOR READING (5s update):");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    handlePlantButtons();
    
    float distance = getDistanceInches();
    int waterLevel = getWaterLevelPercentage();
    
    // === CRITICAL: CAPTURE STABLE WATER LEVEL FOR POSTING ===
    stableWaterLevel = waterLevel;
    if (!waterLevelFirstReadingDone) {
      waterLevelFirstReadingDone = true;
      Serial.println("✅ First water level reading captured: " + String(waterLevel) + "%");
      Serial.println("   └─ Ready to send boot data on next check");
    }
    
    Serial.print("💧 WATER TANK | DISTANCE: ");
    Serial.print(distance, 2);
    Serial.print(" inches | LEVEL: ");
    Serial.print(waterLevel);
    Serial.print("% ");
    
    // Show water level status
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
      
      // Print status with ACCURATE readings
      Serial.print("🌱 ");
      Serial.print(sensors[i].name);
      Serial.print(" | RAW:");
      Serial.print(raw);
      Serial.print(" | ");
      Serial.print(percent);
      Serial.print("% ✓ | MODE:");
      Serial.print(mode);
      Serial.print(" | VALVE:");
      Serial.println(actualValveState ? "OPEN ✅" : "CLOSED ❌");
    }
    
    handlePlantButtons();
    
    // Update all valve states based on current logic
    updatePumpState();
    
    Serial.print("💧 PUMP: ");
    bool pumpOn = digitalRead(pumpPin) == LOW;
    Serial.println(pumpOn ? "ON ✅" : "OFF ❌");
    
    handlePlantButtons();
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  handlePlantButtons();

}