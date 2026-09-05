import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Gọi API lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Lỗi lấy danh sách sinh viên:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Gửi form thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId, name, email })
      })

      if (response.ok) {
        setStudentId('')
        setName('')
        setEmail('')
        fetchStudents()
      }
    } catch (error) {
      console.error('Lỗi thêm sinh viên:', error)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản Lý Sinh Viên MERN</h1>

      {/* Form nhập dữ liệu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="MSSV" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Họ Tên" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      {/* Bảng danh sách sinh viên */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlig: 'left' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st._id}>
              <td>{st.studentId}</td>
              <td>{st.name}</td>
              <td>{st.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App