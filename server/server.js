cat << 'EOF' > /workspaces/cloud-lab/mern-demo/server/server.js
global.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://sieut366_db_user:sieu25022005chuong@cluster0.h3rcwpg.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('>>> KET NOI MONGODB THANH CONG <<<'))
  .catch(err => console.error('>>> LOI KET NOI MONGODB:', err.message));

const Student = mongoose.models.Student || mongoose.model('Student', new mongoose.Schema({}, { strict: false }), 'students');

// 1. Lay danh sach sinh vien
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Them sinh vien moi (POST)
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Cap nhat sinh vien (PUT)
app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Xoa sinh vien (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoa thanh cong" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
EOF