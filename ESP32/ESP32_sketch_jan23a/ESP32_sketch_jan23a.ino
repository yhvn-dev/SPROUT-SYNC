#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "bot";
const char* password = "12345678";

/************ SERVER ************/
const char* wsHost = "10.137.107.67";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.137.107.67:5000/readings/post/readings";

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
  int pin;             // moisture sensor pin
  int id;
  const char* name;
  int moistureMax;
  int moistureMin;
  int moisture;
  int threshold;
  bool valveState;     // current valve state
  bool forcedOFF;      // manual force OFF toggle
  bool autoEnabled;    // auto mode enabled
  bool lastButtonState;
  unsigned long lastDebounceTime;
};

PlantSensor sensors[3] = {
  {32, 1, "BOKCHOY", 3000, 1800, 0, 50, false, false, true, HIGH, 0},
  {33, 2, "PECHAY",  2900, 1750, 0, 50, false, false, true, HIGH, 0},
  {34, 3, "MUSTASA", 2800, 1700, 0, 55, false, false, true, HIGH, 0}
};

/************ STATE ************/
bool systemEnabled = false;
bool prevSystemEnabled = false;

unsigned long lastLogicRun = 0;
const unsigned long logicInterval = 5000;
const unsigned long debounceDelay = 200;

float lastUltrasonicMM = -1;
float lastUltrasonicIN = -1;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH); // active LOW
}

int readMoistureRaw(PlantSensor &s) {
  s.moisture = analogRead(s.pin);
  return s.moisture;
}

int moistureToPercentage(PlantSensor s) {
  int range = s.moistureMax - s.moistureMin;
  if (range <= 0) return 0;
  return constrain((s.moistureMax - s.moisture) * 100 / range, 0, 100);
}

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

float mmToInches(float mm) {
  return mm < 0 ? -1 : mm / 25.4;
}

/************ PLANT BUTTONS (FORCE OFF TOGGLE NON-BLOCKING) ************/
void handlePlantSwitches() {
  int btns[3] = {BOKCHOY_BTN, PECHAY_BTN, MUSTASA_BTN};

  for (int i = 0; i < 3; i++) {
    int reading = digitalRead(btns[i]);

    // debounce non-blocking
    if (reading != sensors[i].lastButtonState)
      sensors[i].lastDebounceTime = millis();

    if ((millis() - sensors[i].lastDebounceTime) > debounceDelay) {
      // button pressed (active LOW)
      if (reading == LOW && sensors[i].lastButtonState == HIGH) {
        sensors[i].forcedOFF = !sensors[i].forcedOFF; // toggle force OFF
        sensors[i].valveState = !sensors[i].forcedOFF; // immediately reflect valve state

        // Print immediate message to Serial Monitor
        if (sensors[i].forcedOFF) {
          setRelay(valvePins[i], false);
          Serial.printf("🛑 %s → FORCED OFF! Valve closed immediately.\n", sensors[i].name);
        } else {
          setRelay(valvePins[i], true);
          Serial.printf("🔄 %s → AUTO MODE RE-ENABLED!\n", sensors[i].name);
        }
      }
    }
    sensors[i].lastButtonState = reading;
  }
}

/************ MAIN SWITCH ************/
void handleMainSwitch() {
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);

  if (systemEnabled != prevSystemEnabled) {
    digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);

    for (int i = 0; i < 3; i++) {
      if (!systemEnabled) {
        sensors[i].valveState = false;
        setRelay(valvePins[i], false);
      }
    }
    setRelay(PUMP_PIN, false);

    Serial.println(systemEnabled ? "🟢 SYSTEM ON → AUTO MODE ACTIVE" : "🔴 SYSTEM OFF → ALL VALVES & PUMP OFF");
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
    pinMode(sensors[i].pin, INPUT);
  }

  pinMode(LOCK_SWITCH, INPUT_PULLUP);
  pinMode(SWITCH_LED, OUTPUT);

  pinMode(BOKCHOY_BTN, INPUT_PULLUP);
  pinMode(PECHAY_BTN, INPUT_PULLUP);
  pinMode(MUSTASA_BTN, INPUT_PULLUP);

  pinMode(US_STATUS_LED, OUTPUT);
  pinMode(US_TRIG_PIN, OUTPUT);
  pinMode(US_ECHO_PIN, INPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.println("\n🚀 ESP32 READY — BUTTONS FORCE VALVES OFF | AUTO USES SENSOR");
}

/************ LOOP ************/
void loop() {
  handleMainSwitch();
  handlePlantSwitches(); // instant Serial feedback when button pressed

  if (!systemEnabled) return;

  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();

    lastUltrasonicMM = readUltrasonicMM();
    lastUltrasonicIN = mmToInches(lastUltrasonicMM);

    bool pumpNeeded = false;

    Serial.println("===============================================");
    Serial.printf("📏 ULTRASONIC: %.1f mm | %.2f in\n", lastUltrasonicMM, lastUltrasonicIN);

    for (int i = 0; i < 3; i++) {
      int raw = readMoistureRaw(sensors[i]);
      int percent = moistureToPercentage(sensors[i]);

      // Auto mode only if not forced OFF
      if (sensors[i].autoEnabled && !sensors[i].forcedOFF)
        sensors[i].valveState = (percent < sensors[i].threshold);

      setRelay(valvePins[i], sensors[i].valveState);
      if (sensors[i].valveState) pumpNeeded = true;

      Serial.printf(
        "%s [RAW: %d] → %d%% | Valve: %s | Mode: %s\n",
        sensors[i].name,
        raw,
        percent,
        sensors[i].valveState ? "OPEN" : "CLOSED",
        sensors[i].forcedOFF ? "FORCE OFF" : "AUTO"
      );
    }

    setRelay(PUMP_PIN, pumpNeeded);
    Serial.printf("🚰 PUMP → %s\n", pumpNeeded ? "ON" : "OFF");
    Serial.println("===============================================");
  }
}
