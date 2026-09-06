from flask import Flask, render_template, request, redirect
from pymongo import MongoClient
import os

app = Flask(__name__)

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/"
)

client = MongoClient(MONGO_URI)

db = client["college_event_db"]
registrations = db["registrations"]


@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        phone = request.form["phone"]
        college = request.form["college"]
        event = request.form["event"]

        registrations.insert_one({
            "name": name,
            "email": email,
            "phone": phone,
            "college": college,
            "event": event
        })

        return redirect("/")

    data = list(registrations.find())

    return render_template(
        "index.html",
        registrations=data
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )