const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string comes from environment (set in docker-compose)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/clg_events';

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB at', MONGO_URL))
  .catch(err => console.error('MongoDB connection error:', err));

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  event: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the registration form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Save a new registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, college, event } = req.body;
    if (!name || !email || !phone || !college || !event) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const reg = new Registration({ name, email, phone, college, event });
    await reg.save();
    res.status(201).json({ message: 'Registration saved successfully', data: reg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving registration' });
  }
});

// List all registrations (used to verify persistence)
app.get('/registrations', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching registrations' });
  }
});

// Simple health check for Jenkins/docker healthchecks
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongoState: mongoose.connection.readyState });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`College Event Registration app listening on port ${PORT}`);
});
