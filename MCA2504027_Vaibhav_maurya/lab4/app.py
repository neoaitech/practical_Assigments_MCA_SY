from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <h1>Online Attendance Management System</h1>

    <h3>Modules</h3>

    <ul>

    <li>Admin</li>

    <li>Teacher</li>

    <li>Student</li>

    </ul>
    """

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5000)