#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "bot";
const char* password = "12345678";

/************ SERVER ************/
const char* wsHost = "10.88.243.67";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.88.243.67:5000/readings/post/readings";

WebSocketsClient webSocket;

/************ PUMP & VALVES ************/
#define PUMP_PIN 18
int valvePins[3] = {23, 22, 21};

/************ BUTTONS ************/
#define LOCK_SWITCH 19
#define SWITCH_LED  2
#define BOKCHOY_BTN 25
#define PECHAY_BTN  26
#define MUSTASA_BTN 27

/************ ULTRASONIC ************/
#define US_TRIG_PIN 16
#define US_ECHO_PIN 17
#define US_STATUS_LED 4

/************ SENSOR STRUCT ************/
struct PlantSensor {
  int pin;
  int id;
  const char* name;
  int moistureMax;
  int moistureMin;
  int moisture;
  int threshold;
  bool valveState;
  bool forcedOFF;    // Node.js forced OFF
  bool autoEnabled;  // auto-mode enabled (false when Node.js OFF)
};

PlantSensor sensors[3] = {
  {32, 1, "BOKCHOY", 3000, 1800, 0, 50, false, false, true},
  {33, 2, "PECHAY",  2900, 1750, 0, 50, false, false, true},
  {34, 3, "MUSTASA", 2800, 1700, 0, 55, false, false, true}
};

/************ STATE ************/
bool systemEnabled = false;
bool prevSystemEnabled = false;
bool wsConnected = false;

unsigned long lastLogicRun = 0;
const unsigned long logicInterval = 5000;
float lastUltrasonicMM = -1;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

int readMoistureRaw(PlantSensor &s) {
  int reading = analogRead(s.pin);
  s.moisture = reading;
  return reading;
}

int moistureToPercentage(PlantSensor s) {
  int range = s.moistureMax - s.moistureMin;
  if (range <= 0) return 0;
  return constrain((s.moistureMax - s.moisture) * 100 / range, 0, 100);
}

/************ ULTRASONIC ************/
float readUltrasonicMM() {
  digitalWrite(US_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(US_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(US_TRIG_PIN, LOW);

  long duration = pulseIn(US_ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    digitalWrite(US_STATUS_LED, LOW);
    return -1;
  }

  digitalWrite(US_STATUS_LED, HIGH);
  return (duration * 0.343) / 2.0;
}

/************ COMMUNICATION ************/
void sendSensorReading(PlantSensor sensor, int percent, float ultrasonicMM) {
  if (!wsConnected || WiFi.status() != WL_CONNECTED) return;

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + sensor.name + "\"" +
                   ", \"value\": " + String(percent) +
                   ", \"valve\": \"" + (sensor.valveState ? "OPEN" : "CLOSED") + "\"" +
                   ", \"ultrasonic_mm\": " + String(ultrasonicMM) + " }";

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.POST(payload);
  http.end();

  webSocket.sendTXT(payload);
}

/************ SERVER COMMAND HANDLER ************/
void handleServerCommand(String cmd) {
  cmd.trim();

  int index = -1;
  if (cmd.startsWith("BOKCHOY")) index = 0;
  else if (cmd.startsWith("PECHAY")) index = 1;
  else if (cmd.startsWith("MUSTASA")) index = 2;

  if (index != -1) {
    if (cmd.endsWith("_OFF")) {
      sensors[index].forcedOFF = true;
      sensors[index].autoEnabled = false;    // disable auto-mode
      sensors[index].valveState = false;
      setRelay(valvePins[index], false);
      Serial.printf("🚫 %s VALVE COMPLETELY OFF FROM SERVER\n", sensors[index].name);
      return;
    }
    else if (cmd.endsWith("_ON")) {
      sensors[index].forcedOFF = false;
      sensors[index].autoEnabled = true;     // resume auto-mode
      Serial.printf("✅ %s FORCE OFF RELEASED → AUTO MODE RESUMES\n", sensors[index].name);
      return;
    }
  }

  // Full system commands
  if (cmd == "SYSTEM_OFF") {
    for (int i = 0; i < 3; i++) {
      sensors[i].forcedOFF = true;
      sensors[i].autoEnabled = false;
      sensors[i].valveState = false;
      setRelay(valvePins[i], false);
    }
    setRelay(PUMP_PIN, false);
    Serial.println("🚫 FULL SYSTEM OFF FROM SERVER");
  }
  else if (cmd == "SYSTEM_ON") {
    for (int i = 0; i < 3; i++) {
      sensors[i].forcedOFF = false;
      sensors[i].autoEnabled = true;
    }
    Serial.println("✅ FULL SYSTEM ON → AUTO MODE RESUMES");
  }
}

/************ WEBSOCKET EVENT ************/
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      wsConnected = true;
      Serial.println("✅ WebSocket Connected");
      break;
    case WStype_DISCONNECTED:
      wsConnected = false;
      Serial.println("❌ WebSocket Disconnected");
      break;
    case WStype_TEXT: {
      String cmd = String((char*)payload);
      handleServerCommand(cmd);
      break;
    }
  }
}

