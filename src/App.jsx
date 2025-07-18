import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL; // ✅ Use .env variable

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
      } else {
        await axios.post(`${API}/register`, formData);
      }
      setFormData({ name: '', email: '', password: '' });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, password: user.password });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Manage Your Profiles</h1>
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">{editId ? 'Update User' : 'Add User'}</button>
        </form>

        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(user._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
