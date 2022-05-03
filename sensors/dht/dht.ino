#include "DHT.h"
#define DHTPIN 5
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);
  float humid  = dht.readHumidity();
  float temp = dht.readTemperature();

  if (isnan(humid) || isnan(temp)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.print("humidity: ");
    Serial.print(humid);
    Serial.println("%");
    Serial.print("temperature: ");
    Serial.print(temp);
    Serial.println("°C");
  }
}
