#include <WiFi.h>
#include <WebSocketsClient.h>
#include <HTTPClient.h>

// ===== WIFI CONFIG =====
const char* ssid = "bot";
const char* password = "12345678";

// ===== NODE.JS SERVER =====
const char* wsHost = "10.179.117.67"; // WebSocket IP
const uint16_t wsPort = 5000;
const char* wsPath = "/";
const char* apiUrl = "http://10.179.117.67:5000/readings/post/readings";

// ===== OBJECTS =====
WebSocketsClient webSocket;

// ===== SENSOR STRUCT =====
struct PlantSensor {
  int pin;        // pin or id in hardware
  int id;         // sensor ID
  const char* name;
  int moistureMax; // maximum moisture value
  int moistureMin; // minimum moisture value
  int temp;        // temperature value
  int moisture;    // current moisture value
  int threshold;   // some threshold
};

// ===== SENSOR INSTANCES =====
PlantSensor sensors[3] = {
  {32, 1, "Bokchoy", 3000, 1800, 21, 40, 70},
  {33, 4, "Petchay", 2900, 1750, 22, 50, 75},
  {34, 3, "Mustasa", 2800, 1700, 23, 45, 85}
};

// ===== FUNCTION: CONVERT TO PERCENTAGE =====
int moistureToPercentage(PlantSensor sensor) {
  int range = sensor.moistureMax - sensor.moistureMin;
  if (range == 0) return 0; // avoid division by zero
  int percentage = (sensor.moisture - sensor.moistureMin) * 100 / range;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  return percentage;
}

// ===== FUNCTION: SEND SENSOR VALUE TO API =====
void sendSensorReading(PlantSensor sensor) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");

    int percentage = moistureToPercentage(sensor);

    String payload = "{ \"sensor_id\": " + String(sensor.id) + 
                     ", \"sensor_name\": \"" + String(sensor.name) + "\"" +
                     ", \"value\": " + String(percentage) + " }";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("📡 API Response Code: ");
      Serial.println(httpResponseCode);
      Serial.println(http.getString());
    } else {
      Serial.print("❌ API Error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("❌ WiFi not connected (API)");
  }
}

// ===== WEBSOCKET EVENT HANDLER =====
bool firstHelloSent = false;

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("[WS] ✅ Connected to server");
      if (!firstHelloSent) {
        webSocket.sendTXT("{\"message\":\"Hello from ESP32\"}");
        firstHelloSent = true;
      }
      break;
    case WStype_TEXT:
      Serial.printf("[WS] 📩 Received: %s\n", payload);
      break;
    case WStype_DISCONNECTED:
      Serial.println("[WS] ❌ Disconnected");
      firstHelloSent = false;
      break;
    case WStype_ERROR:
      Serial.println("[WS] ⚠️ Error occurred");
      break;
    default:
      break;
  }
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // WebSocket init
  webSocket.begin(wsHost, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // reconnect every 5s if disconnected
}

// ===== LOOP =====
unsigned long lastSend = 0;
const unsigned long sendInterval = 5000; // 5 seconds

void loop() {
  webSocket.loop(); // REQUIRED

  if (millis() - lastSend >= sendInterval) {
    Serial.println("🌱 Sending sensor readings:");

    for (int i = 0; i < 3; i++) {
      // Update sensor reading (simulate)
      sensors[i].moisture = random(sensors[i].moistureMin, sensors[i].moistureMax + 1);

      // Convert to percentage
      int moisturePercent = moistureToPercentage(sensors[i]);

      // Print to Serial
      Serial.printf("%s: %d%%\n", sensors[i].name, moisturePercent);

      // Send to API
      sendSensorReading(sensors[i]);

      // Send to WebSocket
      if (webSocket.isConnected()) {
        String wsPayload = "{ \"sensor_id\": " + String(sensors[i].id) +
                           ", \"sensor_name\": \"" + String(sensors[i].name) + "\"" +
                           ", \"value\": " + String(moisturePercent) + " }";
        webSocket.sendTXT(wsPayload);
      }
    }
    lastSend = millis();
  }
}
