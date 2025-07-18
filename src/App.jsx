import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch all users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/users/register`, formData);
      alert(res.data.message || "User added successfully");
      setFormData({ name: "", email: "", password: "" });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error adding user:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while adding the user."
      );
    }
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>Manage Your Profiles</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter a password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />
          <button type="submit" className="submit-btn">
            Add User
          </button>
        </form>
      </div>

      <div className="user-list">
        <h2>All Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <strong>{user.name}</strong> – {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
