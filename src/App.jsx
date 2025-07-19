import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', email: '', mobile: '' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/users`, form);
      setForm({ name: '', age: '', email: '', mobile: '' });
      fetchUsers();
    } catch (err) {
      alert('An error occurred while adding the user.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>User Profile Manager</h1>
      <form onSubmit={handleSubmit} className="form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" required />
        <button type="submit">Add User</button>
      </form>

      <div className="user-list">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <h3>{u.name}</h3>
            <p><strong>Age:</strong> {u.age}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Mobile:</strong> {u.mobile}</p>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
