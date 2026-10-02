import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      if (jwtToken) localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const handleRegister = async (userData) => {
    const res = await registerUser(userData);
    if (res.success && res.data) {
      const { user: newUserData, token: jwtToken } = res.data;
      setUser(newUserData);
      setToken(jwtToken);
      if (jwtToken) localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(newUserData));
      return newUserData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore logout errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || null,
        isRecruiter: user?.role === 'recruiter' || user?.role === 'admin',
        isCandidate: user?.role === 'candidate',
        isAdmin: user?.role === 'admin',
        loading,
        login: handleLogin,
        register: handleRegister,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

