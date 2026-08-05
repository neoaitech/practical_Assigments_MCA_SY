const token = localStorage.getItem("token");

async function loadSubjects() {

    const response = await fetch("http://localhost:5000/api/subjects", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await response.json();
    const subjectSelect = document.getElementById("subjectSelect");

    subjectSelect.innerHTML = "";

    data.subjects.forEach(subject => {
        subjectSelect.innerHTML +=
            `<option value="${subject._id}">${subject.name}</option>`;
    });
}

async function loadStudents() {

    const response = await fetch("http://localhost:5000/api/students", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await response.json();
    const tableBody = document.getElementById("attendanceTableBody");

    if (!tableBody) return;
    tableBody.innerHTML = "";

    data.students.forEach(student => {
        tableBody.innerHTML += `
            <tr data-id="${student._id}">
                <td>${student.name}</td>
                <td>
                    <select class="status">
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Leave</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

loadSubjects();
loadStudents();

document.getElementById("saveAttendance").addEventListener("click", saveAttendance);

async function saveAttendance() {
    const subject = document.getElementById("subjectSelect").value;
    const date = document.getElementById("attendanceDate").value;
    const rows = document.querySelectorAll("#attendanceTableBody tr");

    const attendance = [];
    for (const row of rows) {
        const student = row.dataset.id;
        const status = row.querySelector(".status").value;
        attendance.push({
            student,
            subject,
            status,
            date
        });
    }

    try {
        const response = await fetch("http://localhost:5000/api/attendance/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                attendance,
                subject,
                date
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Failed to save attendance.");
            return;
        }

        alert("Attendance Saved Successfully");
    } catch (error) {
        console.error(error);
        alert("Failed to save attendance.");
    }
}