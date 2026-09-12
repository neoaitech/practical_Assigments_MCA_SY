const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/college_event";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    event: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "College Event API is running" });
});

app.post("/api/registrations", async (req, res) => {
  try {
    const { name, email, phone, college, event } = req.body;

    if (!name || !email || !phone || !college || !event) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const registration = await Registration.create({
      name,
      email,
      phone,
      college,
      event
    });

    res.status(201).json({
      message: "Registration successful!",
      registration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to save registration."
    });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch registrations."
    });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
