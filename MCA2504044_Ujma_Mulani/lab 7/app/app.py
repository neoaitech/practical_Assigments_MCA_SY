from flask import Flask
import redis

app = Flask(__name__)

r = redis.Redis(host='redis-server', port=6379, decode_responses=True)

@app.route('/')
def hello():
    count = r.incr('hits')
    return f'Hello! This page has been viewed {count} times.\n'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)