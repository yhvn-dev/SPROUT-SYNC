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
  bool forcedOFF;    
  bool autoEnabled;  
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
bool wsConnected = false;
bool wsDisconnectedPrinted = false;

unsigned long lastLogicRun = 0;
const unsigned long logicInterval = 5000;
float lastUltrasonicMM = -1;
float lastUltrasonicIN = -1;
const unsigned long debounceDelay = 200;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH); // Active LOW relay
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

float mmToInches(float mm) {
  if (mm < 0) return -1;
  return mm / 25.4;
}

/************ COMMUNICATION ************/
void sendSensorReading(PlantSensor sensor, int percent, float ultrasonicMM, float ultrasonicIN) {
  if (!wsConnected || WiFi.status() != WL_CONNECTED) return;

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + sensor.name + "\"" +
                   ", \"value\": " + String(percent) +
                   ", \"valve\": \"" + (sensor.valveState ? "OPEN" : "CLOSED") + "\"" +
                   ", \"ultrasonic_mm\": " + String(ultrasonicMM) +
                   ", \"ultrasonic_in\": " + String(ultrasonicIN) + " }";

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
      sensors[index].autoEnabled = false;
      sensors[index].valveState = false;
      setRelay(valvePins[index], false);
      Serial.printf("🚫 %s VALVE COMPLETELY OFF FROM SERVER\n", sensors[index].name);
      return;
    } else if (cmd.endsWith("_ON") || cmd.endsWith("_AUTO")) {
      sensors[index].forcedOFF = false;
      sensors[index].autoEnabled = true;
      Serial.printf("✅ %s AUTO MODE RESUMES FROM SERVER\n", sensors[index].name);
      return;
    }
  }

  if (cmd == "SYSTEM_OFF") {
    for (int i = 0; i < 3; i++) {
      sensors[i].forcedOFF = true;
      sensors[i].autoEnabled = false;
      sensors[i].valveState = false;
      setRelay(valvePins[i], false);
    }
    setRelay(PUMP_PIN, false);
    Serial.println("🚫 FULL SYSTEM OFF FROM SERVER");
  } else if (cmd == "SYSTEM_ON") {
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
      wsDisconnectedPrinted = false;
      Serial.println("✅ WebSocket Connected");
      break;
    case WStype_DISCONNECTED:
      wsConnected = false;
      if (!wsDisconnectedPrinted) {
        Serial.println("❌ WebSocket Disconnected");
        wsDisconnectedPrinted = true;
      }
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

/************ BUTTON HANDLERS ************/
void handlePlantSwitches() {
  int btns[3] = {BOKCHOY_BTN, PECHAY_BTN, MUSTASA_BTN};

  for (int i = 0; i < 3; i++) {
    int reading = digitalRead(btns[i]);

    // debounce
    if (reading != sensors[i].lastButtonState) sensors[i].lastDebounceTime = millis();

    if ((millis() - sensors[i].lastDebounceTime) > debounceDelay) {
      if (reading == LOW && sensors[i].lastButtonState == HIGH) {
        // TRUE TOGGLE FORCE OFF / AUTO
        sensors[i].forcedOFF = !sensors[i].forcedOFF;
        sensors[i].autoEnabled = !sensors[i].forcedOFF;

        // FORCEFULLY CLOSE valve immediately if forcedOFF
        if (sensors[i].forcedOFF) {
          sensors[i].valveState = false;
          setRelay(valvePins[i], false);
        } else {
          // resume automatic calculation
          sensors[i].valveState = (moistureToPercentage(sensors[i]) < sensors[i].threshold);
          setRelay(valvePins[i], sensors[i].valveState);
        }

        // Update pump immediately
        bool pumpNeeded = false;
        for (int j = 0; j < 3; j++) {
          if (sensors[j].valveState) pumpNeeded = true;
        }
        setRelay(PUMP_PIN, systemEnabled ? pumpNeeded : false);

        Serial.printf("🔄 %s BUTTON → ForcedOFF: %s | Auto: %s | Valve: %s | Pump: %s\n",
                      sensors[i].name,
                      sensors[i].forcedOFF ? "YES" : "NO",
                      sensors[i].autoEnabled ? "YES" : "NO",
                      sensors[i].valveState ? "OPEN" : "CLOSED",
                      systemEnabled ? (pumpNeeded ? "ON" : "OFF") : "SYSTEM OFF");

        // Send network update immediately
        sendSensorReading(sensors[i], moistureToPercentage(sensors[i]), lastUltrasonicMM, lastUltrasonicIN);
      }
    }
    sensors[i].lastButtonState = reading;
  }
}

void handleMainSwitch() {
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);
  if (systemEnabled != prevSystemEnabled) {
    digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);

    if (!systemEnabled) {
      // SYSTEM OFF → CLOSE EVERYTHING
      for (int i = 0; i < 3; i++) {
        sensors[i].valveState = false;
        setRelay(valvePins[i], false);
      }
      setRelay(PUMP_PIN, false);
      Serial.println("🔴 SYSTEM DISABLED → All valves and pump OFF");
    } else {
      Serial.println("✅ SYSTEM ENABLED → Automatic functions resumed");
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

  Serial.println("✅ SYSTEM READY — Plant buttons TRUE FORCE OFF / AUTO TOGGLE");
}

/************ LOOP ************/
void loop() {
  webSocket.loop();
  handleMainSwitch();
  handlePlantSwitches();

  if (!systemEnabled) return; // skip automatic logic when system OFF

  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();
    lastUltrasonicMM = readUltrasonicMM();
    lastUltrasonicIN = mmToInches(lastUltrasonicMM);

    Serial.printf("📏 ULTRASONIC DISTANCE: %.1f mm | %.2f in\n", lastUltrasonicMM, lastUltrasonicIN);
    Serial.println("===============================================");

    bool pumpNeeded = false;

    for (int i = 0; i < 3; i++) {
      int raw = readMoistureRaw(sensors[i]);
      int percent = moistureToPercentage(sensors[i]);

      // auto update only if not forced OFF
      if (sensors[i].autoEnabled && !sensors[i].forcedOFF) {
        sensors[i].valveState = (percent < sensors[i].threshold);
      }

      setRelay(valvePins[i], sensors[i].valveState);
      sendSensorReading(sensors[i], percent, lastUltrasonicMM, lastUltrasonicIN);

      if (sensors[i].valveState) pumpNeeded = true;

      Serial.printf("%s → %d%% | Valve: %s | ForcedOFF: %s | Auto: %s\n",
                    sensors[i].name,
                    percent,
                    sensors[i].valveState ? "OPEN" : "CLOSED",
                    sensors[i].forcedOFF ? "YES" : "NO",
                    sensors[i].autoEnabled ? "YES" : "NO");
    }

    setRelay(PUMP_PIN, pumpNeeded);
    Serial.printf("PUMP → %s\n", pumpNeeded ? "ON" : "OFF");
    Serial.println("===============================================");
  }
}
