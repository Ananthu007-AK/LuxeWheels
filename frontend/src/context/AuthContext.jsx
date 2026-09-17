import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');
    const savedToken = localStorage.getItem('token');

    if (savedToken && savedUser) {
      setUser(savedUser);
      setRole(savedRole || 'user');
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const username = userData.username || userData.email || userData.name;
    const userRole = userData.role || 'user';
    const userToken = userData.token;

    setUser(username);
    setRole(userRole);
    setToken(userToken);

    localStorage.setItem('username', username);
    localStorage.setItem('role', userRole);
    if (userToken) {
      localStorage.setItem('token', userToken);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    role,
    token,
    isAdmin: role === 'admin',
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
