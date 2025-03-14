import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault(e);
        
        if (email === '') {
            setMessage("Email cannot be empty");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:3000/users/forgot-password', {
                email: email
            });
            
            setMessage(response.data.msg || "Password reset email sent. Check your inbox.");
            setIsLoading(false);
            
            // Optionally redirect after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (error) {
            setIsLoading(false);
            
            if (error.response && error.response.data) {
                setMessage(error.response.data.msg || "An error occurred");
            } else {
                console.error(error);
                setMessage("An unexpected error occurred");
            }
        }
    }

    return (
        <>
            <div className="login-container">
                <h2>Reset Your Password</h2>
                <p>Enter your email to receive a password reset link</p>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        className="input-box" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button 
                        className="login-btn" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Reset Password"}
                    </button>
                    <div className="links">
                        <a href="/login">Back to Login</a>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword