const Subject = require("../models/Subject");

// Add Subject
exports.addSubject = async (req, res) => {

    try {

        const subject = await Subject.create(req.body);

        res.status(201).json({
            success: true,
            message: "Subject Added Successfully",
            subject
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Subjects
exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.find();

        res.json({
            success: true,
            subjects
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Subject
exports.updateSubject = async (req, res) => {

    try {

        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Subject Updated Successfully",
            subject
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Subject
exports.deleteSubject = async (req, res) => {

    try {

        await Subject.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Subject Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};