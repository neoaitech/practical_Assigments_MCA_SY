from flask import Flask
from redis import Redis
import socket
 
app = Flask(__name__)
redis = Redis(host='redis', port=6379, decode_responses=True)
 
@app.route('/')
def hello():
    count = redis.incr('hits')
    hostname = socket.gethostname()
    return (f'Hello! This page has been viewed {count} times.\n'
            f'Served by container: {hostname}\n')
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

