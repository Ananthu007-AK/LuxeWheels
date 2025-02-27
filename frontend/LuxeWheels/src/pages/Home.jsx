import React from 'react'
import './Home.css'
// import App from './App.jsx'
import img1 from './car.png'
import Login from './Login'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>

      <title>Luxewheels - Where Elegance Meets The Road</title>
      <link rel="stylesheet" href="Home.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Michroma&display=swap"
        rel="stylesheet"
      />
      <nav>
        <a href="/" className="logo">
          Luxewheels
        </a>
        <div className="nav-links">
          <Link to='#'>Buy</Link>
          <Link to='#'>Rent</Link>
          <Link to='#'>Sell</Link>
          <Link to='#'>About us</Link>
          <Link to='/Login'>Login</Link>
        </div>
      </nav>
      <main>
        <section className="hero">
          <h1>Where Elegance Meets The Road</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Tell us your dream..."
          />
          <div className="car-showcase">
            <img
              src={img1}
              alt="Luxury car showcase"
              className="car-image"
            />
          </div>
        </section>
      </main>
    </>
  )
}

export default Home