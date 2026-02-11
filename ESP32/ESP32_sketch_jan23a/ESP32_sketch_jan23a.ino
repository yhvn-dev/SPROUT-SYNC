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

bool buttonOverride[3] = {false, false, false};
bool buttonState[3] = {false, false, false};
bool wateringState[3] = {false, false, false};

// NEW: Node.js remote control override
bool nodeJsOverride[3] = {false, false, false};
bool nodeJsForceOff[3] = {false, false, false};

bool wifiShouldBeConnected = false;
bool wifiConnected = false;

/************ TIMING ************/
unsigned long lastReadTime = 0;
unsigned long lastWiFiCheck = 0;
const unsigned long readInterval = 5000;
const unsigned long wifiCheckInterval = 100; // Check WiFi every 100ms

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
  // Send trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo pulse
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  
  // Calculate distance in inches
  // Speed of sound = 343 m/s = 13503.94 inches/s
  // Distance = (duration / 2) / 74 (in microseconds per inch)
  float inches = duration / 74.0 / 2.0;
  
  return inches;
}

int getWaterLevelPercentage() {
  float distance = getDistanceInches();
  
  // Constrain distance to valid range
  if (distance > MAX_DISTANCE_INCHES) distance = MAX_DISTANCE_INCHES;
  if (distance < 0) distance = 0;
  
  // Calculate percentage (inverse relationship)
  // Max distance (36") = 0% water level
  // Min distance (0") = 100% water level
  int percentage = (int)((MAX_DISTANCE_INCHES - distance) / MAX_DISTANCE_INCHES * 100.0);
  
  // Constrain to 0-100%
  percentage = constrain(percentage, 0, 100);
  
  return percentage;
}

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

void turnOffAllValvesAndPump() {
  for (int i = 0; i < 3; i++) {
    buttonOverride[i] = false;
    buttonState[i] = false;
    wateringState[i] = false;
    nodeJsOverride[i] = false;
    nodeJsForceOff[i] = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
}

/************ NODE.JS COMMAND HANDLER - REAL-TIME ************/
void handleNodeJsCommand(String command) {
  command.trim();
  command.toUpperCase();
  
  // BOKCHOY COMMANDS
  if (command == "BOKCHOY_OFF") {
    nodeJsOverride[0] = true;
    nodeJsForceOff[0] = true;
    setRelay(sensors[0].valvePin, false);
    Serial.println("🔴 NODE.JS → Bokchoy FORCED OFF ⚡");
    
  } else if (command == "BOKCHOY_AUTO") {
    nodeJsOverride[0] = false;
    nodeJsForceOff[0] = false;
    buttonOverride[0] = false;
    Serial.println("🟢 NODE.JS → Bokchoy AUTO MODE ⚡");
  }
  
  // PETCHAY COMMANDS
  else if (command == "PECHAY_OFF") {
    nodeJsOverride[1] = true;
    nodeJsForceOff[1] = true;
    setRelay(sensors[1].valvePin, false);
    Serial.println("🔴 NODE.JS → Petchay FORCED OFF ⚡");
    
  } else if (command == "PECHAY_AUTO") {
    nodeJsOverride[1] = false;
    nodeJsForceOff[1] = false;
    buttonOverride[1] = false;
    Serial.println("🟢 NODE.JS → Petchay AUTO MODE ⚡");
  }
  
  // MUSTASA COMMANDS
  else if (command == "MUSTASA_OFF") {
    nodeJsOverride[2] = true;
    nodeJsForceOff[2] = true;
    setRelay(sensors[2].valvePin, false);
    Serial.println("🔴 NODE.JS → Mustasa FORCED OFF ⚡");
    
  } else if (command == "MUSTASA_AUTO") {
    nodeJsOverride[2] = false;
    nodeJsForceOff[2] = false;
    buttonOverride[2] = false;
    Serial.println("🟢 NODE.JS → Mustasa AUTO MODE ⚡");
  }
  
  // Update pump state immediately after command
  updatePumpState();
}



/************ UPDATE PUMP STATE ************/
void updatePumpState() {
  bool pumpNeeded = false;
  
  for (int i = 0; i < 3; i++) {
    bool valveOpen = false;
    
    // Priority: Node.js override > Button override > Auto
    if (nodeJsOverride[i]) {
      valveOpen = !nodeJsForceOff[i]; // If force off, valve is closed
    } else if (buttonOverride[i]) {
      valveOpen = buttonState[i];
    } else {
      valveOpen = wateringState[i];
    }
    
    if (valveOpen) {
      pumpNeeded = true;
    }
  }
  
  setRelay(pumpPin, pumpNeeded);
  Serial.println("💧 PUMP: " + String(pumpNeeded ? "ON ⚡" : "OFF ⚡"));
}

/************ SEND READINGS - NON-BLOCKING ************/
void sendReadings(const char* reason) {
  if (!wifiConnected) return;

  HTTPClient http;
  http.setTimeout(500); // Very short timeout
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"reason\":\"" + String(reason) + "\",";
  
  // Add water level data
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

    // Determine actual valve state based on priority
    bool actualValveState = false;
    if (nodeJsOverride[i]) {
      actualValveState = !nodeJsForceOff[i];
    } else if (buttonOverride[i]) {
      actualValveState = buttonState[i];
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
    
    // ⚡⚡⚡ PROCESS NODE.JS COMMAND IMMEDIATELY ⚡⚡⚡
    handleNodeJsCommand(msg);
  }
}

/************ WIFI HANDLER - LIGHTWEIGHT ************/
void handleWiFi() {
  unsigned long now = millis();
  
  // Only check WiFi status occasionally to reduce overhead
  if (now - lastWiFiCheck < wifiCheckInterval) {
    return;
  }
  lastWiFiCheck = now;
  
  static unsigned long lastAttempt = 0;

  // If system wants WiFi ON
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
  }
  // If system wants WiFi OFF
  else {
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
      
      // START WiFi connection
      WiFi.mode(WIFI_STA);
      wifiShouldBeConnected = true;
      
    } else {
      Serial.println("\n🔴🔴🔴 SYSTEM OFF - INSTANT 🔴🔴🔴\n");
      digitalWrite(SWITCH_LED, LOW);
      turnOffAllValvesAndPump();
      
      // STOP WiFi connection
      wifiShouldBeConnected = false;
    }
  }
}

