// ==========================================
// MongoDB Connection
// ==========================================

const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendance";
        const conn = await mongoose.connect(mongoUri);

        console.log("=================================");
        console.log(" MongoDB Connected Successfully");
        console.log(` Database Host : ${conn.connection.host}`);
        console.log(` Database Name : ${conn.connection.name}`);
        console.log("=================================");

        return conn;

    } catch (error) {

        console.error("MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);

    }
};

module.exports = connectDB;