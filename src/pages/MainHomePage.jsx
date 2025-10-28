import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CourseRecommendations from '../components/CourseRecommendations';
import CourseProgressManager from '../utils/courseProgress';
import api from '../api/client';

gsap.registerPlugin(ScrollTrigger);

function MainHomePage() {
  const [user] = useState({ name: 'John Doe', level: 'Intermediate', streak: 7 });
  const [isLoading, setIsLoading] = useState(false); // Set to false to show content immediately
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [learningStats, setLearningStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    currentStreak: 0
  });
  const dashboardRef = useRef(null);
  const animationsRef = useRef([]);
  const timeoutRef = useRef(null);

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/learning/courses');
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load enrolled courses and calculate learning stats
  useEffect(() => {
    const loadLearningData = () => {
      try {
        // Load enrolled courses using progress manager
        const enrolled = CourseProgressManager.getEnrolledCourses();
        setEnrolledCourses(enrolled);

        // Calculate learning statistics using progress manager
        const stats = CourseProgressManager.getLearningStats();
        setLearningStats(stats);
      } catch (error) {
        console.error('Failed to load learning data:', error);
      }
    };

    loadLearningData();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup function
      try {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, []);

  const dashboardStats = [
    { label: 'Courses Enrolled', value: learningStats.totalCourses.toString(), icon: '📚', color: '#6366f1' },
    { label: 'Courses Completed', value: learningStats.completedCourses.toString(), icon: '✅', color: '#10b981' },
    { label: 'Hours Learned', value: Math.round(learningStats.totalHours).toString(), icon: '⏱️', color: '#f59e0b' },
    { label: 'Learning Streak', value: learningStats.currentStreak.toString(), icon: '🔥', color: '#ef4444' }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Complete React Hooks Assignment', due: 'Today', priority: 'high' },
    { id: 2, title: 'Practice Algorithm Problems', due: 'Tomorrow', priority: 'medium' },
    { id: 3, title: 'Review Database Design', due: 'This Week', priority: 'low' },
    { id: 4, title: 'Prepare for Mock Interview', due: 'Next Week', priority: 'high' }
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', icon: '', unlocked: true },
    { id: 2, title: '7-Day Streak Master', icon: '', unlocked: true },
    { id: 3, title: 'JavaScript Expert', icon: '', unlocked: true },
    { id: 4, title: 'AI Interview Pro', icon: '', unlocked: false }
  ];

  // Helper functions
  const isEnrolled = (courseId) => {
    return CourseProgressManager.isEnrolled(courseId);
  };

  const getProgress = (courseId) => {
    return CourseProgressManager.getCourseProgress(courseId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444'
    };
    return colors[difficulty?.toLowerCase()] || '#6b7280';
  };

  // Filter courses - exclude enrolled ones from recommendations
  const recommendedCourses = allCourses.filter(course => !isEnrolled(course.id)).slice(0, 6);
  const enrolledCoursesWithData = enrolledCourses.map(enrolled => {
    const fullCourse = allCourses.find(c => c.id === enrolled.id);
    return fullCourse ? { ...fullCourse, progress: getProgress(enrolled.id) } : null;
  }).filter(Boolean);

  // Loading state component
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="loading-text">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">
                Welcome back 👋 
              </h1>
              <p className="dashboard-subtitle">
                Pick up where you left off or explore new tracks.
              </p>
            </div>
            <div className="header-actions">
              <Link to="/interview-practice" className="btn btn-primary">
                <span className="floating-icon"></span>
                AI Interview
              </Link>
              <Link to="/learning" className="btn btn-secondary">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content" style={{ padding: '60px 24px' }}>
        {/* Main Content Grid - Recommended Courses and Continue Learning */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.3fr 1fr', 
          gap: 24, 
          alignItems: 'stretch' 
        }}>
          {/* Recommended Courses Section */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: 16, 
            padding: 24 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              margin: '0 0 16px 0',
              background: 'var(--gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Recommended for you</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 20 }}>Discover courses tailored to your learning goals</p>

            <CourseRecommendations showTitle={false} maxCourses={6} source="home" />

            {enrolledCoursesWithData.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '1.25rem',
                  background: 'var(--gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Continue Learning</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {enrolledCoursesWithData.map((c) => (
                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>{c.description}</div>
                      <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--muted)' }}>Progress {c.progress}%</div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                        <div style={{ width: `${c.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6C8CFF, #17D2C2)' }}></div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/learning/${c.slug || c.id}`} style={{ flex: 1, textAlign: 'center', padding: '10px 14px', background: 'linear-gradient(90deg, #6C8CFF, #17D2C2)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Continue</Link>
                        <Link to={`/learning/${c.slug || c.id}`} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Details</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar for stats and quick actions */}
          <div style={{ 
            position: 'sticky',
            top: 24,
            height: 'fit-content'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: 16, 
              padding: 24,
              marginBottom: 24
            }}>
              <h3 style={{ 
                margin: '0 0 16px', 
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Your Progress</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {dashboardStats.map((stat, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    padding: 12,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 10
                  }}>
                    <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stat.value}</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: 16, 
              padding: 24
            }}>
              <h3 style={{ 
                margin: '0 0 16px', 
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Quick Actions</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { path: '/learning', label: 'Browse Courses', icon: '📚' },
                  { path: '/interview-practice', label: 'AI Interview', icon: '🎯' },
                  { path: '/features', label: 'Features', icon: '✨' }
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{action.icon}</span>
                    <span style={{ fontWeight: '500' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MainHomePage;

