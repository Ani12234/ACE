import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, getIdToken } from 'firebase/auth';
import '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const auth = getAuth();
  // Normalize API base; tolerate values like 'http://localhost:4100', 'http://localhost:4100/', '/api', 'http://host/api'
  const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4100').trim();
  function joinBasePath(base, path) {
    let b = base;
    let p = path || '';
    // If base ends with /api and path starts with /api, drop one /api to avoid double prefix
    if (/\/api\/?$/i.test(b) && /^\/api\//i.test(p)) {
      p = p.replace(/^\/api/i, '');
    }
    // Remove trailing slash from base and ensure path starts with '/'
    b = b.replace(/\/$/, '');
    if (!p.startsWith('/')) p = '/' + p;
    return b + p;
  }

  async function request(path, body) {
    const url = joinBasePath(RAW_BASE, path);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || 'Request failed';
      throw new Error(msg);
    }
    return data;
  }

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const token = await getIdToken(res.user, true);
    setIsAuthenticated(true);
    setUser({ uid: res.user.uid, email: res.user.email, name: res.user.displayName, photoURL: res.user.photoURL });
    setIdToken(token);
    localStorage.setItem('idToken', token);
    localStorage.setItem('user', JSON.stringify({ uid: res.user.uid, email: res.user.email, name: res.user.displayName, photoURL: res.user.photoURL }));
    try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Logged in successfully' } })); } catch {}
  };

  // Email/password login via backend
  const loginWithPassword = async (email, password) => {
    const data = await request('/api/auth/login', { email, password });
    const token = data.idToken;
    setIsAuthenticated(true);
    setIdToken(token);
    localStorage.setItem('idToken', token);
    // Optionally fetch profile from backend /me to get verified claims
    let profile = null;
    try {
      const res = await fetch(`${RAW_BASE.replace(/\/$/, '')}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) profile = await res.json();
    } catch {}
    const u = profile?.user || { uid: data.localId, email: data.email, name: null };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Logged in successfully' } })); } catch {}
  };

  // Email/password signup via backend
  const signupWithPassword = async (name, email, password) => {
    const data = await request('/api/auth/signup', { name, email, password });
    const token = data.idToken;
    setIsAuthenticated(true);
    setIdToken(token);
    localStorage.setItem('idToken', token);
    const u = { uid: data.uid, email: data.email, name: data.name || name };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Account created and signed in' } })); } catch {}
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
    setIdToken(null);
    localStorage.removeItem('idToken');
    localStorage.removeItem('user');
    try { window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Logged out successfully' } })); } catch {}
  };

  // Listen for auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsAuthenticated(false);
        setUser(null);
        setIdToken(null);
        localStorage.removeItem('idToken');
        localStorage.removeItem('user');
        return;
      }
      const token = await getIdToken(u, true);
      setIsAuthenticated(true);
      setUser({ uid: u.uid, email: u.email, name: u.displayName, photoURL: u.photoURL });
      setIdToken(token);
      localStorage.setItem('idToken', token);
      localStorage.setItem('user', JSON.stringify({ uid: u.uid, email: u.email, name: u.displayName, photoURL: u.photoURL }));
    });
    return () => unsub();
  }, [auth]);

  const value = { isAuthenticated, user, idToken, login, loginWithPassword, signupWithPassword, logout };

  return React.createElement(AuthContext.Provider, { value }, children);
};
