import requests

with open('./resources/trivia.txt', encoding='utf-8') as file:
    data = file.readlines()

for line in data:
    
    if line == '\n':
        continue
    
    if line[0] == '*':
        line = line[1:]
    
    question = line[:line.find('?') + 1].strip()
    
    answerIndex = max(line.lower().find('answer '), line.lower().find('answer:') + 8, line.lower().find('answers:') + 9)       
    answer = line[answerIndex : line.find(';')].strip()
    
    options = line[line.lower().find('other:') + 6:]
    optionsParse = [x.strip() for x in options.split(',')]
    optionsParse.append(answer)
  
    d = {"question": question, "answer": answer, "options": optionsParse}
    
    if len(optionsParse) == 4:
        requests.post('http://localhost:5000/trivia/solo/add', json=d)