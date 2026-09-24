const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000;

const MONGO_URL =
    process.env.MONGO_URL ||
    "mongodb://localhost:27017/college_events";

app.use(express.json());
app.use(express.static("public"));

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    college: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    year: {
        type: String,
        required: true
    },

    event: {
        type: String,
        required: true
    },

    registeredAt: {
        type: Date,
        default: Date.now
    }
});

const Registration =
    mongoose.model("Registration", registrationSchema);


app.post("/register", async (req, res) => {

    try {

        const registration =
            new Registration(req.body);

        await registration.save();

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed."
        });

    }

});


app.get("/registrations", async (req, res) => {

    try {

        const registrations =
            await Registration.find();

        res.json(registrations);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch registrations"
        });

    }

});


app.get("/health", (req, res) => {

    res.json({
        status: "Application is running"
    });

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});