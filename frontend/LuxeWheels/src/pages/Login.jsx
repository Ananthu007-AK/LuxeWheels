import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function sendData(e) {
        e.preventDefault();

        if (!email || !password) {
            alert("Email/Password can't be empty");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/user/login', {
                email,
                password
            });

            console.log(response.data);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);

            if (response.data.role === "admin") {
                navigate('/admin');
            } else {
                navigate('/');
            }

            alert(response.data.msg);
        } catch (error) {
            alert(error.response?.data?.errors?.[0]?.msg || `Error ${error.response?.status}: ${error.response?.statusText}` || 'An unexpected error occurred');
            console.error(error);
        }
    }

    return (
        <div className="login-container">
            <h2>Welcome to LuxeWheels</h2>
            <p>Where Elegance Meets the Road</p>

            <form onSubmit={sendData}>
                <input
                    type="email"
                    className="input-box"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input-box"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-btn" type="submit">Submit</button>

                <div className="links">
                    <span onClick={() => navigate('/register')} className="link">Don't have an account? Sign up</span>
                    <a href="/forgot-password">Forgot password?</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
