const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    addTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher

} = require("../controllers/teacherController");

// Add Teacher
router.post("/", authMiddleware, addTeacher);

// Get All Teachers
router.get("/", authMiddleware, getTeachers);

// Update Teacher
router.put("/:id", authMiddleware, updateTeacher);

// Delete Teacher
router.delete("/:id", authMiddleware, deleteTeacher);

module.exports = router;