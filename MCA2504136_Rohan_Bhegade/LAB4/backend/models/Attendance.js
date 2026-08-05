const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        roll: {
            type: Number
        },
        name: {
            type: String
        },
        className: {
            type: String
        },
        subject: {
            type: String
        },
        date: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Leave"]
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);