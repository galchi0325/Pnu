const int Enable1 = 38;   
const int PWM1 = 9;    
const int DIR1 = 39;   
const int button_pin = 14; 

boolean direction = true;   

void setup() {
  pinMode(Enable1, OUTPUT);
  pinMode(DIR1, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(button_pin, INPUT);   // 버튼은 외부 풀다운 저항 사용
  digitalWrite(Enable1, HIGH);  // L293D 모터 채널 활성화
  digitalWrite(DIR1, direction);
  digitalWrite(PWM1, !direction);
  Serial.begin(9600);           // 시리얼 모니터 초기화
}

void loop() {
  if (digitalRead(button_pin)) {
    direction = !direction;

    if (direction)   // clockwise
      Serial.println("Clockwise...");
    else
      Serial.println("Anti-clockwise...");

    digitalWrite(DIR1, direction);
    digitalWrite(PWM1, !direction);

    delay(2000);    
  }
}
