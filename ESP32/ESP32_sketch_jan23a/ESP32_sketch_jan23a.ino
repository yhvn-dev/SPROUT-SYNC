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

/************ BUTTONS ************/
#define LOCK_SWITCH 19   // LOW = SYSTEM ON
#define SWITCH_LED  2
#define BOKCHOY_BTN 25
#define PECHAY_BTN  26
#define MUSTASA_BTN 27

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
  {32, 1, "BOKCHOY", 3000, 1800, 0, 10, false, false},
  {33, 2, "PECHAY",  2900, 1750, 0, 15, false, false},
  {34, 3, "MUSTASA", 2800, 1700, 0, 15, false, false}
};

/************ STATE ************/
bool systemEnabled = false;
bool manualON[3] = {false, false, false};
bool wsConnected = false;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50; // ms

/************ TIMING ************/
unsigned long lastLogicRun = 0;
const unsigned long logicInterval = 5000;

/************ UTILS ************/
int moistureToPercentage(PlantSensor s) {
  int range = s.moistureMax - s.moistureMin;
  if (range <= 0) return 0;
  return constrain((s.moistureMax - s.moisture) * 100 / range, 0, 100);
}

bool isSensorConnected(int reading, PlantSensor s) {
  return !(reading < 600 || reading > s.moistureMax + 100);
}

void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH); // active LOW
}

/************ API SEND ************/
void sendSensorReading(PlantSensor sensor, int percent) {
  if (!sensor.connected || WiFi.status() != WL_CONNECTED) return;

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + String(sensor.name) + "\"" +
                   ", \"value\": " + String(percent) +
                   ", \"valve\": \"" + (sensor.valveState ? "OPEN" : "CLOSED") + "\" }";

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.POST(payload);
  http.end();

  if (wsConnected) {
    webSocket.sendTXT(payload);
  }
}

/************ WEBSOCKET ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_CONNECTED) wsConnected = true;
  if (type == WStype_DISCONNECTED) wsConnected = false;
}

/************ WIFI ************/
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);

  pinMode(PUMP_PIN, OUTPUT);
  setRelay(PUMP_PIN, false);

  for (int i = 0; i < 3; i++) {
    pinMode(valvePins[i], OUTPUT);
    setRelay(valvePins[i], false);
  }

  pinMode(LOCK_SWITCH, INPUT_PULLUP);
  pinMode(SWITCH_LED, OUTPUT);
  pinMode(BOKCHOY_BTN, INPUT_PULLUP);
  pinMode(PECHAY_BTN, INPUT_PULLUP);
  pinMode(MUSTASA_BTN, INPUT_PULLUP);

  initWiFi();

  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);

  Serial.println("🚀 SYSTEM BOOTED");
}

/************ LOOP ************/
void loop() {
  webSocket.loop();

  /******** NON-BLOCKING SYSTEM TOGGLE ********/
  static bool lastSwitchState = HIGH;
  bool currentSwitchState = digitalRead(LOCK_SWITCH);

  if (currentSwitchState != lastSwitchState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (currentSwitchState != systemEnabled) {
      systemEnabled = !systemEnabled;
      digitalWrite(SWITCH_LED, systemEnabled);

      // Reset valves and manual states
      for (int i = 0; i < 3; i++) {
        manualON[i] = false;
        sensors[i].valveState = false;
        sensors[i].connected = false;
        setRelay(valvePins[i], false);
      }
      setRelay(PUMP_PIN, false);

      Serial.println(systemEnabled ? "🟢 SYSTEM ON" : "🔴 SYSTEM OFF");

      // Force immediate sensor read
      lastLogicRun = millis() - logicInterval;
    }
  }
  lastSwitchState = currentSwitchState;

  /******** 🔴 SYSTEM OFF = STOP EVERYTHING ********/
  if (!systemEnabled) {
    delay(10);
    return;
  }

  /******** MANUAL BUTTONS - REALTIME VALVE ********/
  int btns[3] = {BOKCHOY_BTN, PECHAY_BTN, MUSTASA_BTN};
  for (int i = 0; i < 3; i++) {
    manualON[i] = (digitalRead(btns[i]) == LOW);

    // immediate manual valve control
    if (manualON[i]) {
      sensors[i].valveState = true;
      setRelay(valvePins[i], true);
    }
  }

  /******** SENSOR LOGIC EVERY 5s ********/
  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();
    bool pumpNeeded = false;

    // Read all sensors and update automatic valves
    for (int i = 0; i < 3; i++) {
      sensors[i].moisture = analogRead(sensors[i].pin);
      sensors[i].connected = isSensorConnected(sensors[i].moisture, sensors[i]);
      int percent = moistureToPercentage(sensors[i]);

      // Only update valve automatically if manual is NOT pressed
      if (!manualON[i]) {
        sensors[i].valveState = (sensors[i].connected && percent < sensors[i].threshold);
        if (sensors[i].valveState) pumpNeeded = true;
        setRelay(valvePins[i], sensors[i].valveState);
      } else {
        pumpNeeded = true; // manual valve also triggers pump
      }
    }

    // Pump control
    setRelay(PUMP_PIN, pumpNeeded);

    // Print all readings together with Status
    Serial.println("-----------------");
    for (int i = 0; i < 3; i++) {
      int percent = moistureToPercentage(sensors[i]);
      const char* status = manualON[i] ? "FORCED" : "AUTO";

      Serial.printf("%s | Moisture: %d | %d%% | Connected: %s | Valve: %s | Status: %s\n",
                    sensors[i].name,
                    sensors[i].moisture,
                    percent,
                    sensors[i].connected ? "YES" : "NO",
                    sensors[i].valveState ? "OPEN" : "CLOSED",
                    status);

      sendSensorReading(sensors[i], percent);
    }

    Serial.printf("WiFi: %s | WebSocket: %s\n",
                  WiFi.status() == WL_CONNECTED ? "CONNECTED" : "DISCONNECTED",
                  wsConnected ? "CONNECTED" : "DISCONNECTED");
    Serial.println("-----------------------------\n");
  }
}
