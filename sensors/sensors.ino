#include "DHT.h"
#define DHTPIN 3
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  int moisture = analogRead(A0);
  int humid  = dht.readHumidity();
  float temp = dht.readTemperature();
  int light = analogRead(A2);
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
