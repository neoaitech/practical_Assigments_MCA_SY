document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("userRole");

    if (loggedIn !== "true" || !token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const dateInput = document.getElementById("date");
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    renderAttendanceRows();
});

const students = [
    { roll: 101, name: "Rahul Sharma" },
    { roll: 102, name: "Priya Patil" },
    { roll: 103, name: "Amit Kumar" },
    { roll: 104, name: "Sneha Gupta" }
];

function renderAttendanceRows() {
    const tbody = document.querySelector("#attendanceTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    students.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <select id="status-${student.roll}">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

async function saveAttendance() {
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true" || !token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const attendance = students.map(student => ({
        roll: student.roll,
        name: student.name,
        className: document.getElementById("class")?.value || "",
        subject: document.getElementById("subject")?.value || "",
        date: document.getElementById("date")?.value || "",
        status: document.getElementById(`status-${student.roll}`)?.value || "Present"
    }));

    try {
        const response = await fetch("http://localhost:5000/api/attendance/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                attendance,
                className: document.getElementById("class")?.value || "",
                subject: document.getElementById("subject")?.value || "",
                date: document.getElementById("date")?.value || ""
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Failed to save attendance.");
            return;
        }

        alert("Attendance saved successfully.");
    } catch (error) {
        console.error(error);
        alert("Failed to save attendance.");
    }
}