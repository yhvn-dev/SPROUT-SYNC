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
const int LOCK_SWITCH = 19;   // LOW = SYSTEM ON
const int SWITCH_LED  = 2;

/************ PLANT BUTTONS ************/
const int bokchoyBtn  = 25;
const int petchayBtn  = 26;
const int mustasaBtn  = 27;

/************ STATE ************/
bool systemEnabled = false;
bool prevSystemEnabled = false;
bool forceMode[3] = {false, false, false};
bool wateringState[3] = {false, false, false};

/************ TIMING ************/
unsigned long lastReadTime = 0;
const unsigned long readInterval = 5000;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

/************ SEND READINGS TO SERVER ************/
void sendReadings(const char* reason) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"reason\":\"" + String(reason) + "\",";
  payload += "\"sensors\":[";

  for (int i = 0; i < 3; i++) {
    int raw = analogRead(sensors[i].pin);
    int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
    percent = constrain(percent, 0, 100);

    payload += "{";
    payload += "\"id\":" + String(i+1) + ",";
    payload += "\"name\":\"" + sensors[i].name + "\",";
    payload += "\"raw\":" + String(raw) + ",";
    payload += "\"percent\":" + String(percent) + ",";
    payload += "\"valve\":" + String(wateringState[i] ? "1" : "0");
    payload += "}";

    if (i < 2) payload += ",";
  }

  payload += "]}";
  http.POST(payload);
  http.end();
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_TEXT) {
    String msg = String((char*)payload);
    msg.trim();

    for (int i = 0; i < 3; i++) {
      if (msg == sensors[i].name + "_OFF") {
        forceMode[i] = true;
        wateringState[i] = true;
        setRelay(sensors[i].valvePin, true);
      }
      if (msg == sensors[i].name + "_AUTO") {
        forceMode[i] = false;
      }
    }
  }
}

/************ WIFI HANDLER ************/
void handleWiFi() {
  static unsigned long lastAttempt = 0;
  unsigned long now = millis();

  if (WiFi.status() == WL_CONNECTED) return;

  if (now - lastAttempt > 5000) {
    lastAttempt = now;
    WiFi.begin(ssid, password);
    Serial.println("🔄 Connecting WiFi...");
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
    digitalWrite(sensors[i].valvePin, HIGH); // valves OFF
  }

  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, HIGH);

  // System switch
  pinMode(LOCK_SWITCH, INPUT_PULLUP);
  pinMode(SWITCH_LED, OUTPUT);

  // Plant buttons
  pinMode(bokchoyBtn, INPUT_PULLUP);
  pinMode(petchayBtn, INPUT_PULLUP);
  pinMode(mustasaBtn, INPUT_PULLUP);

  // WiFi
  WiFi.mode(WIFI_STA);

  Serial.println("\n🚀 ESP32 READY — NETWORK ACTIVE | BUTTONS FORCE VALVES | AUTO SENSOR MODE");
}

/************ LOOP ************/
void loop() {

  /***** SYSTEM SWITCH (NON-BLOCKING) *****/
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);

  if (systemEnabled != prevSystemEnabled) {
    if (systemEnabled) {
      Serial.println("\n🟢 SYSTEM ON");
      digitalWrite(SWITCH_LED, HIGH);
      lastReadTime = 0;
    } else {
      Serial.println("\n🔴 SYSTEM OFF");
      digitalWrite(SWITCH_LED, LOW);

      // Turn off all valves & pump
      for (int i = 0; i < 3; i++) {
        forceMode[i] = false;
        wateringState[i] = false;
        digitalWrite(sensors[i].valvePin, HIGH);
      }
      digitalWrite(pumpPin, HIGH);
    }
    prevSystemEnabled = systemEnabled;
  }

  if (!systemEnabled) return;

  /***** PLANT BUTTONS (FORCE MODE, INSTANT) *****/
  int plantPins[3] = {bokchoyBtn, petchayBtn, mustasaBtn};
  for (int i = 0; i < 3; i++) {
    if (digitalRead(plantPins[i]) == LOW) {
      forceMode[i] = true;
      wateringState[i] = true;
      setRelay(sensors[i].valvePin, true);
    } else if (!forceMode[i]) {
      wateringState[i] = false;
      setRelay(sensors[i].valvePin, false);
    }
  }

  /***** READ & CONTROL SENSORS EVERY 5s *****/
  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();

    bool pumpNeeded = false;

    for (int i = 0; i < 3; i++) {
      int raw = 0;
      for (int j = 0; j < 10; j++) raw += analogRead(sensors[i].pin);
      raw /= 10;

      int percent = map(raw, sensors[i].dryValue, sensors[i].wetValue, 0, 100);
      percent = constrain(percent, 0, 100);

      // AUTO MODE
      if (!forceMode[i]) {
        if (percent < sensors[i].minMoisture)
          wateringState[i] = true;
        if (wateringState[i] && percent >= sensors[i].maxMoisture)
          wateringState[i] = false;

        setRelay(sensors[i].valvePin, wateringState[i]);
      }

      if (wateringState[i]) pumpNeeded = true;

      Serial.print(sensors[i].name);
      Serial.print(" | Raw: "); Serial.print(raw);
      Serial.print(" | Moisture: "); Serial.print(percent);
      Serial.print("% | "); Serial.print(forceMode[i] ? "FORCE" : "AUTO");
      Serial.print(" | Valve: "); Serial.println(wateringState[i] ? "OPEN" : "CLOSED");
    }

    // Pump control
    setRelay(pumpPin, pumpNeeded);

    // Send data to server
    sendReadings("PERIODIC");

    Serial.println("-------------------------");
  }

  /***** NETWORK HANDLING (NON-BLOCKING) *****/
  handleWiFi();
  webSocket.loop();
}
