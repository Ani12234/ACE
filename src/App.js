import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import MainHomePage from './pages/MainHomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <header className="app-header">
          <div className="container header-inner">
            <Link to="/" className="brand" aria-label="AI E-Learning Home">
              <span className="brand-logo" aria-hidden>AI</span>
              <span className="brand-text">E‑Learning & Proctor</span>
            </Link>
            <nav className="header-nav" aria-label="Primary">
              <Link to="/" className="nav-link">Home</Link>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<MainHomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
