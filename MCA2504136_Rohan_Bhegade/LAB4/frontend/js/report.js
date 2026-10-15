document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const printReportBtn = document.getElementById("printReportBtn");

    const exportRows = [];

    const downloadPdf = () => {
        const printWindow = window.open("", "", "width=900,height=700");
        if (!printWindow) {
            alert("Please allow pop-ups to download the report.");
            return;
        }

        const rowsHtml = exportRows.length
            ? exportRows.map(row => `<tr><td>${row.roll}</td><td>${row.name}</td><td>${row.total}</td><td>${row.present}</td><td>${row.absent}</td><td>${row.percent}</td></tr>`).join("")
            : "<tr><td colspan='6'>No data available</td></tr>";

        printWindow.document.write(`
            <html>
                <head>
                    <title>Attendance Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        h2 { margin-bottom: 16px; }
                    </style>
                </head>
                <body>
                    <h2>Attendance Report</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Total Classes</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Attendance %</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const exportExcel = () => {
        const headers = ["Roll No", "Student Name", "Total Classes", "Present", "Absent", "Attendance %"];
        const rows = exportRows.map(row => [row.roll, row.name, row.total, row.present, row.absent, row.percent]);
        const csvContent = [headers, ...rows]
            .map(columns => columns.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "attendance-report.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener("click", downloadPdf);
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener("click", exportExcel);
    }

    if (printReportBtn) {
        printReportBtn.addEventListener("click", () => window.print());
    }

    const cardTotalStudents = document.getElementById("cardTotalStudents");
    const cardPresentToday = document.getElementById("cardPresentToday");
    const cardAbsentToday = document.getElementById("cardAbsentToday");
    const cardAttendanceRate = document.getElementById("cardAttendanceRate");
    const reportTableBody = document.getElementById("reportTable");

    if (!token || !reportTableBody) {
        return;
    }

    const showFallback = (message) => {
        reportTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:24px; color:#b91c1c;">
                    ${message}
                </td>
            </tr>
        `;
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
            showFallback(data.message || "Unable to load attendance report.");
            return;
        }

        const records = data.attendance || [];
        const students = {};
        const today = new Date().toISOString().split("T")[0];
        let presentToday = 0;
        let absentToday = 0;

        records.forEach(record => {
            const studentId = record.student?._id || record.student;
            const studentName = record.student?.name || record.student?.fullName || "Unknown";
            const key = studentId || studentName;

            if (!students[key]) {
                students[key] = {
                    name: studentName,
                    totalClasses: 0,
                    present: 0,
                    absent: 0,
                    leave: 0
                };
            }

            students[key].totalClasses += 1;

            if (record.status === "Present") {
                students[key].present += 1;
            } else if (record.status === "Absent") {
                students[key].absent += 1;
            } else if (record.status === "Leave") {
                students[key].leave += 1;
            }

            const recordDate = new Date(record.date).toISOString().split("T")[0];
            if (recordDate === today) {
                if (record.status === "Present") presentToday += 1;
                if (record.status === "Absent") absentToday += 1;
            }
        });

        const studentList = Object.values(students);
        const totalStudents = studentList.length;

        const totalPresentRecords = studentList.reduce((sum, student) => sum + student.present, 0);
        const totalRecords = studentList.reduce((sum, student) => sum + student.totalClasses, 0);
        const attendanceRate = totalRecords > 0 ? Math.round((totalPresentRecords / totalRecords) * 100) : 0;

        if (cardTotalStudents) cardTotalStudents.innerText = totalStudents;
        if (cardPresentToday) cardPresentToday.innerText = presentToday;
        if (cardAbsentToday) cardAbsentToday.innerText = absentToday;
        if (cardAttendanceRate) cardAttendanceRate.innerText = `${attendanceRate}%`;

        if (studentList.length === 0) {
            showFallback("No attendance records found.");
            return;
        }

        reportTableBody.innerHTML = studentList.map((student, index) => {
            const attendancePercent = student.totalClasses ? Math.round((student.present / student.totalClasses) * 100) : 0;
            const percentClass = attendancePercent >= 90 ? "present" : attendancePercent >= 75 ? "present" : "absent";

            exportRows.push({
                roll: index + 1,
                name: student.name,
                total: student.totalClasses,
                present: student.present,
                absent: student.absent,
                percent: `${attendancePercent}%`
            });

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.totalClasses}</td>
                    <td>${student.present}</td>
                    <td>${student.absent}</td>
                    <td class="${percentClass}">${attendancePercent}%</td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        showFallback("Failed to load attendance report. Check server connection.");
        console.error(error);
    }
});
