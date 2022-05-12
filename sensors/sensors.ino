#include "DHT.h"
#define DHTPIN 5
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float light = analogRead(A0);
  float moisture = analogRead(A1);
  float humid  = dht.readHumidity();
  float temp = dht.readTemperature();
  if (!isnan(humid) && !isnan(temp)) {
    Serial.print(temp);
    Serial.print(" ");
    Serial.print(humid);
    Serial.print(" ");
    Serial.print(light);
    Serial.print(" ");
    Serial.println(moisture);
  }
  delay(2000);
}
