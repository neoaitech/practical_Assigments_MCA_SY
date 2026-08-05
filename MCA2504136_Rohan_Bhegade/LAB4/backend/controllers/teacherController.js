const User = require("../models/User");

// Add Teacher
exports.addTeacher = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const teacher = await User.create({
            name,
            email,
            password,
            role: "teacher"
        });

        res.status(201).json({
            success: true,
            message: "Teacher Added Successfully",
            teacher
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Teachers
exports.getTeachers = async (req, res) => {

    try {

        const teachers = await User.find(
            { role: "teacher" },
            "-password"
        );

        res.json({
            success: true,
            teachers
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Teacher
exports.updateTeacher = async (req, res) => {

    try {

        const teacher = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Teacher Updated Successfully",
            teacher
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Teacher Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};