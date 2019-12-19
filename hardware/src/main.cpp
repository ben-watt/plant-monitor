#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>
#include <ArduinoJson.h>
#include <string>
#include <gpio.h>
#include <Esp.h>
#include <stdio.h>
#include "Adafruit_Si7021.h"

class Sensor {
  public:
    void ReadSensor() {
      Adafruit_Si7021 sensor = Adafruit_Si7021();
    	if (!sensor.begin()) {
        Serial.println("Did not find Si7021 sensor!");
        while (true)
          ;
  	  }

      Serial.print("Found model ");
      switch(sensor.getModel()) {
        case SI_Engineering_Samples:
          Serial.print("SI engineering samples"); break;
        case SI_7013:
          Serial.print("Si7013"); break;
        case SI_7020:
          Serial.print("Si7020"); break;
        case SI_7021:
          Serial.print("Si7021"); break;
        case SI_UNKNOWN:
        default:
          Serial.print("Unknown");
      }

      Serial.print(" Rev(");
      Serial.print(sensor.getRevision());
      Serial.print(")");
      Serial.print(" Serial #"); Serial.print(sensor.sernum_a, HEX); Serial.println(sensor.sernum_b, HEX);

      Serial.print("Humidity:    ");
      Serial.print(sensor.readHumidity(), 2);
      Serial.print("\tTemperature: ");
      Serial.println(sensor.readTemperature(), 2);
      delay(1000);
      
    }
};

class MyWifi {
  private:
    static void ShowConnecting() {
      Serial.print(".");
      digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    }

  private:
    static void TryToConnect(StaticJsonDocument<256> doc) {
      const char *_ssid, *_password = "";
      _ssid = doc["ssid"];
      _password = doc["password"];
      WiFi.mode(WIFI_STA);
      WiFi.hostname("plant-monitor");
      WiFi.begin(_ssid, _password);
      unsigned long startTime = millis();
      while(WiFi.status() != WL_CONNECTED) {
        delay(500);
        ShowConnecting();
        if(millis() - startTime > 5000) break;
      }
    }

  private:
    static StaticJsonDocument<256> GetConnectionConfig() {
      File configFile = SPIFFS.open("/config.json", "r");
      size_t size = configFile.size();
      std::unique_ptr<char[]> buf(new char[size]);
      configFile.readBytes(buf.get(), size);
      configFile.close();

      StaticJsonDocument<256> doc;
      deserializeJson(doc, buf.get());
      return doc;
    }

  public:
    static bool HasSavedConnectionConfig() {
      return SPIFFS.exists("/config.json");
    }

  public:
    static void wifiConnect() {
      WiFi.softAPdisconnect(true);
      WiFi.disconnect();
      delay(1000);

      if(HasSavedConnectionConfig()) {
        auto doc = GetConnectionConfig();
        TryToConnect(doc);
      }

      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("");
      WiFi.printDiag(Serial);
      Serial.print("Connected, IP address: ");
      delay(1000);
      Serial.println(WiFi.localIP());
    }

  public:
    static void CreateAccessPoint(const char* mySsid, const char* password) {
      IPAddress local_ip(192, 168, 11, 4); // This is the address of the page served
      IPAddress gateway(192, 168, 11, 1);
      IPAddress netmask(255, 255, 255, 0);
      WiFi.mode(WIFI_AP);
      WiFi.hostname("plant-monitor");
      WiFi.softAPConfig(local_ip, gateway, netmask);
      WiFi.softAP(mySsid, password);

      Serial.println("Searching for access points...");
      auto networks = WiFi.scanNetworks();
      // Scan for available networks and their names
      Serial.print("Found ");
      Serial.print(networks);
      Serial.print(" networks");
      Serial.println("");
      for (int8_t i = 0; i < networks; i++)
      {
        Serial.println(WiFi.SSID(i));
      }

      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("");
      WiFi.printDiag(Serial);
    }
};

ESP8266WebServer server;


void handleMoist() {
  const int PIN = A0;
  Serial.print("Reading moistness level...");
  int moistness = analogRead(PIN);
  char *intStr = itoa(moistness, intStr, 10);
  auto str = String(intStr);
  Serial.print("Moistness: ");
  Serial.println(*intStr);
  server.send(200, "text/plain", str);
}

void handleSettingsUpdate() {
  String data = server.arg("plain");
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, data);
  if(!err) {
    File configFile = SPIFFS.open("/config.json", "w");
    deserializeJson(doc, configFile);
    configFile.close();

    server.send(200, "application/json", "{\"status\":\"ok\"}");

    delay(500);

    MyWifi::wifiConnect();
  }
}

void serveIndexFile() {
  File file = SPIFFS.open("/index.html", "r");
  server.streamFile(file, "text/html");
  file.close();
}

bool inSetup = true;

void setup() {
  char *password = "password";
  char *mySsid = "bears";
  Serial.begin(74880);
  SPIFFS.begin();
  WiFi.begin(mySsid, password);

  if(MyWifi::HasSavedConnectionConfig()) {
    MyWifi::wifiConnect();
    inSetup = false;
  } else {
    MyWifi::CreateAccessPoint(mySsid, password);
  }

  server.on("/", HTTP_GET, serveIndexFile);
  server.on("/moist", HTTP_GET, handleMoist);
  server.on("/settings", HTTP_POST, handleSettingsUpdate);
  server.begin();
}

void loop() {
  if(inSetup) {
    server.handleClient();
    delay(1000);
  } else {
    int64_t seconds = 10e6;
    delay(10);
    Sensor s;
    s.ReadSensor();
    Serial.print("Going to sleep...");
    ESP.deepSleep(seconds);
  }

}