const Attendance = require("../models/Attendance");

exports.getReports = async (req, res) => {

    try {

        const reports = await Attendance.find()
            .populate("student", "name email")
            .populate("subject", "name code");

        res.json({
            success: true,
            reports
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};