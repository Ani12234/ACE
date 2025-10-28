import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import CourseProgressManager from './utils/courseProgress';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import InterviewPractice from './pages/InterviewPractice';
import MainHomePage from './pages/MainHomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import DomainSelectionPage from './pages/DomainSelectionPage';
import CourseRecommendations from './components/CourseRecommendations';
import CourseDetail from './components/CourseDetail';
import Dashboard from './pages/Dashboard';
import AdminRag from './pages/AdminRag';
import ReferenceSetup from './pages/ReferenceSetup';
import Loader from './components/Loader';
import LearningBrowse from './pages/LearningBrowse';
import LearningCourse from './pages/LearningCourse';
import LearningTopic from './pages/LearningTopic';
import LearningQuiz from './pages/LearningQuiz';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);
  const avatarText = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  // Check if user has completed domain selection
  const hasCompletedDomainSelection = () => {
    try {
      const raw = localStorage.getItem('userDomainSelection');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed && parsed.domain && parsed.experience);
    } catch {
      return false;
    }
  };

  // Check if domain selection has been shown in this browser session
  const hasSeenDomainSelectionThisSession = () => {
    try {
      return sessionStorage.getItem('ace.domainSelectionSeen') === 'true';
    } catch {
      return false;
    }
  };

  // Check if user has explicitly skipped domain selection
  const hasSkippedDomainSelection = () => {
    try {
      return localStorage.getItem('ace.domainSelectionSkipped') === 'true';
    } catch {
      return false;
    }
  };

  // Determine where authenticated users should go
  const getAuthenticatedRoute = () => {
    if (hasCompletedDomainSelection()) {
      return <MainHomePage />;
    } else {
      return <Navigate to="/domain-selection" replace />;
    }
  };

  const hasReferenceCreated = () => {
    try { return localStorage.getItem('ace.referenceCreated') === 'true'; } catch { return false; }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Cleanup body class on component unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  // Load simple learning stats for navbar profile menu
  useEffect(() => {
    try {
      const enrolled = CourseProgressManager.getEnrolledCourses();
      setEnrolledCount(Array.isArray(enrolled) ? enrolled.length : 0);
      const all = CourseProgressManager.getAllProgress();
      const vals = Object.values(all || {});
      const avg = vals.length ? Math.round(vals.reduce((a, b) => a + (Number(b) || 0), 0) / vals.length) : 0;
      setAvgProgress(avg);
    } catch {}
  }, []);

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <Link to={"/"} className="brand" aria-label="AI E-Learning Home">
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
            {mobileMenuOpen && (
              <button 
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                ✕
              </button>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
                <Link to="/features" className="nav-link" onClick={closeMobileMenu}>Features</Link>
                <Link to="/reference-setup" className="nav-link" onClick={closeMobileMenu}>AI Interview</Link>
                <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
                <Link to="/learning" className="nav-link" onClick={closeMobileMenu}>Learning</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="nav-link" onClick={closeMobileMenu}>Sign Up</Link>
              </>
            )}
          </nav>
          {isAuthenticated && (
            <div style={{ position: 'relative', marginLeft: 12 }}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="nav-link"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '6px 10px', borderRadius: 999,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e)=>{ e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={(e)=>{ e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span style={{ position:'relative', width: 28, height: 28, borderRadius: '50%', overflow:'hidden', display:'inline-flex', alignItems:'center', justifyContent:'center',
                  background: 'linear-gradient(135deg, rgba(108,140,255,0.6), rgba(23,210,194,0.6))', color:'#fff', fontWeight:700 }}>
                  {user?.photoURL && (
                    <img src={user.photoURL} alt="avatar" onError={(e)=>{ e.currentTarget.style.display='none'; }} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  )}
                  <span>{avatarText}</span>
                </span>
                <span style={{ fontWeight: 600, maxWidth: 160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user?.name || user?.email || 'Profile'}
                </span>
                <span aria-hidden style={{ opacity: 0.8 }}>▾</span>
              </button>
              {profileOpen && (
                <div role="menu" style={{ position: 'absolute', right: 0, top: '110%', background: 'rgba(20,20,30,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, minWidth: 240, zIndex: 50 }}>
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '6px 8px', display:'flex', justifyContent:'space-between' }}>
                    <span>Courses Enrolled</span>
                    <strong>{enrolledCount}</strong>
                  </div>
                  <div style={{ padding: '6px 8px', display:'flex', justifyContent:'space-between' }}>
                    <span>Avg. Progress</span>
                    <strong>{avgProgress}%</strong>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 6 }} />
                  <button onClick={handleLogout} className="nav-link logout-btn" style={{ width:'100%', textAlign:'left', padding: '8px 8px' }}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? (!hasCompletedDomainSelection() && !hasSkippedDomainSelection() && !hasSeenDomainSelectionThisSession()
                    ? <Navigate to="/domain-selection" replace />
                    : <MainHomePage />)
                : <Home />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated
                ? (!hasCompletedDomainSelection() && !hasSkippedDomainSelection() && !hasSeenDomainSelectionThisSession()
                    ? <Navigate to="/domain-selection" replace />
                    : <Navigate to="/" replace />)
                : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated
                ? (!hasCompletedDomainSelection() && !hasSkippedDomainSelection() && !hasSeenDomainSelectionThisSession()
                    ? <Navigate to="/domain-selection" replace />
                    : <Navigate to="/" replace />)
                : <Signup />
            }
          />
          
          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated
                ? (!hasCompletedDomainSelection() && !hasSkippedDomainSelection() && !hasSeenDomainSelectionThisSession()
                    ? <Navigate to="/domain-selection" replace />
                    : <Dashboard />)
                : <Navigate to="/login" replace />
            }
          />
          <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
          <Route path="/features" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/interview-practice" element={isAuthenticated ? (hasReferenceCreated() ? <InterviewPractice /> : <Navigate to="/reference-setup" replace />) : <Navigate to="/login" replace />} />
          <Route path="/reference-setup" element={isAuthenticated ? <ReferenceSetup /> : <Navigate to="/login" replace />} />
          <Route path="/domain-selection" element={isAuthenticated ? <DomainSelectionPage /> : <Navigate to="/login" replace />} />
          <Route path="/course-recommendations" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/course-detail/:courseId" element={isAuthenticated ? <CourseDetail /> : <Navigate to="/login" replace />} />
          <Route path="/admin-rag" element={isAuthenticated ? <AdminRag /> : <Navigate to="/login" replace />} />
          {/* Learning (public read, authenticated in app) */}
          <Route path="/learning" element={isAuthenticated ? <LearningBrowse /> : <Navigate to="/login" replace />} />
          <Route path="/learning/:courseSlug" element={isAuthenticated ? <LearningCourse /> : <Navigate to="/login" replace />} />
          <Route path="/learning/:courseSlug/:topicSlug" element={isAuthenticated ? <LearningTopic /> : <Navigate to="/login" replace />} />
          <Route path="/learning/:courseSlug/:topicSlug/quiz" element={isAuthenticated ? <LearningQuiz /> : <Navigate to="/login" replace />} />
          
          {/* Direct routes for main sections */}
          <Route path="/courses" element={isAuthenticated ? <Navigate to="/learning" replace /> : <Navigate to="/login" replace />} />
          <Route path="/assessment" element={isAuthenticated ? (hasReferenceCreated() ? <InterviewPractice /> : <Navigate to="/reference-setup" replace />) : <Navigate to="/login" replace />} />
          <Route path="/career-guidance" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/certificates" element={isAuthenticated ? <MainHomePage /> : <Navigate to="/login" replace />} />
          <Route path="/all-courses" element={isAuthenticated ? <Navigate to="/learning" replace /> : <Navigate to="/login" replace />} />
          <Route path="/practice" element={isAuthenticated ? (hasReferenceCreated() ? <InterviewPractice /> : <Navigate to="/reference-setup" replace />) : <Navigate to="/login" replace />} />
          <Route path="/interview" element={isAuthenticated ? (hasReferenceCreated() ? <InterviewPractice /> : <Navigate to="/reference-setup" replace />) : <Navigate to="/login" replace />} />
          <Route path="/progress" element={isAuthenticated ? <MainHomePage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <Loader
      titleLines={["ACE", "AI BASED", "COGNITIVE EDUCATION"]}
      durationMs={4500}
      onComplete={() => setLoading(false)}
    />
  ) : (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
