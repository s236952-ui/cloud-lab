import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ mssv: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = typeof window !== 'undefined' && window.location.origin.includes('github.dev')
    ? window.location.origin.replace(/-(3000|5173)\./, '-5000.') + '/api/students'
    : 'http://localhost:5000/api/students';

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("Dữ liệu từ Backend:", data);
      if (Array.isArray(data)) setStudents(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mssv || !form.name || !form.email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      mssv: form.mssv,
      studentId: form.mssv,
      code: form.mssv,
      name: form.name,
      email: form.email
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setEditingId(null);
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        alert(`Lỗi Server (${res.status}): Không thể lưu sinh viên.`);
        return;
      }

      setForm({ mssv: '', name: '', email: '' });
      await fetchStudents();
    } catch (err) {
      console.error("Lỗi lưu sinh viên:", err);
      alert("Không kết nối được Backend. Hãy kiểm tra Port 5000 đã set Public trên Codespaces chưa!");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    const currentMssv = student.mssv || student.studentId || student.code || student.student_id || '';
    setForm({ mssv: currentMssv, name: student.name || '', email: student.email || '' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên MERN</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <input placeholder="MSSV" value={form.mssv} onChange={e => setForm({...form, mssv: e.target.value})} style={{ padding: '8px' }} />
        <input placeholder="Họ Tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '8px' }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>{editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}</button>
      </form>

      <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #444' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
            <th style={{ padding: '10px', border: '1px solid #444' }}>MSSV</th>
            <th style={{ padding: '10px', border: '1px solid #444' }}>Họ Tên</th>
            <th style={{ padding: '10px', border: '1px solid #444' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #444' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={s._id || idx}>
              <td style={{ padding: '10px', border: '1px solid #444' }}>
                {s.mssv || s.studentId || s.code || s.student_id || 'N/A'}
              </td>
              <td style={{ padding: '10px', border: '1px solid #444' }}>{s.name}</td>
              <td style={{ padding: '10px', border: '1px solid #444' }}>{s.email}</td>
              <td style={{ padding: '10px', border: '1px solid #444' }}>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;