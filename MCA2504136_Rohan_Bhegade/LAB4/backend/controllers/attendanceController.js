const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
    try {
        const payload = req.body;
        const attendanceData = Array.isArray(payload?.attendance)
            ? payload.attendance
            : Array.isArray(payload)
                ? payload
                : payload && typeof payload === "object" && (payload.student || payload.roll)
                    ? [payload]
                    : null;

        if (!attendanceData || attendanceData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No attendance data received."
            });
        }

        const normalizedRecords = attendanceData.map(record => ({
            roll: record.roll ?? null,
            name: record.name ?? null,
            className: payload?.className || record.className || null,
            subject: payload?.subject || record.subject || null,
            date: payload?.date || record.date || null,
            status: record.status || null,
            markedBy: req.user?.id || record.markedBy || null
        })).filter(record => record.status && record.date);

        if (normalizedRecords.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance data received."
            });
        }

        const saved = await Attendance.insertMany(normalizedRecords);

        res.status(201).json({
            success: true,
            message: "Attendance saved successfully!",
            attendance: saved
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("student", "name email role")
            .populate("markedBy", "name");

        res.json({
            success: true,
            attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};