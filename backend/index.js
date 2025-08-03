const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://manish220030:d7BfYYU9c51KKnlf@cluster0.qr3mubn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define UserRecord Schema
const userRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const UserRecord = mongoose.model('UserRecord', userRecordSchema);

// API Routes

// GET all records
app.get('/api/records', async (req, res) => {
  try {
    const records = await UserRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single record by ID
app.get('/api/records/:id', async (req, res) => {
  try {
    const record = await UserRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Error fetching single record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new record
app.post('/api/records', async (req, res) => {
  const { name, email, phone, position, description } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  try {
    const newRecord = new UserRecord({
      name,
      email,
      phone,
      position,
      description
    });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error('Error saving record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});