import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MainHomePage() {
  const [user] = useState({ name: 'John Doe', level: 'Intermediate', streak: 7 });
  const dashboardRef = useRef(null);

  useEffect(() => {
    let animationTimeout;
    let activeAnimations = [];

    const initializeAnimations = () => {
      try {
        // Clear any existing animations first
        gsap.killTweensOf("*");
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        if (!dashboardRef.current) return;

        // Wait for DOM to be fully rendered with longer delay
        animationTimeout = setTimeout(() => {
          if (!dashboardRef.current) return;

          // Robust element selection with existence checks
          const safeQuerySelector = (selector) => {
            try {
              const elements = dashboardRef.current.querySelectorAll(selector);
              return Array.from(elements).filter(el => el && el.parentNode);
            } catch (error) {
              console.warn(`Element selection failed for: ${selector}`, error);
              return [];
            }
          };

          const headerElement = dashboardRef.current.querySelector('.dashboard-header');
          const cardElements = safeQuerySelector('.dashboard-card');
          const floatingIcons = safeQuerySelector('.floating-icon');

          if (headerElement && headerElement.parentNode) {
            try {
              // Create main timeline with error handling
              const tl = gsap.timeline({ 
                defaults: { ease: 'power3.out' },
                onComplete: () => console.log('Main animation timeline completed'),
                onError: (error) => console.warn('Timeline error:', error)
              });
              
              // Animate header with typewriter effect
              const titleElement = headerElement.querySelector('.dashboard-title');
              const subtitleElement = headerElement.querySelector('.dashboard-subtitle');
              
              if (titleElement && titleElement.parentNode) {
                try {
                  const titleText = titleElement.textContent || titleElement.innerText || '';
                  if (titleText) {
                    titleElement.innerHTML = titleText.split('').map(char => 
                      char === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${char}</span>`
                    ).join('');
                    
                    const titleChars = safeQuerySelector('.dashboard-title .char');
                    
                    if (titleChars.length > 0) {
                      tl.fromTo(headerElement, 
                        { y: -30, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.8 }
                      )
                      .fromTo(titleChars, 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.03, stagger: 0.03 }, 
                        '-=0.4'
                      );
                    }
                  }
                } catch (error) {
                  console.warn('Title animation error:', error);
                }
              }

              if (subtitleElement && subtitleElement.parentNode) {
                try {
                  const subtitleText = subtitleElement.textContent || subtitleElement.innerText || '';
                  if (subtitleText) {
                    subtitleElement.innerHTML = subtitleText.split(' ').map(word => 
                      `<span class="word">${word}</span>`
                    ).join(' ');
                    
                    const subtitleWords = safeQuerySelector('.dashboard-subtitle .word');
                    
                    if (subtitleWords.length > 0) {
                      tl.fromTo(subtitleWords, 
                        { opacity: 0, y: 15, rotateX: -90 }, 
                        { opacity: 1, y: 0, rotateX: 0, duration: 0.4, stagger: 0.1 }, 
                        '-=0.2'
                      );
                    }
                  }
                } catch (error) {
                  console.warn('Subtitle animation error:', error);
                }
              }

              // Animate cards with enhanced effects
              if (cardElements.length > 0) {
                try {
                  tl.fromTo(cardElements, 
                    { y: 50, opacity: 0, scale: 0.9, rotateY: -15 }, 
                    { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.6, stagger: 0.1 }, 
                    '-=0.4'
                  );

                  // Animate text within cards safely
                  cardElements.forEach((card, index) => {
                    if (!card || !card.parentNode) return;
                    
                    try {
                      const cardTitle = card.querySelector('.card-title, .stat-value, .path-title');
                      const cardText = card.querySelector('.card-subtitle, .stat-label, .path-description');
                      
                      if (cardTitle && cardTitle.parentNode) {
                        const titleAnimation = gsap.fromTo(cardTitle, 
                          { opacity: 0, x: -20 }, 
                          { opacity: 1, x: 0, duration: 0.5, delay: 0.2 + (index * 0.1) }
                        );
                        activeAnimations.push(titleAnimation);
                      }
                      
                      if (cardText && cardText.parentNode) {
                        const textAnimation = gsap.fromTo(cardText, 
                          { opacity: 0, x: 20 }, 
                          { opacity: 1, x: 0, duration: 0.5, delay: 0.3 + (index * 0.1) }
                        );
                        activeAnimations.push(textAnimation);
                      }
                    } catch (error) {
                      console.warn(`Card animation error for card ${index}:`, error);
                    }
                  });
                } catch (error) {
                  console.warn('Card elements animation error:', error);
                }
              }

              activeAnimations.push(tl);
            } catch (error) {
              console.warn('Header animation error:', error);
            }
          }

          // Animate other elements safely
          try {
            const motivationTitle = dashboardRef.current?.querySelector('.motivation-title');
            const motivationMessage = dashboardRef.current?.querySelector('.motivation-message');
            
            if (motivationTitle && motivationTitle.parentNode) {
              const motivationText = motivationTitle.textContent || motivationTitle.innerText || '';
              if (motivationText) {
                motivationTitle.innerHTML = motivationText.split(' ').map(word => 
                  `<span class="motivation-word">${word}</span>`
                ).join(' ');
                
                const motivationWords = safeQuerySelector('.motivation-title .motivation-word');
                
                if (motivationWords.length > 0) {
                  const motivationAnimation = gsap.fromTo(motivationWords, 
                    { opacity: 0, scale: 0.8, y: 20 }, 
                    { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0, 
                      duration: 0.6, 
                      stagger: 0.15,
                      ease: 'back.out(1.7)',
                      delay: 1.5
                    }
                  );
                  activeAnimations.push(motivationAnimation);
                }
              }
            }

            if (motivationMessage && motivationMessage.parentNode) {
              const messageAnimation = gsap.fromTo(motivationMessage, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.8, delay: 2 }
              );
              activeAnimations.push(messageAnimation);
            }
          } catch (error) {
            console.warn('Motivation section animation error:', error);
          }

          // Enhanced floating animation for icons
          if (floatingIcons.length > 0) {
            try {
              const floatingAnimation1 = gsap.to(floatingIcons, {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                stagger: 0.3
              });

              const floatingAnimation2 = gsap.to(floatingIcons, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
                stagger: 2
              });

              activeAnimations.push(floatingAnimation1, floatingAnimation2);
            } catch (error) {
              console.warn('Floating icons animation error:', error);
            }
          }

          // Animate other elements with error handling
          try {
            const progressBars = safeQuerySelector('.progress-fill');
            progressBars.forEach((bar, index) => {
              if (!bar || !bar.parentNode) return;
              
              try {
                const width = bar.style.width || '0%';
                bar.style.width = '0%';
                
                const progressAnimation = gsap.to(bar, {
                  width: width,
                  duration: 1.5,
                  delay: 1 + (index * 0.2),
                  ease: 'power2.out'
                });
                activeAnimations.push(progressAnimation);
              } catch (error) {
                console.warn(`Progress bar animation error for bar ${index}:`, error);
              }
            });

            const taskItems = safeQuerySelector('.task-item');
            if (taskItems.length > 0) {
              const taskAnimation = gsap.fromTo(taskItems, 
                { opacity: 0, x: -30, rotateY: -15 }, 
                { 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 0, 
                  duration: 0.6, 
                  stagger: 0.1, 
                  delay: 1.2,
                  ease: 'back.out(1.2)'
                }
              );
              activeAnimations.push(taskAnimation);
            }

            const achievementItems = safeQuerySelector('.achievement-item');
            if (achievementItems.length > 0) {
              const achievementAnimation = gsap.fromTo(achievementItems, 
                { opacity: 0, scale: 0, rotation: -180 }, 
                { 
                  opacity: 1, 
                  scale: 1, 
                  rotation: 0, 
                  duration: 0.8, 
                  stagger: 0.15, 
                  delay: 1.5,
                  ease: 'back.out(2)'
                }
              );
              activeAnimations.push(achievementAnimation);
            }

            const actionButtons = safeQuerySelector('.btn');
            if (actionButtons.length > 0) {
              const buttonAnimation = gsap.to(actionButtons, {
                scale: 1.05,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                stagger: 0.5
              });
              activeAnimations.push(buttonAnimation);
            }
          } catch (error) {
            console.warn('Additional animations error:', error);
          }

        }, 200); // Increased delay for better reliability

      } catch (error) {
        console.error('Animation initialization error:', error);
      }
    };

    initializeAnimations();

    return () => {
      try {
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }
        
        // Kill all active animations
        activeAnimations.forEach(animation => {
          if (animation && typeof animation.kill === 'function') {
            animation.kill();
          }
        });
        
        // Clean up all GSAP animations
        gsap.killTweensOf("*");
        
        // Clean up ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
          }
        });
      } catch (error) {
        console.warn('Animation cleanup error:', error);
      }
    };
  }, []);

  const dashboardStats = [
    { label: 'Courses Completed', value: '12', icon: '', color: '#6366f1' },
    { label: 'Hours Learned', value: '48', icon: '', color: '#10b981' },
    { label: 'Current Streak', value: `${user.streak}`, icon: '', color: '#f59e0b' },
    { label: 'Skill Level', value: user.level, icon: '', color: '#ef4444' }
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Development',
      description: 'Master modern web development from frontend to backend',
      progress: 68,
      modules: 12,
      duration: '6 months',
      level: 'Intermediate',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: ''
    },
    {
      id: 2,
      title: 'AI & Machine Learning',
      description: 'Dive deep into artificial intelligence and ML algorithms',
      progress: 34,
      modules: 15,
      duration: '8 months',
      level: 'Advanced',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: ''
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      description: 'Learn data analysis, visualization, and statistical methods',
      progress: 89,
      modules: 10,
      duration: '4 months',
      level: 'Beginner',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: ''
    }
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

  return (
    <div ref={dashboardRef} className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">
                Good morning, {user.name}! 
              </h1>
              <p className="dashboard-subtitle">
                Ready to continue your learning journey? You're making great progress!
              </p>
            </div>
            <div className="header-actions">
              <Link to="/interview-practice" className="btn btn-primary">
                <span className="floating-icon"></span>
                Start AI Interview
              </Link>
              <Link to="/courses" className="btn btn-secondary">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="dashboard-card stat-card">
                <div className="stat-icon floating-icon" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Learning Paths */}
          <section className="learning-paths-section">
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Your Learning Paths</h2>
                <Link to="/courses" className="view-all-btn">View All</Link>
              </div>
              <div className="learning-paths">
                {learningPaths.map((path) => (
                  <div key={path.id} className="learning-path-item">
                    <div className="path-header">
                      <div className="path-icon" style={{ background: path.color }}>
                        {path.icon}
                      </div>
                      <div className="path-info">
                        <h3 className="path-title">{path.title}</h3>
                        <p className="path-description">{path.description}</p>
                      </div>
                    </div>
                    <div className="path-meta">
                      <div className="path-stats">
                        <span className="path-modules">{path.modules} modules</span>
                        <span className="path-duration">{path.duration}</span>
                        <span className={`path-level level-${path.level.toLowerCase()}`}>
                          {path.level}
                        </span>
                      </div>
                      <div className="path-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${path.progress}%`,
                              background: path.color
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{path.progress}%</span>
                      </div>
                    </div>
                    <button className="path-continue-btn">
                      {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar Content */}
          <aside className="dashboard-sidebar">
            {/* Upcoming Tasks */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Upcoming Tasks</h3>
                <span className="task-count">{upcomingTasks.length}</span>
              </div>
              <div className="tasks-list">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className={`task-priority priority-${task.priority}`}></div>
                    <div className="task-content">
                      <h4 className="task-title">{task.title}</h4>
                      <span className="task-due">Due: {task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/tasks" className="view-all-tasks">View All Tasks</Link>
            </div>

            {/* Achievements */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Achievements</h3>
                <span className="achievement-count">3/4</span>
              </div>
              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon floating-icon">
                      {achievement.icon}
                    </div>
                    <span className="achievement-title">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="quick-actions">
                <Link to="/interview-practice" className="quick-action-btn">
                  <span className="action-icon"></span>
                  Practice Interview
                </Link>
                <Link to="/assessment" className="quick-action-btn">
                  <span className="action-icon"></span>
                  Take Assessment
                </Link>
                <Link to="/progress" className="quick-action-btn">
                  <span className="action-icon"></span>
                  View Progress
                </Link>
                <Link to="/certificates" className="quick-action-btn">
                  <span className="action-icon"></span>
                  My Certificates
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Daily Motivation */}
        <section className="motivation-section">
          <div className="dashboard-card motivation-card">
            <div className="motivation-content">
              <div className="motivation-text">
                <h3 className="motivation-title">
                  <span className="floating-icon"></span>
                  Keep up the momentum!
                </h3>
                <p className="motivation-message">
                  You're on a {user.streak}-day learning streak! Complete today's lesson to keep it going.
                </p>
              </div>
              <div className="daily-progress">
                <div className="progress-circle">
                  <svg className="progress-ring" width="80" height="80">
                    <circle
                      className="progress-ring-background"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="transparent"
                      r="34"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className="progress-ring-progress"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      fill="transparent"
                      r="34"
                      cx="40"
                      cy="40"
                      strokeDasharray="213.6"
                      strokeDashoffset="64"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="progress-text">70%</div>
                </div>
                <div className="daily-goal">
                  <span className="goal-label">Daily Goal</span>
                  <span className="goal-status">2/3 lessons</span>
                </div>
              </div>
            </div>
            <button className="btn btn-gradient">
              Complete Next Lesson
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainHomePage;
