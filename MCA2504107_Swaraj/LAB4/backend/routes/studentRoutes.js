const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

router.post("/", async (req, res) => {

    const student = new Student(req.body);

    await student.save();

    res.json(student);

});

router.get("/", async (req, res) => {

    const students = await Student.find();

    res.json(students);

});

module.exports = router;