import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

function MainHomePage() {
  const [user] = useState({ name: 'John Doe', level: 'Intermediate', streak: 7 });
  const [progress] = useState({ completed: 65, total: 100 });
  const dashboardRef = useRef(null);
  const cardsRef = useRef([]);

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Animate dashboard elements on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(
      '.welcome-section',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      '.stats-grid > *',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    )
    .fromTo(
      cardsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
      '-=0.3'
    );
  }, []);

  const learningModules = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming',
      progress: 75,
      duration: '4 hours',
      difficulty: 'Beginner',
      color: '#6c8cff'
    },
    {
      id: 2,
      title: 'React Development',
      description: 'Build modern web applications with React',
      progress: 45,
      duration: '6 hours',
      difficulty: 'Intermediate',
      color: '#17d2c2'
    },
    {
      id: 3,
      title: 'Node.js Backend',
      description: 'Create scalable server-side applications',
      progress: 20,
      duration: '8 hours',
      difficulty: 'Advanced',
      color: '#ff6b6b'
    },
    {
      id: 4,
      title: 'AI Interview Prep',
      description: 'Practice technical interviews with AI proctor',
      progress: 0,
      duration: '3 hours',
      difficulty: 'All Levels',
      color: '#ffd93d'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Completed', item: 'JavaScript Arrays & Objects', time: '2 hours ago' },
    { id: 2, action: 'Started', item: 'React Hooks Deep Dive', time: '1 day ago' },
    { id: 3, action: 'Practiced', item: 'Mock Interview Session', time: '2 days ago' },
    { id: 4, action: 'Achieved', item: '7-day learning streak!', time: '3 days ago' }
  ];

  return (
    <div ref={dashboardRef} className="main-dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-header">
            <div>
              <h1 className="welcome-title">Welcome back, {user.name}! 👋</h1>
              <p className="welcome-subtitle">Ready to continue your learning journey?</p>
            </div>
            <div className="quick-actions">
              <button className="btn btnPrimary">Start Learning</button>
              <button className="btn btnGhost">Take Assessment</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6c8cff, #5576ff)' }}>
                📚
              </div>
              <div className="stat-content">
                <h3>{progress.completed}%</h3>
                <p>Overall Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #17d2c2, #14b8a6)' }}>
                🔥
              </div>
              <div className="stat-content">
                <h3>{user.streak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ef4444)' }}>
                🎯
              </div>
              <div className="stat-content">
                <h3>{user.level}</h3>
                <p>Current Level</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffd93d, #f59e0b)' }}>
                ⭐
              </div>
              <div className="stat-content">
                <h3>1,250</h3>
                <p>XP Points</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="modules-section">
        <div className="container">
          <div className="section-header">
            <h2>Continue Learning</h2>
            <Link to="/all-courses" className="view-all-link">View All Courses →</Link>
          </div>
          <div className="modules-grid">
            {learningModules.map((module) => (
              <div key={module.id} ref={addToCardsRef} className="module-card">
                <div className="module-header">
                  <div className="module-icon" style={{ backgroundColor: module.color }}>
                    {module.title.charAt(0)}
                  </div>
                  <div className="module-meta">
                    <span className="difficulty-badge">{module.difficulty}</span>
                    <span className="duration">{module.duration}</span>
                  </div>
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${module.progress}%`,
                        backgroundColor: module.color 
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{module.progress}% Complete</span>
                </div>
                <button className="module-btn">
                  {module.progress > 0 ? 'Continue' : 'Start Course'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity & Quick Access */}
      <section className="activity-section">
        <div className="container">
          <div className="activity-grid">
            {/* Recent Activity */}
            <div ref={addToCardsRef} className="activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p>
                        <span className="activity-action">{activity.action}</span> {activity.item}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div ref={addToCardsRef} className="quick-access-card">
              <h3>Quick Access</h3>
              <div className="quick-actions-grid">
                <Link to="/practice" className="quick-action">
                  <div className="quick-icon">🎯</div>
                  <span>Practice Tests</span>
                </Link>
                <Link to="/interview" className="quick-action">
                  <div className="quick-icon">🤖</div>
                  <span>AI Interview</span>
                </Link>
                <Link to="/progress" className="quick-action">
                  <div className="quick-icon">📊</div>
                  <span>Progress Report</span>
                </Link>
                <Link to="/certificates" className="quick-action">
                  <div className="quick-icon">🏆</div>
                  <span>Certificates</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="motivation-section">
        <div className="container">
          <div ref={addToCardsRef} className="motivation-card">
            <div className="motivation-content">
              <h3>🚀 Keep Going!</h3>
              <p>You're doing great! Complete one more lesson today to maintain your streak.</p>
              <div className="motivation-progress">
                <div className="daily-goal">
                  <span>Daily Goal: 2/3 lessons</span>
                  <div className="goal-bar">
                    <div className="goal-fill" style={{ width: '66%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btnPrimary">Complete Next Lesson</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainHomePage;
