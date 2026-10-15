const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    semester: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);