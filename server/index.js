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

const studentSchema = new mongoose.Schema({
  studentId: String,
  mssv: String,
  name: String,
  email: String
}, { strict: false });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema, 'students');

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend MERN đang hoạt động!" });
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { mssv, studentId, name, email } = req.body;
    const newStudent = new Student({
      studentId: studentId || mssv,
      mssv: mssv || studentId,
      name,
      email
    });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "Xóa sinh viên thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
