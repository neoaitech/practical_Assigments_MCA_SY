from pymongo import MongoClient
import os

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"
)

client = MongoClient(MONGO_URI)

db = client["attendance_db"]

students = db["students"]
teachers = db["teachers"]
users = db["users"]
attendance = db["attendance"]
leave_requests = db["leave_requests"]