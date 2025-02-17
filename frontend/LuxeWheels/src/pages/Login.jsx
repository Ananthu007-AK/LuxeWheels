import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import Register from './Register'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setpass] = useState('');

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

        alert(response.data.msg)
    }
    catch(error){
        console.log(error);
        alert('Failed to login')        
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
                        <a href="#">Forgot password?</a>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Login