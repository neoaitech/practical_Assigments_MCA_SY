from flask import Flask, render_template, request, redirect, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime
from database.db import students, teachers, users, attendance, leave_requests

app = Flask(__name__)
app.secret_key = "attendance_secret_key"  # Change this to a random secret key

@app.route("/")
def home():
    return render_template("login.html")

@app.route("/student_dashboard")
def student_dashboard():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "student":
        return "Access Denied"

    username = session["username"]

    student = students.find_one({
        "username": username
    })

    total = attendance.count_documents({
        "username": username
    })

    return render_template(
        "student/dashboard.html",
        student=student,
        total=total
    )

@app.route("/mark_attendance")
def mark_attendance():

    if "role" not in session:
        return redirect("/login")

    username = session["username"]

    today = datetime.now().strftime("%Y-%m-%d")

    already = attendance.find_one({

        "username": username,

        "date": today

    })

    if already:

        flash("Attendance already marked today.", "warning")

        return redirect("/student_dashboard")

    attendance.insert_one({

        "username": username,

        "date": today,

        "status": "Present"

    })

    flash("Attendance marked successfully!", "success")

    return redirect("/student_dashboard")

@app.route("/student_report")
def student_report():

    username=session["username"]

    records=list(attendance.find({

        "username":username

    }))

    total=len(records)

    present=0

    for i in records:

        if i["status"]=="Present":

            present+=1

    percent=0

    if total>0:

        percent=round((present/total)*100,2)

    return render_template(

        "student/report.html",

        attendance=records,

        percentage=percent

    )

@app.route("/student")
def student():
    return render_template("student.html")

@app.route("/add_student", methods=["POST"])
def add_student():

    data = {

        "name": request.form["name"],
        "roll": request.form["roll"],
        "course": request.form["course"],
        "date": request.form["date"],
        "attendance": request.form["attendance"]

    }

    students.insert_one(data)

    return redirect("/student_report")

@app.route("/teacher")
def teacher():
    return render_template("teacher.html")

@app.route("/add_teacher", methods=["POST"])
def add_teacher():

    teacher = {

        "name": request.form["name"],
        "department": request.form["department"],
        "subject": request.form["subject"],
        "date": request.form["date"],
        "attendance": request.form["attendance"],
        "leave": request.form["leave"]

    }

    teachers.insert_one(teacher)

    return redirect("/teacher_report")

@app.route("/teacher_dashboard")
def teacher_dashboard():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "teacher":
        return "Access Denied"

    username = session["username"]

    teacher = teachers.find_one({
        "username": username
    })

    total_attendance = attendance.count_documents({
        "username": username,
        "role": "teacher"
    })

    total_leave = leave_requests.count_documents({
        "username": username
    })

    return render_template(

        "teacher/dashboard.html",

        teacher=teacher,

        total_attendance=total_attendance,

        total_leave=total_leave

    )

@app.route("/teacher_attendance")
def teacher_attendance():

    if "role" not in session:
        return redirect("/login")

    username = session["username"]

    today = datetime.now().strftime("%Y-%m-%d")

    already = attendance.find_one({

        "username": username,

        "date": today,

        "role": "teacher"

    })

    if already:

        flash("Attendance already marked.", "warning")

        return redirect("/teacher_dashboard")

    attendance.insert_one({

        "username": username,

        "date": today,

        "status": "Present",

        "role": "teacher"

    })

    flash("Attendance marked successfully.", "success")

    return redirect("/teacher_dashboard")

@app.route("/apply_leave", methods=["GET", "POST"])
def apply_leave():

    if "role" not in session:
        return redirect("/login")

    if request.method == "POST":

        leave_requests.insert_one({

            "username": session["username"],

            "date": request.form["date"],

            "reason": request.form["reason"],

            "status": "Pending"

        })

        flash("Leave applied successfully.", "success")

        return redirect("/teacher_dashboard")

    return render_template("teacher/apply_leave.html")