/************ HANDLE PLANT BUTTONS - INSTANT ************/
void handlePlantButtons() {
  for (int i = 0; i < 3; i++) {
    if (plantBtnPressed[i]) {
      plantBtnPressed[i] = false;
      
      // Clear Node.js override when physical button is pressed
      nodeJsOverride[i] = false;
      nodeJsForceOff[i] = false;
      
      if (!buttonOverride[i]) {
        buttonOverride[i] = true;
        buttonState[i] = true;
        setRelay(sensors[i].valvePin, true);
        Serial.println("🟡 " + sensors[i].name + " → BUTTON ON ⚡INSTANT⚡");
      } else if (buttonState[i]) {
        buttonState[i] = false;
        setRelay(sensors[i].valvePin, false);
        Serial.println("🔴 " + sensors[i].name + " → BUTTON OFF ⚡INSTANT⚡");
      } else {
        buttonOverride[i] = false;
        Serial.println("🟢 " + sensors[i].name + " → AUTO MODE ⚡INSTANT⚡");
      }
      
      // Update pump immediately
      updatePumpState();
    }
  }
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);
  delay(100);

  // Initialize ultrasonic sensor
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  // Initialize sensors and valves
  for (int i = 0; i < 3; i++) {
    pinMode(sensors[i].pin, INPUT);
    pinMode(sensors[i].valvePin, OUTPUT);
    setRelay(sensors[i].valvePin, false);
  }

  pinMode(pumpPin, OUTPUT);
  setRelay(pumpPin, false);

  // System switch
  pinMode(LOCK_SWITCH, INPUT_PULLUP);
  pinMode(SWITCH_LED, OUTPUT);
  digitalWrite(SWITCH_LED, LOW);

  // Plant buttons
  pinMode(bokchoyBtn, INPUT_PULLUP);
  pinMode(petchayBtn, INPUT_PULLUP);
  pinMode(mustasaBtn, INPUT_PULLUP);

  // Attach interrupts for INSTANT response
  attachInterrupt(digitalPinToInterrupt(LOCK_SWITCH), systemSwitchISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(bokchoyBtn), bokchoyISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(petchayBtn), petchayISR, FALLING);
  attachInterrupt(digitalPinToInterrupt(mustasaBtn), mustasaISR, FALLING);

  // WiFi OFF initially
  WiFi.mode(WIFI_OFF);

  Serial.println("\n========================================");
  Serial.println("🚀 ESP32 READY - INSTANT MODE");
  Serial.println("⚡ ALL BUTTONS: INSTANT (0ms)");
  Serial.println("📡 WiFi: ONLY WHEN SYSTEM ON");
  Serial.println("🤖 SENSORS: AUTO (5s cycle)");
  Serial.println("💧 ULTRASONIC: TRIG=16, ECHO=17");
  Serial.println("🌐 NODE.JS COMMANDS: REAL-TIME");
  Serial.println("========================================\n");
}

