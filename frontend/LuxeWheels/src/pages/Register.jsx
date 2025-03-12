import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpass] = useState('');
  const navigate = useNavigate();

  async function sendData() {
    if (!username || !email || !password) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/user/register', {
        username,
        email,
        password,
      });
      console.log(response.data);
      navigate('/');
      alert(response.data.msg);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response.data.errors[0].msg);
        alert(error.response.data.errors[0].msg);
      } else if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.error(error);
        alert('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="login-container">
      <h2>Welcome to LuxeWheels</h2>
      <p>Where Elegance Meets the Road</p>
      <form onSubmit={(e) => { e.preventDefault(); sendData(); }}>
        <input type="text" className="input-box" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" className="input-box" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input-box" placeholder="Password" value={password} onChange={(e) => setpass(e.target.value)} />
        <button className="login-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
