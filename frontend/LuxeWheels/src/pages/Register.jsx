import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function sendData() {
    if (!username || !email || !password) {
      alert('All fields are required!');
      console.log('All fields are required!');
      
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/user/register', {
        username,
        email,
        password,
      });
      console.log(response.data);
      alert(response.data.msg); // Show alert before redirecting
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.errors?.[0]?.msg || `Error ${error.response?.status}: ${error.response?.statusText}` || 'An unexpected error occurred');
      console.error(error);
    }
  }

  return (
    <div className="login-container">
      <h2>Welcome to LuxeWheels</h2>
      <p>Where Elegance Meets the Road</p>
      <form onSubmit={(e) => { e.preventDefault(); sendData(); }}>
        <input type="text" className="input-box" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" className="input-box" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input-box" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="login-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
