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
  {32, 1, "BOKCHOY", 3000, 1800, 0, 40, true, false},
  {33, 4, "PECHAY", 2900, 1750, 0, 45, true, false},
  {34, 3, "MUSTASA", 2800, 1700, 0, 55, true, false}
};

/************ MANUAL OVERRIDE FLAG ************/
bool manualON[3] = {false, false, false};  // true = forced ON

/************ BOOT SAFETY FLAG ************/
bool systemReady = false;   // prevents auto relay ON at boot
bool wsConnected = false;   // WebSocket connection flag

/************ WIFI RECONNECT TIMING ************/
unsigned long lastWiFiAttempt = 0;
const unsigned long wifiReconnectInterval = 10000; // 10 seconds

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

    if (wsConnected) {
      webSocket.sendTXT(payload);
      Serial.println("📤 Sent to NodeJS server: " + payload);
    }

    lastValveState[sensor.id % 3] = sensor.valveState;
  }
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      wsConnected = true;
      Serial.println("[WS] Connected to NodeJS server ✅");
      webSocket.sendTXT("{\"message\":\"ESP32 Online\"}");
      break;

    case WStype_TEXT:
      Serial.println("📩 WS MESSAGE RECEIVED:");
      Serial.println((char*)payload);

      // handle manual ON/OFF commands
      for (int i = 0; i < 3; i++) {
        String msg = String((char*)payload);
        msg.toUpperCase();

        if (msg == String(sensors[i].name) + "_ON") {
          manualON[i] = true;
          setRelay(valvePins[i], true);
          sensors[i].valveState = true;
          Serial.println("🌐 Manual ON: " + String(sensors[i].name));
        } else if (msg == String(sensors[i].name) + "_OFF") {
          manualON[i] = false;
          Serial.println("🌐 Manual OFF cleared: " + String(sensors[i].name));
        }
      }
      break;

    case WStype_DISCONNECTED:
      wsConnected = false;
      Serial.println("[WS] Disconnected from NodeJS server ❌");
      break;
  }
}

/************ WIFI INIT ************/
void initWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("📡 Trying to connect to WiFi...");
  }
}

/************ RELAY HELPER (ACTIVE LOW) ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);

  // Force all relays OFF at boot
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH);

  for (int i = 0; i < 3; i++) {
    pinMode(valvePins[i], OUTPUT);
    digitalWrite(valvePins[i], HIGH);
  }

  Serial.println("🔒 Relays forced OFF at boot");

  initWiFi();

  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  Serial.println("🌱 System Started (WAITING FOR SENSOR READINGS)");
}

/************ LOOP ************/
unsigned long lastLogicRun = 0;
unsigned long lastSendRun  = 0;

const unsigned long logicInterval = 5000; // 5 seconds
const unsigned long sendInterval  = 600000; // 10 minutes

void loop() {
  // Keep WebSocket alive
  webSocket.loop();

  // Periodic WiFi reconnect attempt every 10 seconds
  if (millis() - lastWiFiAttempt >= wifiReconnectInterval) {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("🔌 Attempting WiFi reconnect...");
      WiFi.disconnect();
      WiFi.begin(ssid, password);
    }
    lastWiFiAttempt = millis();
  }

  // Sensor logic every 5 seconds
  if (millis() - lastLogicRun >= logicInterval) {

    bool pumpNeeded = false;
    bool hasValidSensor = false;

    int sensorPercent[3];
    bool sensorConnected[3];

    // read all sensors simultaneously
    for (int i = 0; i < 3; i++) {
      sensors[i].moisture = analogRead(sensors[i].pin);
      sensors[i].connected = isSensorConnected(sensors[i].moisture, sensors[i]);
      sensorConnected[i] = sensors[i].connected;
      sensorPercent[i] = moistureToPercentage(sensors[i]);
      if (sensorConnected[i]) hasValidSensor = true;
    }

    // process valves & pump with manual override
    for (int i = 0; i < 3; i++) {
      bool valveOpen = false;

      if (manualON[i]) {
        valveOpen = true; // forced ON
        setRelay(valvePins[i], true);
        pumpNeeded = true;
      } else {
        if (!systemReady || !sensorConnected[i]) {
          valveOpen = false;
          setRelay(valvePins[i], false);
        } else {
          if (sensorPercent[i] < sensors[i].threshold) {
            valveOpen = true;
            pumpNeeded = true;
            setRelay(valvePins[i], true);
          } else {
            valveOpen = false;
            setRelay(valvePins[i], false);
          }
        }
      }

      sensors[i].valveState = valveOpen;
    }

    // print all sensor readings together
    Serial.println("🌱 Plant Sensor Readings:");
    for (int i = 0; i < 3; i++) {
      Serial.print(sensors[i].name);
      Serial.print(" | ");
      Serial.print(sensorPercent[i]);
      Serial.print("% | RAW:");
      Serial.print(sensors[i].moisture);
      Serial.print(" | Valve:");
      Serial.println(sensors[i].valveState ? "OPEN" : "CLOSED");

      sendSensorReading(sensors[i], sensorPercent[i]);
    }

    if (!systemReady && hasValidSensor) {
      systemReady = true;
      Serial.println("✅ System armed — automatic watering enabled");
    }

    setRelay(PUMP_PIN, systemReady && pumpNeeded);
    Serial.println((systemReady && pumpNeeded) ? "🚿 Pump: ON" : "🚿 Pump: OFF");
    Serial.println("------------------------------------");

    lastLogicRun = millis();
  }

  // send all sensor readings periodically
  if (millis() - lastSendRun >= sendInterval) {
    for (int i = 0; i < 3; i++) {
      if (sensors[i].connected) {
        sendSensorReading(sensors[i], moistureToPercentage(sensors[i]), true);
      }
    }
    lastSendRun = millis();
  }
}
