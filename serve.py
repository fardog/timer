import os
import SimpleHTTPServer
import SocketServer

PORT = 8000
os.chdir("app/")

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
