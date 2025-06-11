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
    inbracket = re.findall(r'\[[^\[\]]+\]', S)
    result = []
    for items in inbracket:
        if isnum(items) == True:
            for item in items:
                result.append(item)
    return(result)


count = int(input())
Mstring = string_input()
nums = find_num_inbracket(Mstring)
print(nums)
