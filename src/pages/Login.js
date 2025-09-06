import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import DomainSelection from '../components/DomainSelection';
import CourseRecommendations from '../components/CourseRecommendations';

gsap.registerPlugin(ScrollTrigger);

function Login() {
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  const [showCourseRecommendations, setShowCourseRecommendations] = useState(false);
  const [selectedDomainData, setSelectedDomainData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const card = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(card, { y: 24, opacity: 0, rotateX: -6 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7 });
    tl.fromTo(card.querySelectorAll('[data-stagger]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '<0.05');

    // ScrollTrigger for below-the-fold feature items
    const featureItems = document.querySelectorAll('[data-feature-item]');
    featureItems.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0] || 'User',
        email: email,
        level: 'Intermediate',
        streak: 7
      };
      
      login(userData);
      
      // Check if user has already selected a domain
      const existingDomainSelection = localStorage.getItem('userDomainSelection');
      
      if (existingDomainSelection) {
        // User has already selected domain, go directly to dashboard
        navigate('/dashboard');
      } else {
        // New user, show domain selection popup
        setShowDomainSelection(true);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDomainSelect = (domainData) => {
    // Save domain selection to localStorage
    localStorage.setItem('userDomainSelection', JSON.stringify(domainData));
    setSelectedDomainData(domainData);
    setShowDomainSelection(false);
    setShowCourseRecommendations(true);
  };

  const handleCourseSelect = (course) => {
    // Save selected course and redirect to dashboard
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    navigate('/dashboard');
  };

  const handleSkipCourseSelection = () => {
    // Skip course selection and go to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {/* Login Hero Section */}
      <section className="login-hero section">
        <div className="container">
          <div className="login-content">
            <div className="login-info">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">
                Continue your AI-powered learning journey and unlock your potential with personalized education.
              </p>
              <div className="login-features">
                <div className="login-feature">
                  <span className="feature-icon">🎯</span>
                  <span>Personalized Learning Path</span>
                </div>
                <div className="login-feature">
                  <span className="feature-icon">🤖</span>
                  <span>AI-Powered Interview Practice</span>
                </div>
                <div className="login-feature">
                  <span className="feature-icon">📊</span>
                  <span>Real-time Progress Tracking</span>
                </div>
              </div>
            </div>

            <div className="login-form-container">
              <form ref={cardRef} className="login-form" onSubmit={handleLogin}>
                <div className="form-header" data-stagger>
                  <h2>Sign In</h2>
                  <p>Access your learning dashboard</p>
                </div>

                <div className="form-group" data-stagger>
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    className="form-input" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" data-stagger>
                  <label htmlFor="password">Password</label>
                  <input 
                    id="password" 
                    type="password" 
                    className="form-input" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions" data-stagger>
                  <button 
                    className="btn btnPrimary btn-large" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                  
                  <div className="form-links">
                    <Link to="/signup" className="auth-link">
                      Don't have an account? <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="login-benefits section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <div className="section-line"></div>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card" data-feature-item>
              <div className="benefit-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security and encryption standards.</p>
            </div>
            <div className="benefit-card" data-feature-item>
              <div className="benefit-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning journey with detailed analytics and personalized insights.</p>
            </div>
            <div className="benefit-card" data-feature-item>
              <div className="benefit-icon">🎯</div>
              <h3>AI-Powered Practice</h3>
              <p>Experience realistic interview scenarios with our advanced AI proctor system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Selection Popup */}
      <DomainSelection
        isOpen={showDomainSelection}
        onClose={() => setShowDomainSelection(false)}
        onDomainSelect={handleDomainSelect}
      />

      {/* Course Recommendations Popup */}
      {showCourseRecommendations && selectedDomainData && (
        <div className="course-recommendations-overlay">
          <div className="course-recommendations-modal">
            <div className="modal-header">
              <h2>Perfect! Here are your recommended courses</h2>
              <button 
                className="skip-btn"
                onClick={handleSkipCourseSelection}
              >
                Skip for now
              </button>
            </div>
            <CourseRecommendations
              selectedDomain={selectedDomainData.domain}
              experienceLevel={selectedDomainData.experience}
              onCourseSelect={handleCourseSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
