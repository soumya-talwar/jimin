void setup() {
  pinMode(5, INPUT);
  Serial.begin(9600);
}

void loop() {
  int reading= digitalRead(5);
  Serial.println(reading);
  delay (1000);
}
