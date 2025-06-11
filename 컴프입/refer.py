import re

def string_input():
    string = ""
    while True:
        try:
            row = input().strip()
            string+=row
        except:
            break
    return string

def isnum(L):
    for item in L:
        try:
            float(item)
            return True
        except ValueError:
            return False

def find_num_inbracket(S):
    inbracket = re.findall(r'\[([^\[\]])+\]', S)
    result = []
    for items in inbracket:
        for item in items:
            if isnum(item) == True:
                result.append(item)
    return(result)

Mstring ="""간혹 그 안에 공백 문자가 들어갈 수도 있지만 숫자[3], 그리고 특별한 기호인 이렇게중간에 들어간 숫자 23은 참고문헌이 아니다comma, 공백외에는 허용되지 않는다 [4,5,10]. [주의사항] 가장 흔한 실수는 참고문헌에 기록된자료를 본문에서 한번도 언급하지 않는 것과 없는참고문헌의 번호[7,12,2]를 표시하는 것이다.여러분은 보고서를 분석해서[1,3,15,5]참고문헌 오류(없는 경우, 번호가 초과하는 경우)를 찾아그것을 출력해야 한다.[8,12]
"""

count = int(input())

nums = find_num_inbracket(Mstring)
print(nums)
