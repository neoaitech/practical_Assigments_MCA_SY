const User = require("../models/User");

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