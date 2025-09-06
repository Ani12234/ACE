import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import InterviewPractice from './pages/InterviewPractice';
import MainHomePage from './pages/MainHomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import DomainSelection from './components/DomainSelection';
import CourseRecommendations from './components/CourseRecommendations';
import CourseDetail from './components/CourseDetail';
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="brand" aria-label="AI E-Learning Home">
            <span className="brand-logo" aria-hidden>AI</span>
            <span className="brand-text">E‑Learning & Proctor</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Primary">
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
                <Link to="/features" className="nav-link" onClick={closeMobileMenu}>Features</Link>
                <Link to="/interview-practice" className="nav-link" onClick={closeMobileMenu}>AI Interview</Link>
                <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
                <Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Courses</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="nav-link" onClick={closeMobileMenu}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
          <Route path="/features" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/interview-practice" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={isAuthenticated ? <MainHomePage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
          {/* Placeholder routes for future pages */}
          <Route path="/courses" element={<Navigate to="/dashboard" replace />} />
          <Route path="/assessment" element={<Navigate to="/interview-practice" replace />} />
          <Route path="/career-guidance" element={<Navigate to="/features" replace />} />
          <Route path="/certificates" element={<Navigate to="/dashboard" replace />} />
          <Route path="/all-courses" element={<Navigate to="/dashboard" replace />} />
          <Route path="/practice" element={<Navigate to="/interview-practice" replace />} />
          <Route path="/interview" element={<Navigate to="/interview-practice" replace />} />
          <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
