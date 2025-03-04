import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import {Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import Admin from './pages/Admin'

function App() {


  return (
    <>
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </>
  )
}

export default App
