// =====================================
// Attendance Management System
// Express Server
// =====================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const connectDB = require("./config/db");
const User = require("./models/User");

const attendanceRoutes = require("./routes/attendanceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const app = express();
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/teachers", teacherRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@attendance.com" });

        if (existingAdmin) {
            console.log("Default admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "System Admin",
            email: "admin@attendance.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Default admin created successfully");
        console.log("Login with email: admin@attendance.com and password: admin123");
    } catch (error) {
        console.error("Default admin creation failed:", error.message);
    }
};

connectDB().then(createDefaultAdmin);

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Attendance Management System Backend Running Successfully"
    });
});

// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is Healthy"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

app.get("/api/profile", authMiddleware, (req, res) => {

    res.json({
        success: true,
        message: "Welcome!",
        user: req.user
    });

});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` Server Running Successfully`);
    console.log(` http://localhost:${PORT}`);
    console.log(`========================================`);
});