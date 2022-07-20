#!/usr/bin/env python

import asyncio
import websockets
import time
import fitz
import os
from datetime import datetime
import signal


def handler(a, b):
    print("Signal Number:", a, " Frame: ", b)  
    print("Saving page")


    with open("mypage", "w") as f:
        f.write(str(CURRENT_PAGE-1))

    exit()

with open("mypage", "r") as f:
    CURRENT_PAGE = int(f.readline())
    print("This is the page where you stopped ", CURRENT_PAGE)
# CURRENT_PAGE = 104


myText = []

def changePage(document):
    global CURRENT_PAGE

    CURRENT_PAGE = (CURRENT_PAGE + 1)%document.pageCount
    tempText = document.loadPage(CURRENT_PAGE).getText("text").split("\n")[2:]     #remove the first two lines  
    print(f"Reached a new page {datetime.now()}")
    # myText = "" 
    # for line in tempText:
    #     myText += line + "\n"
    # print(myText)
    # return document.loadPage(CURRENT_PAGE).getText("text")
    return tempText

def convertLine(line):
    #conver all the spaces from that line to underscores
    newLine = ""
    for value in line:
        if value == " ":
            newLine += "_"
        else:
            newLine += value
    return newLine
    


def getLine(document):
    global myText

    if len(myText) != 0:
        return convertLine(myText.pop(0))
    else:
        #need to ask for a new page before I return the result
        myText = changePage(document)
        return convertLine(myText.pop(0))

signal.signal(signal.SIGINT, handler)  # assign the handler to the signal SIGINT 
pdf = [file for file in os.listdir() if file.split(".")[-1] == "pdf"][0]
# Open the pdf document
doc = fitz.open(pdf)

async def echo(websocket, path):
    async for message in websocket:
        # print(message == "getPage", message)
        # if message == "getPage":
        #     print("-----------------------------")
        #     x = changePage(doc)
        #     print(str(x.split("\n")[2:]))
        #     print(type(x))
        #     print("-----------------------------")
        if message == "getLine":
            name = await websocket.send(getLine(doc))
        if message == "thanks":
            # print("client has received the message")
            pass 
asyncio.get_event_loop().run_until_complete(websockets.serve(echo, '192.168.1.81', 8765))
asyncio.get_event_loop().run_forever()



# tenho sempre de tirar as primeiras duas linhas