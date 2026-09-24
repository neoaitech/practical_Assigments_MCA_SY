import os
from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
from pymongo.errors import PyMongoError

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "college-event-secret")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB", "college_event_db")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
registrations = db["registrations"]

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/register", methods=["POST"])
def register():
    data = {
        "full_name": request.form.get("full_name", "").strip(),
        "email": request.form.get("email", "").strip().lower(),
        "phone": request.form.get("phone", "").strip(),
        "college": request.form.get("college", "").strip(),
        "course": request.form.get("course", "").strip(),
        "year": request.form.get("year", "").strip(),
        "event": request.form.get("event", "").strip(),
        "created_at": __import__("datetime").datetime.utcnow()
    }

    required = ["full_name", "email", "phone", "college", "course", "year", "event"]
    if not all(data[field] for field in required):
        flash("Please fill in all required fields.", "danger")
        return redirect(url_for("index"))

    try:
        registrations.insert_one(data)
        flash("Registration successful! Your details were saved in MongoDB.", "success")
    except PyMongoError:
        flash("Could not save registration. Please check the database connection.", "danger")

    return redirect(url_for("index"))

@app.route("/registrations", methods=["GET"])
def all_registrations():
    rows = list(registrations.find({}, {"_id": 0}).sort("created_at", -1))
    return render_template("registrations.html", registrations=rows)

@app.route("/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")
        return {"status": "ok", "mongodb": "connected"}, 200
    except Exception:
        return {"status": "error", "mongodb": "not connected"}, 503

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
