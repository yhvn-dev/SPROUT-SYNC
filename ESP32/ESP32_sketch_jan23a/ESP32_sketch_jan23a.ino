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
  {32, "Bokchoy",  3000, 1800, 21, 50, 75},
  {33, "Petchay",  2900, 1750, 22, 50, 75},
  {34, "Mustasa",  2800, 1700, 23, 55, 75}
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

bool wifiShouldBeConnected = false;
bool wifiConnected = false;

/************ TIMING ************/
unsigned long lastReadTime = 0;
const unsigned long readInterval = 5000;

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

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

void turnOffAllValvesAndPump() {
  for (int i = 0; i < 3; i++) {
    buttonOverride[i] = false;
    buttonState[i] = false;
    wateringState[i] = false;
    setRelay(sensors[i].valvePin, false);
  }
  setRelay(pumpPin, false);
}

/************ SEND READINGS - NON-BLOCKING ************/
void sendReadings(const char* reason) {
  if (!wifiConnected) return;

  HTTPClient http;
  http.setTimeout(1000);
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"reason\":\"" + String(reason) + "\",";
  payload += "\"sensors\":[";

  for (int i = 0; i < 3; i++) {
    int raw = analogRead(sensors[i].pin);
    int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
    percent = constrain(percent, 0, 100);

    bool actualValveState = buttonOverride[i] ? buttonState[i] : wateringState[i];

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
    Serial.println("📥 WS: " + msg);
  }
}

/************ WIFI HANDLER - ONLY WHEN SYSTEM ON ************/
void handleWiFi() {
  static unsigned long lastAttempt = 0;
  unsigned long now = millis();

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
    if (wifiConnected) {
      Serial.println("🔴 WiFi DISCONNECTING...");
      webSocket.disconnect();
      WiFi.disconnect(true);
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
      
      if (!buttonOverride[i]) {
        buttonOverride[i] = true;
        buttonState[i] = true;
        setRelay(sensors[i].valvePin, true);
        Serial.println("🟡 " + sensors[i].name + " → BUTTON ON");
      } else if (buttonState[i]) {
        buttonState[i] = false;
        setRelay(sensors[i].valvePin, false);
        Serial.println("🔴 " + sensors[i].name + " → BUTTON OFF");
      } else {
        buttonOverride[i] = false;
        Serial.println("🟢 " + sensors[i].name + " → AUTO MODE");
      }
      
      // Update pump immediately
      bool pumpNeeded = false;
      for (int j = 0; j < 3; j++) {
        bool valveOpen = buttonOverride[j] ? buttonState[j] : wateringState[j];
        if (valveOpen) pumpNeeded = true;
      }
      setRelay(pumpPin, pumpNeeded);
    }
  }
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);
  delay(100);

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

  // WiFi setup (but don't connect yet)
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(false); // Manual control

  Serial.println("\n========================================");
  Serial.println("🚀 ESP32 READY - INSTANT MODE");
  Serial.println("⚡ SYSTEM SWITCH: INSTANT (0ms)");
  Serial.println("⚡ PLANT BUTTONS: INSTANT (0ms)");
  Serial.println("📡 WiFi: ONLY WHEN SYSTEM ON");
  Serial.println("🤖 SENSORS: AUTO (5s cycle)");
  Serial.println("========================================\n");
}

/************ LOOP - FULLY NON-BLOCKING ************/
void loop() {
  // ⚡⚡⚡ HIGHEST PRIORITY - INSTANT RESPONSE ⚡⚡⚡
  handleSystemSwitch();
  handlePlantButtons();

  // If system OFF, don't run anything else
  if (!systemEnabled) {
    turnOffAllValvesAndPump();
    handleWiFi(); // This will disconnect WiFi
    delay(10);
    return;
  }

  // === SYSTEM IS ON - Run WiFi and sensors ===

  // Network handling (only when system ON)
  handleWiFi();
  
  if (wifiConnected) {
    webSocket.loop();
  }

  // === SENSOR READING - ONLY EVERY 5s ===
  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();

    bool pumpNeeded = false;

    Serial.println("\n📊 SENSOR READING:");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    for (int i = 0; i < 3; i++) {
      int raw = analogRead(sensors[i].pin);
      
      int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
      percent = constrain(percent, 0, 100);

      // AUTO MODE LOGIC (only if button NOT overriding)
      if (!buttonOverride[i]) {
        if (percent < sensors[i].minMoisture) {
          wateringState[i] = true;
        }
        
        if (wateringState[i] && percent >= sensors[i].maxMoisture) {
          wateringState[i] = false;
        }

        setRelay(sensors[i].valvePin, wateringState[i]);
      }

      // Determine actual valve state
      bool actualValveState = buttonOverride[i] ? buttonState[i] : wateringState[i];

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
      Serial.print(buttonOverride[i] ? "BUTTON" : "AUTO");
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

  yield();
}