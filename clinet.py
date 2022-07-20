import asyncio
import websockets

async def hello(uri):
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello world!")
        name = await websocket.recv()
        print(name)

asyncio.get_event_loop().run_until_complete(
    hello('ws://localhost:8765'))




# import SocketServer

# class MyTCPHandler(SocketServer.BaseRequestHandler):
#     """
#     The RequestHandler class for our server.

#     It is instantiated once per connection to the server, and must
#     override the handle() method to implement communication to the
#     client.
#     """

#     def handle(self):
#         # self.request is the TCP socket connected to the client
#         self.data = self.request.recv(1024).strip()
#         print("{} wrote:".format(self.client_address[0]))
#         print(self.data)
#         # just send back the same data, but upper-cased
#         self.request.sendall(self.data.upper())

# if __name__ == "__main__":
#     HOST, PORT = "localhost", 9999

#     # Create the server, binding to localhost on port 9999
#     server = SocketServer.TCPServer((HOST, PORT), MyTCPHandler)

#     # Activate the server; this will keep running until you
#     # interrupt the program with Ctrl-C
#     server.serve_forever()