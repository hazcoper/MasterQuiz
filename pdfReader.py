import fitz
import os

CURRENT_PAGE = 30
myText = ""
tempText = ""

# class Queue():
#     def __init__(self):
        

def changePage(document):
    global CURRENT_PAGE

    CURRENT_PAGE = (CURRENT_PAGE + 1)%document.pageCount
    tempText = document.loadPage(CURRENT_PAGE).getText("text").split("\n")[2:]     #remove the first two lines  
    myText = "" 
    for line in tempText:
        myText += line + "\n"
    
    return myText



pdf = [file for file in os.listdir() if file.split(".")[-1] == "pdf"][0]
# Open the pdf document
doc = fitz.open(pdf)
myText = changePage(doc)
myText = myText.split("\n")

nLine = 0
print(len(myText))
for counter in range(46):    #vou ler 500 linhas

    if nLine + 4 >= len(myText):
        # temos um problema porque eu vou ter que ir buscar outra linha
        maxNumber = len(myText) - nLine   #isto e quanto e que eu ainda posso escrever
        #vou imprimir as que posso
        for random in range(maxNumber):
            print(myText[nLine + random])
            
        # vou buscar uma nova pagina
        myText = changePage(doc).split("\n")
        for random in range(4-maxNumber):  #imprimir as que faltam
            print(myText[random])
        nLine = 4-maxNumber
    else:
        print()
        print(nLine)
        print(myText[nLine])
        print(myText[nLine+1])
        print(myText[nLine+2])
        print(myText[nLine+3])
        print()
        nLine += 4
    

# for phrase in myText:
#     print(phrase)