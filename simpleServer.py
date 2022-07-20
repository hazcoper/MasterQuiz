
import asyncio
import websockets



async def echo(websocket, path):
    async for message in websocket:
        print(f"This is the received message: {message}")
        name = await websocket.send(message)
        print("message has been sent back to the client")


asyncio.get_event_loop().run_until_complete(websockets.serve(echo, 'localhost', 8765))
asyncio.get_event_loop().run_forever()
