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
  bool connected;
  bool valveState;
  bool forcedOFF;
};

PlantSensor sensors[3] = {
  {32, 1, "BOKCHOY", 3000, 1800, 0, 50, false, false, false},
  {33, 2, "PECHAY",  2900, 1750, 0, 50, false, false, false},
  {34, 3, "MUSTASA", 2800, 1700, 0, 55, false, false, false}
};

/************ STATE ************/
bool systemEnabled = false;
bool prevSystemEnabled = false;
bool wsConnected = false;

unsigned long lastLogicRun = 0;
const unsigned long logicInterval = 5000; // 5 seconds
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

/************ ULTRASONIC READ ************/
float readUltrasonicMM() {
  digitalWrite(US_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(US_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(US_TRIG_PIN, LOW);

  long duration = pulseIn(US_ECHO_PIN, HIGH, 30000); // 30ms timeout

  if (duration == 0) {
    digitalWrite(US_STATUS_LED, LOW);
    return -1;
  }

  digitalWrite(US_STATUS_LED, HIGH);
  return (duration * 0.343) / 2.0; // distance in mm
}

/************ COMMUNICATION ************/
void sendSensorReading(PlantSensor sensor, int percent) {
  if (!wsConnected || WiFi.status() != WL_CONNECTED) return;

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + sensor.name + "\"" +
                   ", \"value\": " + String(percent) +
                   ", \"valve\": \"" + (sensor.valveState ? "OPEN" : "CLOSED") + "\" }";

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.POST(payload);
  http.end();

  webSocket.sendTXT(payload);
}

void webSocketEvent(WStype_t type, uint8_t*, size_t) {
  wsConnected = (type == WStype_CONNECTED);
}

void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
}

/************ SWITCH HANDLERS ************/
void handlePlantSwitches() {
  int btns[3] = {BOKCHOY_BTN, PECHAY_BTN, MUSTASA_BTN};

  for (int i = 0; i < 3; i++) {
    sensors[i].forcedOFF = (digitalRead(btns[i]) == HIGH);
    if (sensors[i].forcedOFF) {
      sensors[i].valveState = false;
      setRelay(valvePins[i], false);
    }
  }
}

void handleMainSwitch() {
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);

  if (systemEnabled != prevSystemEnabled) {
    digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);

    if (!systemEnabled) {
      setRelay(PUMP_PIN, false);
      for (int i = 0; i < 3; i++) {
        setRelay(valvePins[i], false);
        sensors[i].valveState = false;
        sensors[i].forcedOFF = false;
      }
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

  Serial.println("SYSTEM READY — MOISTURE + ULTRASONIC EVERY 5 SECONDS");
}

/************ LOOP ************/
void loop() {
  handleMainSwitch();
  if (!systemEnabled) return;

  webSocket.loop();
  handlePlantSwitches();

  // ---- Run logic every 5 seconds ----
  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();

    // 1️⃣ Read Ultrasonic
    lastUltrasonicMM = readUltrasonicMM();
    float cm = lastUltrasonicMM / 10.0;
    float inches = lastUltrasonicMM / 25.4;

    // 2️⃣ Read Moisture sensors
    Serial.println("===============================================");
    Serial.println("ULTRASONIC & MOISTURE SENSOR READINGS (5s)");

    if (lastUltrasonicMM > 0) {
      Serial.printf("ULTRASONIC → %.1f mm | %.1f cm | %.2f inches\n",
                    lastUltrasonicMM, cm, inches);
    } else {
      Serial.println("ULTRASONIC → NO VALID DATA");
    }

    for (int i = 0; i < 3; i++) {
      int raw = readMoistureRaw(sensors[i]);
      int percent = moistureToPercentage(sensors[i]);
      sensors[i].valveState = (!sensors[i].forcedOFF) && (percent < sensors[i].threshold);

      Serial.printf("%-8s → RAW: %4d | %3d%% | Valve: %s | ForcedOFF: %s\n",
                    sensors[i].name,
                    raw,
                    percent,
                    sensors[i].valveState ? "OPEN" : "CLOSED",
                    sensors[i].forcedOFF ? "YES" : "NO");

      setRelay(valvePins[i], sensors[i].valveState);
      sendSensorReading(sensors[i], percent);
    }

    // 3️⃣ Pump logic
    bool pumpNeeded = false;
    for (int i = 0; i < 3; i++) {
      if (sensors[i].valveState) pumpNeeded = true;
    }
    setRelay(PUMP_PIN, pumpNeeded);
    Serial.printf("PUMP STATUS → %s\n", pumpNeeded ? "ON" : "OFF");
    Serial.println("===============================================");
  }
}
