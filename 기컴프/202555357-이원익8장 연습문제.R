# 데이터 입력
branch <- c("금정점", "서구점", "동구점", "사상점")
sales_Q1 <- c(12, 6, 5, 7)
sales_Q2 <- c(10, 12, 9, 8)

# 행렬 형태로 묶기 (각 열이 분기)
sales <- rbind(sales_Q1, sales_Q2)

# 막대그래프 생성
barplot(
  sales,
  beside = TRUE,                       # 분기별 막대 나란히
  names.arg = branch,                  # 지점 이름
  col = c("green", "blue"),            # 색상
  ylim = c(0, 15),
  main = "지점별 판매실적",
  xlab = "지점명",
  ylab = "판매 실적(억 원)"
)

# 범례 추가
legend("topright",
       legend = c("2017년 1분기", "2017년 2분기"),
       fill = c("green", "blue"))
