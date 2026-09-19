require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

// CI/CD testing
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
 process.env.MONGO_URI || "mongodb://attendance-mongodb:27017/attendanceDB"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

// Routes
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/attendance", attendanceRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Attendance Management System API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Started at Port ${PORT}`);
});