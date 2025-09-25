# 연습문제3-2 
Rainfalls <- c(100,50,150,120,80,300,600,300,200,100,70,100)
sumRainfalls <- sum(Rainfalls)
avgRainfalls <- mean(sumRainfalls)
posMaxRainfalls <- which.max(Rainfalls)
posMinRainfalls <- which.min(Rainfalls)
print("월별 강우량의 평균: ")
print(avgRainfalls)
print("비가 가장 많이 온 달: ")
print(posMaxRainfalls)
print("비가 가장 적게 온 달: ")
print(posMinRainfalls)

#연습문제 3-3 
birthday1 <- "19980618"
birthdayYear1 <- as.numeric(substr(birthday1,1,4))
birthday2 <- "19901214"
birthdayYear2 <- as.numeric(substr(birthday2,1,4))
ThisYear <- as.numeric(format(Sys.Date(),"%Y")
Age1 <- ThisYear-birthdayYear1
Age2 <- ThisYear-birthdayYear2
Agelist <- c(Age1,Age2)
AgeDifference <- max(Agelist)-min(Agelist)
print("두사람의 나이 차이는 ")
print(AgeDifference)