@app.route("/teacher_report")
def teacher_report():

    if "role" not in session:
        return redirect("/login")

    username = session["username"]

    attendance_records = list(

        attendance.find({

            "username": username,

            "role": "teacher"

        }).sort("date", -1)

    )

    leave_records = list(

        leave_requests.find({

            "username": username

        }).sort("date", -1)

    )

    return render_template(

        "teacher/report.html",

        attendance=attendance_records,

        leaves=leave_records

    )

@app.route("/admin")
def admin():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    total_students = students.count_documents({})

    total_teachers = teachers.count_documents({})

    total_attendance = (
        students.count_documents({})
        + teachers.count_documents({})
    )

    total_leaves = teachers.count_documents({
        "leave": {"$ne": "None"}
    })

    return render_template(

        "admin/dashboard.html",

        total_students=total_students,

        total_teachers=total_teachers,

        total_attendance=total_attendance,

        total_leaves=total_leaves

    )

@app.route("/teachers")
def teachers_page():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    search = request.args.get("search", "").strip()

    if search:

        teacher_list = list(teachers.find({

            "$or":[

                {"name":{"$regex":search,"$options":"i"}},

                {"department":{"$regex":search,"$options":"i"}},

                {"subject":{"$regex":search,"$options":"i"}},

                {"username":{"$regex":search,"$options":"i"}}

            ]

        }))

    else:

        teacher_list = list(teachers.find())

    total_teachers = teachers.count_documents({})

    return render_template(

        "admin/teachers.html",

        teachers=teacher_list,

        total_teachers=total_teachers,

        search=search

    )

@app.route("/add_teacher_page")
def add_teacher_page():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    return render_template("admin/add_teacher.html")

@app.route("/save_teacher", methods=["POST"])
def save_teacher():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    name = request.form["name"]
    department = request.form["department"]
    subject = request.form["subject"]
    username = request.form["username"]
    password = request.form["password"]

    existing = users.find_one({

        "username": username

    })

    if existing:

        flash("Username already exists.", "danger")

        return redirect("/add_teacher_page")

    users.insert_one({

        "username": username,

        "password": generate_password_hash(password),

        "role": "teacher"

    })

    teachers.insert_one({

        "name": name,

        "department": department,

        "subject": subject,

        "username": username

    })

    flash("Teacher added successfully!", "success")

    return redirect("/teachers")

@app.route("/edit_teacher/<id>")
def edit_teacher(id):

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    teacher = teachers.find_one({

        "_id": ObjectId(id)

    })

    if teacher is None:

        flash("Teacher not found.","danger")

        return redirect("/teachers")

    return render_template(

        "admin/edit_teacher.html",

        teacher=teacher

    )

@app.route("/update_teacher/<id>", methods=["POST"])
def update_teacher(id):

    teacher = teachers.find_one({"_id": ObjectId(id)})

    if teacher is None:

        flash("Teacher not found.","danger")

        return redirect("/teachers")

    name = request.form["name"]
    department = request.form["department"]
    subject = request.form["subject"]
    username = request.form["username"]
    password = request.form["password"]

    teachers.update_one(
        {"_id": ObjectId(id)},
        {
            "$set":{
                "name":name,
                "department":department,
                "subject":subject,
                "username":username,
                "password": generate_password_hash(password) if password.strip() else None
            }
        }
    )
    # Update password only if provided
    if password.strip():
            users.update_one(
                {"username": username},
                {
                    "$set": {
                        "password": generate_password_hash(password)
                    }
                }
            )
    flash("Teacher updated successfully.","success")
    return redirect("/teachers")

@app.route("/delete_teacher/<id>")
def delete_teacher(id):

    teacher = teachers.find_one({

        "_id": ObjectId(id)

    })

    if teacher is None:

        flash("Teacher not found.","danger")

        return redirect("/teachers")

    username = teacher["username"]

    teachers.delete_one({

        "_id": ObjectId(id)

    })

    users.delete_one({

        "username":username

    })

    flash("Teacher deleted successfully.","success")

    return redirect("/teachers")


