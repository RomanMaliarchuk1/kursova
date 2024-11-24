import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData, token) => {
    if (userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    } else {
        console.error("Invalid login data:", userData, token);
    }
};

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const currentUserId = user ? user.id : null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, currentUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
