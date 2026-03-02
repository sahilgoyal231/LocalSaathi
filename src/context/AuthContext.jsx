import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      // Fallback for demo users
      if (user && user.id && user.token === 'demo-token') {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, message: error.message };
    }
  };

  const demoLogin = (role, email, name = 'Demo User') => {
    let id;
    if (role === 'customer') id = 'demo-customer-id';
    else if (role === 'serviceman') id = 'demo-serviceman-id';
    else if (role === 'shopkeeper') id = 'demo-shopkeeper-id';
    else id = 'demo-id-' + Math.random().toString(36).substr(2, 9);

    const demoUser = {
      name,
      email,
      role,
      id,
      token: 'demo-token',
      rating: 4.8,
      hourlyRate: 350
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, demoLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
