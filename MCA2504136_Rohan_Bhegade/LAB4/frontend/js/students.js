const token = localStorage.getItem("token");

const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const submitButton = form.querySelector("button[type=submit]");

form.addEventListener("submit", handleStudentSubmit);

async function handleStudentSubmit(e) {

    e.preventDefault();

    const studentId = studentIdInput.value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const isEdit = Boolean(studentId);
    const url = isEdit ? `http://localhost:5000/api/students/${studentId}` : "http://localhost:5000/api/students";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
        name,
        email
    };

    if (!isEdit) {
        payload.password = password;
    }

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    alert(data.message);

    resetStudentForm();

    loadStudents();
}

function resetStudentForm() {
    studentIdInput.value = "";
    form.reset();
    if (submitButton) {
        submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Student';
    }
}

function editStudent(id) {
    const studentRow = document.querySelector(`button[data-id="${id}"]`)?.closest("tr");
    if (!studentRow) return;

    const cells = studentRow.querySelectorAll("td");
    const name = cells[0]?.innerText.trim();
    const email = cells[1]?.innerText.trim();

    studentIdInput.value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("password").value = "";

    if (submitButton) {
        submitButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Student';
    }
}

async function loadStudents() {

    const response = await fetch("http://localhost:5000/api/students", {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    const data = await response.json();

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    data.students.forEach(student => {

        table.innerHTML += `

            <tr>

                <td>${student.name}</td>

                <td>${student.email}</td>

                <td>
                   <button onclick="editStudent('${student._id}')">Edit</button>
                   <button onclick="deleteStudent('${student._id}')">Delete</button>
                </td>

            </tr>

        `;

    });

}

loadStudents();

async function deleteStudent(id) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`http://localhost:5000/api/students/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: "Bearer " + token
            }

        });

        const data = await response.json();

        alert(data.message);

        loadStudents();

    } catch (err) {

        console.error(err);

        alert("Unable to delete student.");

    }

}

async function loadAttendance() {

    try {

        const response = await fetch("http://localhost:5000/api/attendance", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await response.json();

        // Demo: Student with Roll No. 1
        const studentAttendance = data.attendance ? data.attendance.filter(item => item.roll === 1) : [];

        let present = 0;
        let absent = 0;

        const tbody = document.querySelector("#attendanceTable tbody");
        tbody.innerHTML = "";

        studentAttendance.forEach(record => {

            if (record.status === "Present")
                present++;
            else
                absent++;

            tbody.innerHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.subject}</td>
                    <td>${record.status}</td>
                </tr>
            `;

        });

        const total = present + absent;
        const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

        document.getElementById("presentCount").innerText = present;
        document.getElementById("absentCount").innerText = absent;
        document.getElementById("attendancePercent").innerText = percentage + "%";

    } catch (err) {

        console.error(err);

        alert("Unable to load attendance.");

    }

}

loadAttendance();