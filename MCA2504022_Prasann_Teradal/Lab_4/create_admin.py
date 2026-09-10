from pymongo import MongoClient
from werkzeug.security import generate_password_hash

client = MongoClient("mongodb://localhost:27017")

db = client["attendance_db"]

users = db["users"]

if users.find_one({"username": "admin"}) is None:

    users.insert_one({

        "username": "ashwini",

        "password": generate_password_hash("ashwini123"),

        "role": "admin"

    })

    print("Admin Created")

else:

    print("Admin Already Exists")