@app.route("/students")
def students_page():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    search = request.args.get("search", "").strip()

    if search:

        student_list = list(students.find({

            "$or":[

                {"name":{"$regex":search,"$options":"i"}},

                {"roll":{"$regex":search,"$options":"i"}},

                {"username":{"$regex":search,"$options":"i"}}

            ]

        }))

    else:

        student_list = list(students.find())

    total_students = students.count_documents({})

    return render_template(

        "admin/students.html",

        students=student_list,

        total_students=total_students,

        search=search

    )

@app.route("/add_student_page")
def add_student_page():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    return render_template("admin/add_student.html")

@app.route("/save_student", methods=["POST"])
def save_student():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    name = request.form["name"]
    roll = request.form["roll"]
    course = request.form["course"]
    username = request.form["username"]
    password = request.form["password"]

    # Check username already exists
    existing_user = users.find_one({"username": username})

    if existing_user:
        return "Username already exists."

    # Save login account
    users.insert_one({

        "username": username,

        "password": generate_password_hash(password),

        "role": "student"

    })

    # Save student profile
    students.insert_one({

        "name": name,

        "roll": roll,

        "course": course,

        "username": username

    })

    flash("Student added successfully!", "success")
    return redirect("/students")

@app.route("/delete_student/<id>")
def delete_student(id):

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    student = students.find_one({
        "_id": ObjectId(id)
    })

    if not student:
        return "Student not found"

    username = student["username"]

    # Delete student profile
    students.delete_one({
        "_id": ObjectId(id)
    })

    # Delete login account
    users.delete_one({
        "username": username
    })
    flash("Student deleted successfully!", "danger")
    return redirect("/students")

@app.route("/edit_student/<id>")
def edit_student(id):

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    student = students.find_one({
        "_id": ObjectId(id)
    })

    if not student:
        return "Student not found"

    return render_template(
        "admin/edit_student.html",
        student=student
    )

@app.route("/update_student/<id>", methods=["POST"])
def update_student(id):

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    student = students.find_one({
        "_id": ObjectId(id)
    })

    if not student:
        return "Student not found"

    name = request.form["name"]
    roll = request.form["roll"]
    course = request.form["course"]
    username = request.form["username"]
    password = request.form["password"]

    # Update student profile
    students.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "name": name,
                "roll": roll,
                "course": course,
                "username": username,
                "password": generate_password_hash(password) if password.strip() else None
            }
        }
    )

    # Update password only if provided
    if password.strip():

        users.update_one(
            {"username": username},
            {
                "$set": {
                    "password": generate_password_hash(password)
                }
            }
        )

    flash("Student updated successfully!", "info")
    return redirect("/students")

@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():

    username = request.form["username"]
    password = request.form["password"]

    user = users.find_one({
        "username": username
    })

    if user and check_password_hash(user["password"], password):

        session["username"] = username
        session["role"] = user["role"]

        if user["role"] == "admin":
            return redirect("/admin")

        elif user["role"] == "teacher":
            return redirect("/teacher_dashboard")

        else:
            return redirect("/student_dashboard")

    return "Invalid Username or Password"

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/")

@app.route("/admin/students")
def student_list():

    if "role" not in session:
        return redirect("/login")

    if session["role"] != "admin":
        return "Access Denied"

    data = list(students.find())

    return render_template(
        "admin/students.html",
        students=data
    )

@app.route("/student/attendance",methods=["POST"])
def student_attendance():

    username=session["username"]

    today=datetime.now().strftime("%Y-%m-%d")

    already=attendance.find_one({

        "username":username,

        "date":today

    })

    if already:

        return "Attendance Already Submitted Today"

    attendance.insert_one({

        "username":username,

        "date":today,

        "status":request.form["status"]

    })

    return redirect("/student/report")

if __name__ == "__main__":
    app.run(debug=True)