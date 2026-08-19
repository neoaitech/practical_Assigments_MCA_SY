// ======================================
// Attendance Management System
// script.js - Part 1
// ======================================

// Backend API URL
const API = "http://localhost:5000";

// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const role = document.getElementById("role").value;

        const username = document.getElementById("username").value.trim();

        const password = document.getElementById("password").value.trim();

        if (!username || !password) {

            alert("Please enter username and password.");

            return;

        }

        if (role === "admin") {

            window.location.href = "admin.html";

        }

        else if (role === "teacher") {

            window.location.href = "teacher.html";

        }

        else if (role === "student") {

            window.location.href = "student.html";

        }

        else {

            alert("Please select a role.");

        }

    });

}

// ======================================
// ADD STUDENT
// ======================================

const studentForm = document.getElementById("studentForm");

if (studentForm) {

    studentForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const student = {

            name: document.getElementById("studentName").value,

            rollNo: document.getElementById("rollNo").value,

            department: document.getElementById("department").value,

            semester: document.getElementById("semester").value

        };

        try {

            const response = await fetch(`${API}/students`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(student)

            });

            const data = await response.json();

            alert("Student Added Successfully");

            studentForm.reset();

            loadStudents();

        }

        catch (err) {

            console.error(err);

            alert("Unable to add student.");

        }

    });

}

// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents() {

    const table = document.getElementById("studentTable");

    if (!table) return;

    table.innerHTML = "";

    try {

        const response = await fetch(`${API}/students`);

        const students = await response.json();

        document.getElementById("studentCount").textContent = students.length;

        students.forEach(student => {

            table.innerHTML += `

            <tr>

                <td>${student.name}</td>

                <td>${student.rollNo}</td>

                <td>${student.department}</td>

                <td>${student.semester}</td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}

loadStudents();
// ======================================
// ADD TEACHER
// ======================================

const teacherForm = document.getElementById("teacherForm");

if (teacherForm) {

    teacherForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const teacher = {

            name: document.getElementById("teacherName").value,

            email: document.getElementById("teacherEmail").value,

            subject: document.getElementById("teacherSubject").value

        };

        try {

            const response = await fetch(`${API}/teachers`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(teacher)

            });

            if (!response.ok) {

                throw new Error("Failed to add teacher");

            }

            alert("Teacher Added Successfully");

            teacherForm.reset();

            loadTeachers();

        }

        catch (err) {

            console.error(err);

            alert("Unable to add teacher.");

        }

    });

}

// ======================================
// LOAD TEACHERS
// ======================================

async function loadTeachers() {

    const table = document.getElementById("teacherTable");

    if (!table) return;

    table.innerHTML = "";

    try {

        const response = await fetch(`${API}/teachers`);

        const teachers = await response.json();

        const count = document.getElementById("teacherCount");

        if (count) {

            count.textContent = teachers.length;

        }

        teachers.forEach((teacher) => {

            table.innerHTML += `

                <tr>

                    <td>${teacher.name}</td>

                    <td>${teacher.email}</td>

                    <td>${teacher.subject}</td>

                </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

loadTeachers();

// ======================================
// LOAD STUDENTS IN TEACHER DASHBOARD
// ======================================

async function loadTeacherStudents() {

    const table = document.getElementById("teacherStudentTable");

    if (!table) return;

    table.innerHTML = "";

    try {

        const response = await fetch(`${API}/students`);

        const students = await response.json();

        const totalStudents = document.getElementById("totalStudents");

        if (totalStudents) {

            totalStudents.textContent = students.length;

        }

        students.forEach(student => {

            table.innerHTML += `

                <tr>

                    <td>${student.name}</td>

                    <td>${student.rollNo}</td>

                    <td>${student.department}</td>

                    <td>${student.semester}</td>

                </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

loadTeacherStudents();
// ======================================
// ATTENDANCE MODULE
// ======================================

const attendanceForm = document.getElementById("attendanceForm");

if (attendanceForm) {

    attendanceForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        // Support both teacher.html and attendance.html IDs
        const studentName =
            document.getElementById("studentAttendanceName")?.value ||
            document.getElementById("studentName")?.value;

        const subject =
            document.getElementById("attendanceSubject")?.value ||
            document.getElementById("subject")?.value;

        const date =
            document.getElementById("attendanceDate")?.value ||
            document.getElementById("date")?.value;

        const status =
            document.getElementById("attendanceStatus")?.value ||
            document.getElementById("status")?.value;

        const attendance = {

            studentName,
            subject,
            date,
            status

        };

        try {

            const response = await fetch(`${API}/attendance`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(attendance)

            });

            if (!response.ok) {

                throw new Error("Failed to save attendance");

            }

            alert("Attendance Saved Successfully");

            attendanceForm.reset();

            loadAttendance();

        }

        catch (err) {

            console.error(err);

            alert("Unable to save attendance.");

        }

    });

}

// ======================================
// LOAD ATTENDANCE
// ======================================

async function loadAttendance() {

    const teacherTable = document.getElementById("attendanceTable");
    const adminTable = document.getElementById("attendanceBody");

    if (teacherTable) teacherTable.innerHTML = "";
    if (adminTable) adminTable.innerHTML = "";

    try {

        const response = await fetch(`${API}/attendance`);

        const records = await response.json();

        let present = 0;
        let absent = 0;

        records.forEach(record => {

            if (record.status === "Present") {

                present++;

            } else {

                absent++;

            }

            const row = `

                <tr>

                    <td>${record.studentName}</td>

                    <td>${record.subject}</td>

                    <td>${new Date(record.date).toLocaleDateString()}</td>

                    <td class="${record.status === "Present" ? "present" : "absent"}">

                        ${record.status}

                    </td>

                </tr>

            `;

            if (teacherTable) {

                teacherTable.innerHTML += row;

            }

            if (adminTable) {

                adminTable.innerHTML += row;

            }

        });

        // Teacher Dashboard Card
        const todayAttendance = document.getElementById("todayAttendance");

        if (todayAttendance) {

            todayAttendance.textContent = present;

        }

        // Attendance Page Cards
        const total = present + absent;

        if (document.getElementById("totalStudentAttendance"))
            document.getElementById("totalStudentAttendance").textContent = total;

        if (document.getElementById("presentStudents"))
            document.getElementById("presentStudents").textContent = present;

        if (document.getElementById("absentStudents"))
            document.getElementById("absentStudents").textContent = absent;

        if (document.getElementById("todayPercentage")) {

            const percent = total === 0
                ? 0
                : ((present / total) * 100).toFixed(1);

            document.getElementById("todayPercentage").textContent =
                percent + "%";

        }

    }

    catch (err) {

        console.error(err);

    }

}

loadAttendance();
// ======================================
// STUDENT DASHBOARD
// ======================================

async function loadStudentDashboard() {

    const attendanceTable = document.getElementById("studentAttendanceTable");

    if (!attendanceTable) return;

    attendanceTable.innerHTML = "";

    try {

        const response = await fetch(`${API}/attendance`);

        const records = await response.json();

        let present = 0;
        let absent = 0;

        const subjectSummary = {};

        records.forEach(record => {

            attendanceTable.innerHTML += `

                <tr>

                    <td>${new Date(record.date).toLocaleDateString()}</td>

                    <td>${record.subject}</td>

                    <td class="${record.status === "Present" ? "present" : "absent"}">

                        ${record.status}

                    </td>

                </tr>

            `;

            if (record.status === "Present") {

                present++;

            } else {

                absent++;

            }

            if (!subjectSummary[record.subject]) {

                subjectSummary[record.subject] = {
                    present: 0,
                    absent: 0
                };

            }

            if (record.status === "Present") {

                subjectSummary[record.subject].present++;

            } else {

                subjectSummary[record.subject].absent++;

            }

        });

        const total = present + absent;

        const percentage = total === 0
            ? 0
            : ((present / total) * 100).toFixed(1);

        if (document.getElementById("attendancePercentage"))
            document.getElementById("attendancePercentage").textContent = percentage + "%";

        if (document.getElementById("classesAttended"))
            document.getElementById("classesAttended").textContent = present;

    }

    catch (err) {

        console.error(err);

    }

}

loadStudentDashboard();

// ======================================
// REPORT PAGE
// ======================================

async function loadReport() {

    const reportTable = document.getElementById("reportTable");

    if (!reportTable) return;

    reportTable.innerHTML = "";

    try {

        const studentResponse = await fetch(`${API}/students`);

        const students = await studentResponse.json();

        const attendanceResponse = await fetch(`${API}/attendance`);

        const attendance = await attendanceResponse.json();

        let totalPresent = 0;
        let totalAbsent = 0;

        students.forEach(student => {

            const records = attendance.filter(a =>
                a.studentName === student.name
            );

            const present = records.filter(r =>
                r.status === "Present"
            ).length;

            const absent = records.filter(r =>
                r.status === "Absent"
            ).length;

            totalPresent += present;
            totalAbsent += absent;

            const total = present + absent;

            const percent = total === 0
                ? 0
                : ((present / total) * 100).toFixed(1);

            reportTable.innerHTML += `

                <tr>

                    <td>${student.rollNo}</td>

                    <td>${student.name}</td>

                    <td>${student.department}</td>

                    <td>${present}</td>

                    <td>${absent}</td>

                    <td>${percent}%</td>

                </tr>

            `;

        });

        if (document.getElementById("totalStudentsReport"))
            document.getElementById("totalStudentsReport").textContent = students.length;

        if (document.getElementById("presentCount"))
            document.getElementById("presentCount").textContent = totalPresent;

        if (document.getElementById("absentCount"))
            document.getElementById("absentCount").textContent = totalAbsent;

        const overall = totalPresent + totalAbsent;

        const overallPercent = overall === 0
            ? 0
            : ((totalPresent / overall) * 100).toFixed(1);

        if (document.getElementById("overallPercentage"))
            document.getElementById("overallPercentage").textContent =
                overallPercent + "%";

    }

    catch (err) {

        console.error(err);

    }

}

loadReport();

// ======================================
// PRINT REPORT
// ======================================

const printButton = document.getElementById("downloadPdf");

if (printButton) {

    printButton.addEventListener("click", () => {

        window.print();

    });

}
// ======================================
// LOGOUT FUNCTION
// ======================================

function logout(){

    localStorage.clear();

    sessionStorage.clear();

    window.location.href = "index.html";

}


// ======================================
// AUTO UPDATE DATE
// ======================================

const dateInputs = document.querySelectorAll('input[type="date"]');

dateInputs.forEach(input => {

    if(!input.value){

        const today = new Date();

        const formattedDate =
            today.toISOString().split("T")[0];

        input.value = formattedDate;

    }

});


// ======================================
// SEARCH FUNCTION
// ======================================

function searchTable(inputId, tableId){

    const input =
        document.getElementById(inputId);

    const table =
        document.getElementById(tableId);

    if(!input || !table)
        return;


    input.addEventListener("keyup", function(){

        const value =
            input.value.toLowerCase();


        const rows =
            table.getElementsByTagName("tr");


        for(let i = 0; i < rows.length; i++){

            const text =
                rows[i].innerText.toLowerCase();


            if(text.includes(value)){

                rows[i].style.display = "";

            }

            else{

                rows[i].style.display = "none";

            }

        }

    });

}


// ======================================
// SUCCESS MESSAGE
// ======================================

function showMessage(message,type="success"){

    const div =
        document.createElement("div");


    div.className =
        type === "success"
        ? "alert alert-success"
        : "alert alert-danger";


    div.innerHTML = message;


    document.body.prepend(div);


    setTimeout(()=>{

        div.remove();

    },3000);

}


// ======================================
// CHECK SERVER CONNECTION
// ======================================

async function checkServer(){

    try{

        const response =
            await fetch(API);


        if(response.ok){

            console.log(
                "Backend Connected Successfully"
            );

        }

    }

    catch(error){

        console.log(
            "Backend Server Not Running"
        );

    }

}


checkServer();


// ======================================
// PROTECT EMPTY API ERRORS
// ======================================

async function apiRequest(url,options={}){

    try{

        const response =
            await fetch(url,options);


        const data =
            await response.json();


        return data;

    }

    catch(error){

        console.error(
            "API Error:",
            error
        );


        showMessage(
            "Server connection failed",
            "error"
        );


        return null;

    }

}


// ======================================
// PAGE LOAD MESSAGE
// ======================================

window.addEventListener(
"load",
()=>{

    console.log(
        "Attendance Management System Loaded"
    );

});