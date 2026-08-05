const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add Student
exports.addStudent = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingStudent = await User.findOne({ email });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student"
        });

        res.status(201).json({
            success: true,
            message: "Student Added Successfully",
            student
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Students
exports.getStudents = async (req, res) => {

    try {

        const students = await User.find(
            { role: "student" },
            "-password"
        );

        res.json({
            success: true,
            students
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Student
exports.updateStudent = async (req, res) => {
    try {

        const student = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Student Updated Successfully",
            student
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Delete Student
exports.deleteStudent = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Student Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};