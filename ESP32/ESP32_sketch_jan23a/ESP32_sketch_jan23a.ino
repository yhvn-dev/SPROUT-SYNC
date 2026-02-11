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

/************ OBJECTS ************/
WebSocketsClient webSocket;

/************ PUMP & VALVES ************/
#define PUMP_PIN 18
int valvePins[3] = {23, 22, 21};

/************ BUTTONS ************/
#define LOCK_SWITCH 19
#define SWITCH_LED  2
#define BTN_BOKCHOY 25
#define BTN_PECHAY  26
#define BTN_MUSTASA 27

/************ ULTRASONIC ************/
#define TRIG_PIN 16
#define ECHO_PIN 17
#define DRUM_HEIGHT_INCH 36.0
#define MIN_WATER_INCH 5.0

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
};

PlantSensor sensors[3] = {
  {32, 1, "BOKCHOY", 3000, 1800, 0, 50, false, false},
  {33, 4, "PECHAY",  2900, 1750, 0, 50, false, false},
  {34, 3, "MUSTASA", 2800, 1700, 0, 55, false, false}
};

/************ STATE ************/
bool systemEnabled = false;
bool wifiPrinted = false;
bool pumpArmed = false;

/************ TIMERS ************/
unsigned long lastLogicRun = 0;
unsigned long lastSend10Min = 0;

const unsigned long logicInterval = 5000;
const unsigned long sendInterval10Min = 600000;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

int moistureToPercentage(PlantSensor s) {
  int range = s.moistureMax - s.moistureMin;
  return range > 0
    ? constrain((s.moistureMax - s.moisture) * 100 / range, 0, 100)
    : 0;
}

/************ ULTRASONIC ************/
float getWaterLevelInch() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float distance = duration * 0.0133 / 2;
  float level = DRUM_HEIGHT_INCH - distance;

  return constrain(level, 0, DRUM_HEIGHT_INCH);
}

/************ SEND DATA ************/
void sendReadings(const char* reason) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"reason\":\"" + String(reason) + "\","; 
  payload += "\"water_level\":" + String(getWaterLevelInch()) + ",";
  payload += "\"sensors\":[";

  for (int i = 0; i < 3; i++) {
    payload += "{";
    payload += "\"id\":" + String(sensors[i].id) + ",";
    payload += "\"name\":\"" + String(sensors[i].name) + "\",";
    payload += "\"raw\":" + String(sensors[i].moisture) + ",";
    payload += "\"percent\":" + String(moistureToPercentage(sensors[i])) + ",";
    payload += "\"valve\":" + String(sensors[i].valveState ? "1" : "0");
    payload += "}";
    if (i < 2) payload += ",";
  }

  payload += "]}";
  http.POST(payload);
  http.end();
}

/************ HANDLE NODE COMMAND ************/
void handleNodeMessage(String msg) {
  msg.trim();

  if (msg.indexOf("BOKCHOY_OFF") != -1 &&
      msg.indexOf("PECHAY_OFF") != -1 &&
      msg.indexOf("MUSTASA_OFF") != -1) {
    for (int i = 0; i < 3; i++) sensors[i].forcedOFF = true;
    Serial.println("🔴 NODE: ALL PLANTS FORCED OFF");
    return;
  }

  if (msg.indexOf("BOKCHOY_AUTO") != -1 &&
      msg.indexOf("PECHAY_AUTO") != -1 &&
      msg.indexOf("MUSTASA_AUTO") != -1) {
    for (int i = 0; i < 3; i++) sensors[i].forcedOFF = false;
    Serial.println("🟢 NODE: ALL PLANTS AUTO");
    return;
  }

  for (int i = 0; i < 3; i++) {
    if (msg == String(sensors[i].name) + "_OFF") {
      sensors[i].forcedOFF = true;
      Serial.printf("🔴 NODE: %s OFF\n", sensors[i].name);
    }
    if (msg == String(sensors[i].name) + "_AUTO") {
      sensors[i].forcedOFF = false;
      Serial.printf("🟢 NODE: %s AUTO\n", sensors[i].name);
    }
  }
}

/************ WEBSOCKET ************/
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_TEXT) {
    handleNodeMessage(String((char*)payload));
  }
}

/************ WIFI (NON-BLOCKING) ************/
void handleWiFi() {
  static unsigned long lastAttempt = 0;
  unsigned long now = millis();

  if (WiFi.status() == WL_CONNECTED) {
    if (!wifiPrinted) {
      wifiPrinted = true;
      Serial.println("🟢 WiFi CONNECTED: " + WiFi.localIP().toString());
      webSocket.begin(wsHost, wsPort, wsPath);
      webSocket.onEvent(webSocketEvent);
    }
    return;
  }

  wifiPrinted = false;

  if (now - lastAttempt > 5000) {
    lastAttempt = now;
    Serial.println("🔄 WiFi connecting...");
    WiFi.begin(ssid, password);
  }
}

