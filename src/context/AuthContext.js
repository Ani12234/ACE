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

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const token = await getIdToken(res.user, true);
    setIsAuthenticated(true);
    setUser({ uid: res.user.uid, email: res.user.email, name: res.user.displayName, photoURL: res.user.photoURL });
    setIdToken(token);
    localStorage.setItem('idToken', token);
    localStorage.setItem('user', JSON.stringify({ uid: res.user.uid, email: res.user.email, name: res.user.displayName, photoURL: res.user.photoURL }));
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
    setIdToken(null);
    localStorage.removeItem('idToken');
    localStorage.removeItem('user');
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

  const value = { isAuthenticated, user, idToken, login, logout };

  return React.createElement(AuthContext.Provider, { value }, children);
};
