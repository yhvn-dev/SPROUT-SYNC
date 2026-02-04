#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

/************ WIFI CONFIG ************/
const char* ssid = "bot";
const char* password = "12345678";

/************ SERVER ************/
const char* wsHost = "10.25.99.67";
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.25.99.67:5000/readings/post/readings";

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
#define US_RX_PIN 16
#define US_TX_PIN 17
HardwareSerial ultrasonic(2);
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
const unsigned long logicInterval = 5000;

/************ UTILS ************/
void setRelay(int pin, bool on) {
  digitalWrite(pin, on ? LOW : HIGH);
}

int moistureToPercentage(PlantSensor s) {
  int range = s.moistureMax - s.moistureMin;
  if (range <= 0) return 0;
  return constrain((s.moistureMax - s.moisture) * 100 / range, 0, 100);
}

bool isSensorConnected(int reading, PlantSensor s) {
  return !(reading < 600 || reading > s.moistureMax + 100);
}

/************ ULTRASONIC ************/
float readUltrasonicMM() {
  if (ultrasonic.available() >= 4) {
    uint8_t data[4];
    ultrasonic.readBytes(data, 4);
    if (data[0] == 0xFF) {
      digitalWrite(US_STATUS_LED, HIGH);
      return (data[1] << 8) | data[2];
    }
  }
  digitalWrite(US_STATUS_LED, LOW);
  return -1;
}

/************ COMM ************/
void sendSensorReading(PlantSensor sensor, int percent) {
  if (!wsConnected || WiFi.status() != WL_CONNECTED) return;

  String payload = "{ \"sensor_id\": " + String(sensor.id) +
                   ", \"sensor_name\": \"" + String(sensor.name) + "\"" +
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

/************ PLANT SWITCHES ************/
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

/************ MAIN SWITCH ************/
void handleMainSwitch() {
  systemEnabled = (digitalRead(LOCK_SWITCH) == LOW);

  if (systemEnabled != prevSystemEnabled) {
    Serial.println();
    Serial.println(systemEnabled ? "SYSTEM ON" : "SYSTEM OFF");

    digitalWrite(SWITCH_LED, systemEnabled ? HIGH : LOW);

    if (!systemEnabled) {
      setRelay(PUMP_PIN, false);
      for (int i = 0; i < 3; i++) {
        setRelay(valvePins[i], false);
        sensors[i].valveState = false;
        sensors[i].forcedOFF = false;
      }
    }

    lastLogicRun = 0;
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
  ultrasonic.begin(9600, SERIAL_8N1, US_RX_PIN, US_TX_PIN);

  initWiFi();
  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);
}

/************ LOOP ************/
void loop() {
  handleMainSwitch();
  if (!systemEnabled) return;

  webSocket.loop();
  handlePlantSwitches();

  if (millis() - lastLogicRun < logicInterval) return;
  lastLogicRun = millis();

  Serial.println();
  Serial.println("PLANT | RAW | % | VALVE | MODE");
  Serial.println("---------------------------------------------");

  bool pumpNeeded = false;

  for (int i = 0; i < 3; i++) {
    sensors[i].moisture = analogRead(sensors[i].pin);
    sensors[i].connected = isSensorConnected(sensors[i].moisture, sensors[i]);
    int percent = moistureToPercentage(sensors[i]);

    if (!sensors[i].forcedOFF) {
      sensors[i].valveState =
        sensors[i].connected && percent < sensors[i].threshold;
      setRelay(valvePins[i], sensors[i].valveState);
    }

    if (sensors[i].valveState) pumpNeeded = true;

    Serial.printf(
      "%-8s | %4d | %3d | %-6s | %s\n",
      sensors[i].name,
      sensors[i].moisture,
      percent,
      sensors[i].valveState ? "OPEN" : "CLOSE",
      sensors[i].forcedOFF ? "FORCED" : "AUTO"
    );

    sendSensorReading(sensors[i], percent);
  }

  setRelay(PUMP_PIN, pumpNeeded);

  Serial.println("---------------------------------------------");
  Serial.printf("PUMP: %s\n", pumpNeeded ? "ON" : "OFF");
}
