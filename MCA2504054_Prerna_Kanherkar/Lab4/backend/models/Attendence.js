const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    studentId: String,
    status: String,
    date: Date
});

module.exports = mongoose.model("Attendance", AttendanceSchema);