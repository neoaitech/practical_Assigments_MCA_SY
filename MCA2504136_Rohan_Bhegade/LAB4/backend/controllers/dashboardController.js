const User = require("../models/User");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalTeachers = await User.countDocuments({ role: "teacher" });
        const totalSubjects = await Subject.countDocuments();
        const totalAttendance = await Attendance.countDocuments();

        const recentAttendance = await Attendance.find()
            .populate("student", "name")
            .populate("subject", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            totalStudents,
            totalTeachers,
            totalSubjects,
            totalAttendance,
            recentAttendance
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};