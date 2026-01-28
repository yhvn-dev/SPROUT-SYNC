#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "bot";
const char* password = "12345678";

/************ NODE.JS SERVER ************/
const char* wsHost = "10.92.69.67";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.92.69.67:5000/readings/post/readings";

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
  int moistureMax; // dry value (raw HIGH)
  int moistureMin; // wet value (raw LOW)
  int moisture;
  int threshold; // % threshold to trigger watering
  bool connected;
};

/************ SENSOR INSTANCES ************/
PlantSensor sensors[3] = {
  {32, 1, "Bokchoy", 3000, 1800, 0, 40, true},
  {33, 4, "Petchay", 2900, 1750, 0, 45, true},
  {34, 3, "Mustasa", 2800, 1700, 0, 55, true}
};

/************ CONVERT RAW TO % (INVERTED) ************/
int moistureToPercentage(PlantSensor sensor) {
  // Flip: high raw = dry → low %
  int range = sensor.moistureMax - sensor.moistureMin;
  if (range <= 0) return 0;

  int percent = (sensor.moistureMax - sensor.moisture) * 100 / range;
  return constrain(percent, 0, 100); // 0% = dry, 100% = wet
}

/************ CHECK SENSOR CONNECTION ************/
bool isSensorConnected(int reading, PlantSensor sensor) {
    // Below 600 → disconnected, above max+100 → disconnected
    if (reading < 600 || reading > sensor.moistureMax + 100) return false;
    return true;
}

/************ SEND TO API ************/
void sendSensorReading(PlantSensor sensor, int percent) {
  if (!sensor.connected || WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + String(sensor.name) + "\"" +
                   ", \"value\": " + String(percent) + " }";

  http.POST(payload);
  http.end();
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("[WS] Connected");
    webSocket.sendTXT("{\"message\":\"ESP32 Online\"}");
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("[WS] Disconnected");
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
  digitalWrite(pin, on ? LOW : HIGH); // active-low relay
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
const unsigned long sendInterval  = 1000;

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    webSocket.loop();
  }

  // ===== SENSOR READ + RELAY LOGIC =====
  if (millis() - lastLogicRun >= logicInterval) {
    bool pumpNeeded = false;
    Serial.println("🌱 Plant Sensor Readings:");

    for (int i = 0; i < 3; i++) {
      sensors[i].moisture = analogRead(sensors[i].pin);
      sensors[i].connected = isSensorConnected(sensors[i].moisture, sensors[i]);

      bool valveOpen = false;

      if (!sensors[i].connected) {
        setRelay(valvePins[i], false);
      } else {
        int percent = moistureToPercentage(sensors[i]);
        if (percent < sensors[i].threshold) {
          setRelay(valvePins[i], true); // open if dry
          valveOpen = true;
          pumpNeeded = true;
        } else {
          setRelay(valvePins[i], false); // close if wet enough
        }
      }

      Serial.print(sensors[i].name);
      if (sensors[i].connected) {
        int percent = moistureToPercentage(sensors[i]);
        Serial.print(" | ");
        Serial.print(percent);
        Serial.print("%");
        Serial.print(" | RAW:");
        Serial.print(sensors[i].moisture);
        Serial.print(" | Valve:");
        Serial.println(valveOpen ? "OPEN" : "CLOSED");
      } else {
        Serial.println(" | DISCONNECTED | Valve:OFF");
      }
    } 

    setRelay(PUMP_PIN, pumpNeeded);
    Serial.print("🚿 Pump: ");
    Serial.println(pumpNeeded ? "ON" : "OFF");

    lastLogicRun = millis();
    Serial.println("------------------------------------");
  }

  // ===== SEND DATA TO NODE.JS =====
  if (millis() - lastSendRun >= sendInterval) {
    if (WiFi.status() == WL_CONNECTED) {
      for (int i = 0; i < 3; i++) {
        if (sensors[i].connected) {
          int percent = moistureToPercentage(sensors[i]);
          sendSensorReading(sensors[i], percent);

          if (webSocket.isConnected()) {
            String wsPayload = "{ \"sensor_id\": " + String(sensors[i].id) +
                               ", \"sensor_name\": \"" + String(sensors[i].name) + "\"" +
                               ", \"value\": " + String(percent) + " }";
            webSocket.sendTXT(wsPayload);
          }
        }
      }
    }
    lastSendRun = millis();
  }
}
