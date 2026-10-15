const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getStudents } = require("../controllers/userController");

router.get("/students", authMiddleware, getStudents);

module.exports = router;