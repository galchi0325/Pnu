const int Enable1 = 38; 
const int DIR1 = 39;  
const int PWM1 = 9;   

void setup() {
  pinMode(Enable1, OUTPUT);
  pinMode(DIR1, OUTPUT);
  pinMode(PWM1, OUTPUT);
  digitalWrite(Enable1, HIGH); // 모터 채널 활성화
  Serial.begin(9600);          // 시리얼 모니터 출력 시작
}


void loop() {
  int reading = analogRead(A0);
  int speed = map(reading, 0, 1023, -255, 255);
  if (speed > 0) {
    digitalWrite(DIR1, HIGH); // 정방향 회전
    int pwm_value = 255 - speed;
    analogWrite(PWM1, pwm_value);
    Serial.print(String("Reading : ") + reading);
    Serial.println(String(", Clockwise : ") + speed);
  }
  else {
    digitalWrite(DIR1, LOW); // 역방향 회전
    int pwm_value = abs(speed);
    analogWrite(PWM1, pwm_value);
    Serial.print(String("Reading : ") + reading);
    Serial.println(String(", Anti-clockwise : ") + pwm_value);
  }
  delay(1000);
}
