#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "bot";
const char* password = "12345678";

/************ NODE.JS SERVER ************/
const char* wsHost = "10.25.99.67";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.25.99.67:5000/readings/post/readings";

/************ OBJECTS ************/
WebSocketsClient webSocket;

/************ PUMP & VALVES ************/
#define PUMP_PIN 18
int valvePins[3] = {23, 22, 21};

/************ SENSOR STRUCT ************/
struct PlantSensor {
  int pin;
  int id;
  const char* name;
  int moistureMax;
  int moistureMin;
  int moisture;
  int threshold;
  bool connected;
  bool valveState;
};

/************ SENSOR INSTANCES ************/
PlantSensor sensors[3] = {
  {32, 1, "Bokchoy", 3000, 1800, 0, 40, true, false},
  {33, 4, "Petchay", 2900, 1750, 0, 45, true, false},
  {34, 3, "Mustasa", 2800, 1700, 0, 55, true, false}
};

/************ CONVERT RAW TO % ************/
int moistureToPercentage(PlantSensor sensor) {
  int range = sensor.moistureMax - sensor.moistureMin;
  if (range <= 0) return 0;
  int percent = (sensor.moistureMax - sensor.moisture) * 100 / range;
  return constrain(percent, 0, 100);
}

/************ CHECK SENSOR CONNECTION ************/
bool isSensorConnected(int reading, PlantSensor sensor) {
  if (reading < 600 || reading > sensor.moistureMax + 100) return false;
  return true;
}

/************ SEND TO API ************/
void sendSensorReading(PlantSensor sensor, int percent, bool forceSend = false) {
  if (!sensor.connected || WiFi.status() != WL_CONNECTED) return;

  static bool lastValveState[3] = {false, false, false};

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + String(sensor.name) + "\"" +
                   ", \"value\": " + String(percent) +
                   ", \"valve\": \"" + (sensor.valveState ? "OPEN" : "CLOSED") + "\" }";

  if (forceSend || sensor.valveState != lastValveState[sensor.id % 3]) {
    HTTPClient http;
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");
    http.POST(payload);
    http.end();

    if (webSocket.isConnected()) {
      webSocket.sendTXT(payload);
    }

    lastValveState[sensor.id % 3] = sensor.valveState;
  }
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {

  switch (type) {

    case WStype_CONNECTED:
      Serial.println("[WS] Connected");
      webSocket.sendTXT("{\"message\":\"ESP32 Online\"}");
      break;

    case WStype_TEXT: {
      String msg = String((char*)payload);
      Serial.println("📩 WS MESSAGE RECEIVED:");
      Serial.println(msg);
      break;
    }

    case WStype_DISCONNECTED:
      Serial.println("[WS] Disconnected");
      break;
  }
}

/************ WIFI INIT ************/
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("📡 Trying to connect to WiFi...");
}

/************ RELAY HELPER ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);

  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);

  for (int i = 0; i < 3; i++) {
    pinMode(valvePins[i], OUTPUT);
    digitalWrite(valvePins[i], LOW);
  }

  initWiFi();

  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  Serial.println("🌱 System Started (ONLINE / OFFLINE READY)");
}

/************ LOOP ************/
unsigned long lastLogicRun = 0;
unsigned long lastSendRun  = 0;

const unsigned long logicInterval = 5000;
const unsigned long sendInterval  = 600000;

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    webSocket.loop();
  }

  // ===== SENSOR + RELAY LOGIC =====
  if (millis() - lastLogicRun >= logicInterval) {
    bool pumpNeeded = false;
    Serial.println("🌱 Plant Sensor Readings:");

    for (int i = 0; i < 3; i++) {
      sensors[i].moisture = analogRead(sensors[i].pin);
      sensors[i].connected = isSensorConnected(sensors[i].moisture, sensors[i]);

      bool valveOpen = false;

      if (!sensors[i].connected) {
        setRelay(valvePins[i], false);
        sensors[i].valveState = false;
      } else {
        int percent = moistureToPercentage(sensors[i]);
        if (percent < sensors[i].threshold) {
          setRelay(valvePins[i], true);
          valveOpen = true;
          pumpNeeded = true;
        } else {
          setRelay(valvePins[i], false);
        }
        sensors[i].valveState = valveOpen;
      }

      Serial.print(sensors[i].name);
      if (sensors[i].connected) {
        Serial.print(" | ");
        Serial.print(moistureToPercentage(sensors[i]));
        Serial.print("% | RAW:");
        Serial.print(sensors[i].moisture);
        Serial.print(" | Valve:");
        Serial.println(valveOpen ? "OPEN" : "CLOSED");
      } else {
        Serial.println(" | DISCONNECTED | Valve:OFF");
      }

      sendSensorReading(sensors[i], moistureToPercentage(sensors[i]));
    }

    setRelay(PUMP_PIN, pumpNeeded);
    Serial.println(pumpNeeded ? "🚿 Pump: ON" : "🚿 Pump: OFF");

    lastLogicRun = millis();
    Serial.println("------------------------------------");
  }

  // ===== NORMAL DATA SEND =====
  if (millis() - lastSendRun >= sendInterval) {
    for (int i = 0; i < 3; i++) {
      if (sensors[i].connected) {
        sendSensorReading(sensors[i], moistureToPercentage(sensors[i]), true);
      }
    }
    lastSendRun = millis();
  }
}
