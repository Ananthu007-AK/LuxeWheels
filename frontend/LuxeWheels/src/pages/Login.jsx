import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import Register from './Register'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setpass] = useState('');
    const navigate=useNavigate()

    async function sendData(e) {
        e.preventDefault()



        if (email == '' || password == '') {
            alert("email/Password cant be empty")
            return
        }
        try{
        const response = await axios.post('http://localhost:3000/user/login', {
            email: email,
            password: password
        })
        console.log(response.data);


        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', response.data.role)

        if (response.data.role === "admin") {
            navigate('/admin');
        } else {
            navigate('/');
        }
        // navigate('/')

        alert(response.data.msg)
    }
    catch(error){
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.errors[0].msg)
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
        <>
            <div className="login-container" >
                <h2>Welcome to LuxeWheels</h2>
                <p>Where Elegance Meets the Road</p>

                <form onSubmit={(e)=>sendData(e)}>

                    <input type="email" className="input-box" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" className="input-box" placeholder="Password" onChange={(e) => setpass(e.target.value)} />
                    <button className="login-btn" type="submit">Submit</button>
                    <div className="links">
                        <a href="./Register">Don't have an account? Sign up</a>
                        <a href="/forgot-password">Forgot password?</a>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Login