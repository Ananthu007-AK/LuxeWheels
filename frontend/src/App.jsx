import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import CompareModal from './components/cars/CompareModal';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Rent from './pages/Rent';
import Sell from './pages/Sell';
import CarDetails from './pages/CarDetails';
import Buy from './pages/Buy';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <WishlistProvider>
          <CompareProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
            </Routes>
            <CompareModal />
          </CompareProvider>
        </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