/************ WIFI ************/
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
}

/************ SWITCH HANDLERS ************/
void handlePlantSwitches() {
  int btns[3] = {BOKCHOY_BTN, PECHAY_BTN, MUSTASA_BTN};
  for (int i = 0; i < 3; i++) {
    // pressing button re-enables auto-mode
    if (digitalRead(btns[i]) == HIGH) {
      sensors[i].forcedOFF = false;
      sensors[i].autoEnabled = true;
      Serial.printf("🔄 %s AUTO MODE ENABLED BY LOCAL BUTTON\n", sensors[i].name);
    }
  }
}

void handleMainSwitch() {
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);
  if (systemEnabled != prevSystemEnabled) {
    digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);
    if (!systemEnabled) {
      for (int i = 0; i < 3; i++) {
        sensors[i].valveState = false;
        setRelay(valvePins[i], false);
      }
      setRelay(PUMP_PIN, false);
    }
    prevSystemEnabled = systemEnabled;
  }
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

  pinMode(US_STATUS_LED, OUTPUT);
  pinMode(US_TRIG_PIN, OUTPUT);
  pinMode(US_ECHO_PIN, INPUT);

  initWiFi();

  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);

  Serial.println("✅ SYSTEM READY — AUTO + NODE.JS CONTROL ENABLED");
}

/************ LOOP ************/
void loop() {
  webSocket.loop();
  handleMainSwitch();
  handlePlantSwitches();

  if (!systemEnabled) {
    setRelay(PUMP_PIN, false);
    for (int i = 0; i < 3; i++) setRelay(valvePins[i], false);
    return;
  }

  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();
    lastUltrasonicMM = readUltrasonicMM();

    Serial.printf("📏 ULTRASONIC DISTANCE: %.1f mm\n", lastUltrasonicMM);
    Serial.println("===============================================");

    bool pumpNeeded = false;

    for (int i = 0; i < 3; i++) {
      int raw = readMoistureRaw(sensors[i]);
      int percent = moistureToPercentage(sensors[i]);

      // AUTO MODE: only if enabled and no forced OFF
      if (sensors[i].autoEnabled && !sensors[i].forcedOFF) {
        sensors[i].valveState = (percent < sensors[i].threshold);
      } else {
        sensors[i].valveState = false; // keep valve OFF
      }

      setRelay(valvePins[i], sensors[i].valveState);
      sendSensorReading(sensors[i], percent, lastUltrasonicMM);

      Serial.printf("%s → %d%% | Valve: %s | ForcedOFF: %s | Auto: %s\n",
                    sensors[i].name,
                    percent,
                    sensors[i].valveState ? "OPEN" : "CLOSED",
                    sensors[i].forcedOFF ? "YES" : "NO",
                    sensors[i].autoEnabled ? "YES" : "NO");

      if (sensors[i].valveState) pumpNeeded = true;
    }

    setRelay(PUMP_PIN, pumpNeeded);
    Serial.printf("PUMP → %s\n", pumpNeeded ? "ON" : "OFF");
    Serial.println("===============================================");
  }
}
