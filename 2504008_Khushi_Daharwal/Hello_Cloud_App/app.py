from flask import Flask, jsonify

app = Flask(__name__)

APP_VERSION = "v3"

@app.get("/")
def home():
    return jsonify(
        app="Hello Cloud App",
        version=APP_VERSION,
        message="Version three is running"
    )

@app.get("/health")
def health():
    return jsonify(status="healthy")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)