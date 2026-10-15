// ==========================================
// Attendance Management System
// dashboard.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // Check Login Session
    // -----------------------------
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    // -----------------------------
    // User Details
    // -----------------------------
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    // Welcome Message
    const welcome = document.getElementById("welcomeUser");

    if (welcome) {
        welcome.innerHTML = `
            Welcome,
            <strong>${role.toUpperCase()}</strong><br>
            <small>${email}</small>
        `;
    }

    // -----------------------------
    // Logout
    // -----------------------------
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            if (confirm("Are you sure you want to logout?")) {

                localStorage.removeItem("loggedIn");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userEmail");

                window.location.href = "login.html";
            }

        });

    }

    // -----------------------------
    // Attendance Counter
    // -----------------------------
    const attendanceValue = document.getElementById("attendanceValue");

    if (attendanceValue) {

        let count = 0;
        const target = 95;

        const interval = setInterval(() => {

            count++;

            attendanceValue.innerHTML = count + "%";

            if (count >= target)
                clearInterval(interval);

        }, 20);

    }

    // -----------------------------
    // Live Date & Time
    // -----------------------------
    const clock = document.getElementById("liveClock");

    if (clock) {

        setInterval(() => {

            const now = new Date();

            clock.innerHTML =
                now.toLocaleDateString() +
                " | " +
                now.toLocaleTimeString();

        }, 1000);

    }

    // -----------------------------
    // Attendance Table
    // -----------------------------
    const attendanceTable = document.getElementById("attendanceTable");

    if (attendanceTable) {

        const students = [

            {
                id: 1,
                name: "Rahul Sharma",
                course: "MCA",
                attendance: "Present"
            },

            {
                id: 2,
                name: "Priya Patil",
                course: "MCA",
                attendance: "Absent"
            },

            {
                id: 3,
                name: "Rohan Bhegade",
                course: "MCA",
                attendance: "Present"
            },

            {
                id: 4,
                name: "Sneha Joshi",
                course: "MCA",
                attendance: "Present"
            }

        ];

        students.forEach(student => {

            const row = attendanceTable.insertRow();

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.attendance}</td>
            `;

        });

    }

    // -----------------------------
    // Report Search
    // -----------------------------
    const search = document.getElementById("searchStudent");

    if (search) {

        search.addEventListener("keyup", function () {

            const filter = this.value.toLowerCase();

            const rows = document.querySelectorAll("#attendanceTable tr");

            rows.forEach((row, index) => {

                if (index === 0) return;

                const text = row.innerText.toLowerCase();

                row.style.display =
                    text.includes(filter)
                        ? ""
                        : "none";

            });

        });

    }

    // -----------------------------
    // Dashboard Statistics
    // -----------------------------
    const totalStudents = document.getElementById("totalStudents");
    const totalTeachers = document.getElementById("totalTeachers");
    const totalClasses = document.getElementById("totalClasses");

    if (totalStudents)
        totalStudents.innerHTML = "520";

    if (totalTeachers)
        totalTeachers.innerHTML = "42";

    if (totalClasses)
        totalClasses.innerHTML = "18";

});