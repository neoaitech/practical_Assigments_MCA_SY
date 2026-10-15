const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// Add Student
router.post("/", authMiddleware, addStudent);

// Get All Students
router.get("/", authMiddleware, getStudents);

// Update Student
router.put("/:id", authMiddleware, updateStudent);

// Delete Student
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;