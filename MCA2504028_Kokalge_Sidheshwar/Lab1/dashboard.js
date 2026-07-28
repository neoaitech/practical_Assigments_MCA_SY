// Logged-in student
const student = JSON.parse(localStorage.getItem("student"));

// Redirect if not logged in
if (!student) {
    window.location.href = "login.html";
}

// Display student information
document.getElementById("name").textContent = student.name;
document.getElementById("roll").textContent = student.rollNo;
document.getElementById("email").textContent = student.email;
document.getElementById("course").textContent = student.course;
document.getElementById("studentCourse").textContent = student.course;

// Greeting
const hour = new Date().getHours();
let greeting = "";

if (hour < 12) {
    greeting = "🌅 Good Morning";
} else if (hour < 17) {
    greeting = "☀️ Good Afternoon";
} else {
    greeting = "🌙 Good Evening";
}

document.getElementById(
    "greeting"
).innerHTML = `${greeting}, ${student.name}! 👋`;

// Store all students
let allStudents = [];

// Load students from backend
async function loadStudents() {

    try {

        const res = await axios.get(
            "http://localhost:5000/api/students"
        );

        allStudents = res.data.students;

        document.getElementById("totalStudents").textContent =
            allStudents.length;

        displayStudents(allStudents);

    } catch (err) {

        console.log(err);

    }

}

// Display students in table
function displayStudents(students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.rollNo}</td>
                <td>${student.course}</td>
                <td>${student.email}</td>
            </tr>
        `;

    });

}

// Search
document.getElementById("search").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(keyword) ||
        student.rollNo.toLowerCase().includes(keyword) ||
        student.course.toLowerCase().includes(keyword)
    );

    displayStudents(filtered);

});

// Logout
function logout() {

    localStorage.removeItem("student");

    window.location.href = "login.html";

}

// Load data
loadStudents();