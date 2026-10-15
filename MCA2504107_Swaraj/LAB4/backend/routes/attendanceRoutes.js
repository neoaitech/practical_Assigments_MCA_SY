const express = require("express");

const router = express.Router();

const Attendance = require("../models/Attendance");

router.post("/", async (req, res) => {

    const attendance = new Attendance(req.body);

    await attendance.save();

    res.json(attendance);

});

router.get("/", async (req, res) => {

    const attendance = await Attendance.find();

    res.json(attendance);

});

module.exports = router;