/************ LOOP - OPTIMIZED FOR INSTANT RESPONSE ************/
void loop() {
  // ⚡⚡⚡ ABSOLUTE HIGHEST PRIORITY - PROCESS IMMEDIATELY ⚡⚡⚡
  handleSystemSwitch();
  handlePlantButtons();

  // If system OFF, minimal operations
  if (!systemEnabled) {
    turnOffAllValvesAndPump();
    handleWiFi(); // Will disconnect WiFi
    delay(10);
    return;
  }

  // === SYSTEM IS ON ===

  // Lightweight WiFi check (only every 100ms)
  handleWiFi();
  
  // WebSocket (very lightweight) - PROCESSES NODE.JS COMMANDS
  if (wifiConnected) {
    webSocket.loop();
  }

  // === SENSOR READING & STATUS DISPLAY - ONLY EVERY 5s ===
  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();

    bool pumpNeeded = false;

    Serial.println("\n📊 SENSOR READING (5s update):");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Read and display water level
    float distance = getDistanceInches();
    int waterLevel = getWaterLevelPercentage();
    
    Serial.print("💧 WATER TANK | DISTANCE: ");
    Serial.print(distance, 2);
    Serial.print(" inches | LEVEL: ");
    Serial.print(waterLevel);
    Serial.println("%");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    for (int i = 0; i < 3; i++) {
      int raw = analogRead(sensors[i].pin);
      
      int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
      percent = constrain(percent, 0, 100);

      // AUTO MODE LOGIC (only if NO overrides active)
      if (!nodeJsOverride[i] && !buttonOverride[i]) {
        if (percent < sensors[i].minMoisture) {
          wateringState[i] = true;
        }
        
        if (wateringState[i] && percent >= sensors[i].maxMoisture) {
          wateringState[i] = false;
        }

        setRelay(sensors[i].valvePin, wateringState[i]);
      }

      // Determine actual valve state based on priority:
      // 1. Node.js override (highest)
      // 2. Button override
      // 3. Auto mode (lowest)
      bool actualValveState = false;
      String mode = "AUTO";
      
      if (nodeJsOverride[i]) {
        actualValveState = !nodeJsForceOff[i];
        mode = nodeJsForceOff[i] ? "NODE.JS-OFF" : "NODE.JS";
        setRelay(sensors[i].valvePin, actualValveState);
      } else if (buttonOverride[i]) {
        actualValveState = buttonState[i];
        mode = "BUTTON";
        setRelay(sensors[i].valvePin, actualValveState);
      } else {
        actualValveState = wateringState[i];
        mode = "AUTO";
      }

      if (actualValveState) {
        pumpNeeded = true;
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

    // Pump control
    setRelay(pumpPin, pumpNeeded);
    Serial.print("💧 PUMP: ");
    Serial.println(pumpNeeded ? "ON ✅" : "OFF ❌");

    // Send data (only if WiFi connected)
    if (wifiConnected) {
      sendReadings("PERIODIC");
    }
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
}