/************ MANUAL BUTTONS ************/
void handleManualButtons() {
  static bool last[3] = {HIGH, HIGH, HIGH};
  int btns[3] = {BTN_BOKCHOY, BTN_PECHAY, BTN_MUSTASA};

  for (int i = 0; i < 3; i++) {
    bool now = digitalRead(btns[i]);
    if (now == LOW && last[i] == HIGH) {
      sensors[i].forcedOFF = !sensors[i].forcedOFF;
      Serial.printf("🟡 BUTTON: %s %s\n",
        sensors[i].name,
        sensors[i].forcedOFF ? "FORCED OFF" : "AUTO");
    }
    last[i] = now;
  }
}

/************ SYSTEM SWITCH (DEBOUNCED NON-BLOCKING) ************/
void handleMainSwitch() {
  static bool lastState = HIGH;
  static unsigned long lastDebounce = 0;
  const unsigned long debounceDelay = 50;

  bool reading = digitalRead(LOCK_SWITCH);

  if (reading != lastState) {
    lastDebounce = millis();
  }

  if ((millis() - lastDebounce) > debounceDelay) {
    static bool lastSystemState = false;
    if (reading == LOW && systemEnabled == lastSystemState) {
      systemEnabled = !systemEnabled;
      digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);

      // Immediately close/open pump & valves
      if (!systemEnabled) {
        setRelay(PUMP_PIN, false);
        for (int i = 0; i < 3; i++) setRelay(valvePins[i], false);
        pumpArmed = false;
      }

      Serial.println(systemEnabled ? "🟢 SYSTEM ON" : "🔴 SYSTEM OFF");

      lastSystemState = systemEnabled;
    }
  }

  lastState = reading;
}

/************ SETUP ************/
void setup() {
  Serial.begin(115200);

  pinMode(PUMP_PIN, OUTPUT);
  pinMode(SWITCH_LED, OUTPUT);
  pinMode(LOCK_SWITCH, INPUT_PULLUP);

  pinMode(BTN_BOKCHOY, INPUT_PULLUP);
  pinMode(BTN_PECHAY, INPUT_PULLUP);
  pinMode(BTN_MUSTASA, INPUT_PULLUP);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  for (int i = 0; i < 3; i++) {
    pinMode(valvePins[i], OUTPUT);
    setRelay(valvePins[i], false);
  }

  WiFi.mode(WIFI_STA);
  Serial.println("🚀 READY (SYSTEM OFF)");
}

/************ LOOP ************/
void loop() {
  handleMainSwitch();      // always top
  handleWiFi();
  webSocket.loop();
  handleManualButtons();

  if (!systemEnabled) {
    delay(10);
    return; // skip irrigation logic
  }

  if (millis() - lastLogicRun >= logicInterval) {
    lastLogicRun = millis();

    bool pumpRequest = false;
    float waterLevel = getWaterLevelInch();

    Serial.printf("\n🌊 WATER LEVEL: %.2f / %.0f inches\n",
      waterLevel, DRUM_HEIGHT_INCH);

    for (int i = 0; i < 3; i++) {
      sensors[i].moisture = analogRead(sensors[i].pin);
      int percent = moistureToPercentage(sensors[i]);

      if (!sensors[i].forcedOFF &&
          percent < sensors[i].threshold &&
          waterLevel > MIN_WATER_INCH) {
        sensors[i].valveState = true;
        pumpRequest = true;
        sendReadings("THRESHOLD");
      } else {
        sensors[i].valveState = false;
      }

      setRelay(valvePins[i], sensors[i].valveState);

      Serial.printf("[%s] RAW:%d %%:%d MODE:%s VALVE:%s\n",
        sensors[i].name,
        sensors[i].moisture,
        percent,
        sensors[i].forcedOFF ? "FORCED" : "AUTO",
        sensors[i].valveState ? "OPEN" : "CLOSED");
    }

    if (!pumpArmed) {
      pumpArmed = true;
      setRelay(PUMP_PIN, false);
      Serial.println("⏳ PUMP ARMED (NEXT CYCLE)");
    } else {
      setRelay(PUMP_PIN, pumpRequest);
      Serial.printf("🚰 PUMP: %s\n", pumpRequest ? "ON" : "OFF");
    }
  }

  if (millis() - lastSend10Min >= sendInterval10Min) {
    lastSend10Min = millis();
    sendReadings("PERIODIC");
    Serial.println("📤 DATA SENT (10 MIN)");
  }

}
