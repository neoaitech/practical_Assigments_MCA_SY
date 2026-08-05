document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName") || "Student";

    const studentWelcome = document.getElementById("studentWelcome");
    const attendanceTable = document.getElementById("studentAttendanceTable");
    const totalClasses = document.getElementById("cardTotalClasses");
    const presentCount = document.getElementById("cardPresentCount");
    const absentCount = document.getElementById("cardAbsentCount");
    const attendancePercentage = document.getElementById("cardAttendancePercentage");

    if (!token || !userId) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    if (studentWelcome) {
        studentWelcome.innerText = `Welcome, ${userName}`;
    }

    const showErrorRow = (message) => {
        if (attendanceTable) {
            attendanceTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center; padding:24px; color:#b91c1c;">
                        ${message}
                    </td>
                </tr>
            `;
        }
    };

    try {
        const response = await fetch("http://localhost:5000/api/attendance", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            showErrorRow(data.message || "Unable to load your attendance.");
            return;
        }

        const records = (data.attendance || []).filter(record => {
            if (!record.student) return false;
            return record.student._id === userId || record.student === userId;
        });

        const present = records.filter(r => r.status === "Present").length;
        const absent = records.filter(r => r.status === "Absent").length;
        const leave = records.filter(r => r.status === "Leave").length;
        const total = records.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        if (totalClasses) totalClasses.innerText = total;
        if (presentCount) presentCount.innerText = present;
        if (absentCount) absentCount.innerText = absent;
        if (attendancePercentage) attendancePercentage.innerText = `${percentage}%`;

        if (attendanceTable) {
            if (records.length === 0) {
                showErrorRow("No attendance records found for this student.");
                return;
            }

            attendanceTable.innerHTML = records.map(record => `
                <tr>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>${record.subject || "N/A"}</td>
                    <td>${record.status}</td>
                </tr>
            `).join("");
        }
    } catch (error) {
        console.error(error);
        showErrorRow("Failed to load attendance. Check your connection.");
    }
});
