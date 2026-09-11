import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('gramseva_token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (e) {
          await switchRole('CITIZEN');
        }
      } else {
        await switchRole('CITIZEN');
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  async function login(email, password) {
    const res = await api.login(email, password);
    localStorage.setItem('gramseva_token', res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(userData) {
    const res = await api.register(userData);
    localStorage.setItem('gramseva_token', res.token);
    setUser(res.user);
    return res.user;
  }

  async function switchRole(role) {
    if (role === 'COMMUNITY_OBSERVER') {
      setUser({
        id: 'u-observer-1',
        name: 'Venkatesh Reddy',
        email: 'observer@gramseva.kar.gov.in',
        role: 'COMMUNITY_OBSERVER',
        designation: 'Ward Member, Honnur GP',
        ward_id: 'w-2',
        ward_name: 'Ward 2 - School & PHC Ward'
      });
      return;
    }
    try {
      const res = await api.switchRole(role);
      localStorage.setItem('gramseva_token', res.token);
      setUser(res.user);
      return res.user;
    } catch (e) {
      console.error('Failed to switch demo role:', e);
    }
  }

  function logout() {
    localStorage.removeItem('gramseva_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
