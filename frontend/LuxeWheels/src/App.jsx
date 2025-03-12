import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import {Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Rent from './pages/Rent'
import Sell from './pages/Sell'
import CarDetails from './pages/CarDetails'
import Buy from './pages/Buy'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'

function App() {


  return (
    <>
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path='/rent' element={<Rent/>}/>
      <Route path='/sell' element={<Sell/>}/>
      <Route path='/buy' element={<Buy/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path="/car/:id" element={<CarDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
