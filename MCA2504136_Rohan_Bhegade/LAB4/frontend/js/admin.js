const token = localStorage.getItem("token");

async function loadDashboard() {

    const response = await fetch("http://localhost:5000/api/dashboard", {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    const data = await response.json();

    document.getElementById("totalStudents").innerText = data.totalStudents;

    document.getElementById("totalTeachers").innerText = data.totalTeachers;

    document.getElementById("totalClasses").innerText = data.totalSubjects;

    document.getElementById("attendanceValue").innerText =
        data.totalAttendance;

    const tbody = document.getElementById("recentAttendance");

    tbody.innerHTML = "";

    data.recentAttendance.forEach(record => {

        tbody.innerHTML += `

        <tr>

            <td>${record.student.name}</td>

            <td>${record.subject.name}</td>

            <td>${record.status}</td>

        </tr>

        `;

    });

}

loadDashboard();