# 필요한 패키지 설치 및 로드
install.packages("KoNLP")
install.packages("dplyr")
install.packages("wordcloud")

library(KoNLP)
library(dplyr)
library(stringr)
library(wordcloud)

# KoNLP 사전 로드
useNIADic()

# --- 텍스트 데이터 (전체 연설문을 여기에 붙여넣어야 함) ---
text_speech <- "토머스 도너휴 미국상공회의소 회장님, 박용만 대한상공회의소 회장님, 그리고 이 자리에 함께하신 경제계 지도자 여러분, 만나서 반갑습니다.
따뜻하게 환영해 주시고, 성대한 만찬을 베풀어 주셔서 감사합니다.
대통령 취임 이후 첫 순방지로 미국을 방문했습니다.
60년 넘게 굳건하게 이어온 한미동맹의 재확인입니다.
경제파트너로서의 중요성에 대한 재확인이기도 합니다.
한국은 최근 유례없는 정치적 격변기를 경험했습니다.
... (이하 생략하고 전체 텍스트를 입력해야 합니다) ..."

# 명사 추출
nouns <- extractNoun(text_speech) %>% unlist()

# 빈도수 계산
word_freq_kr <- nouns %>%
  table() %>%
  as.data.frame() %>%
  rename(Word = '.', Frequency = Freq) %>%
  arrange(desc(Frequency))

# 불용어 제거 및 1글자 단어 제거
stopwords_kr <- c("이", "그", "것", "수", "있", "하", "되", "때", "년", "간", "말", "함", "및", "대한", "우리", "속")
word_freq_filtered <- word_freq_kr %>%
  filter(!Word %in% stopwords_kr) %>%
  filter(str_length(Word) > 1) %>%
  head(20)

print(word_freq_filtered)

# 워드클라우드 생성
# wordcloud(words = word_freq_filtered$Word,
#           freq = word_freq_filtered$Frequency,
#           min.freq = 1,
#           max.words = 20,
#           random.order = FALSE,
#           colors = brewer.pal(8, "Dark2"))
