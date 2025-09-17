import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MainHomePage() {
  const [user] = useState({ name: 'John Doe', level: 'Intermediate', streak: 7 });
  const [isLoading, setIsLoading] = useState(false); // Set to false to show content immediately
  const dashboardRef = useRef(null);
  const animationsRef = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const initializeAnimations = () => {
      try {
        // Clear any existing animations and timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Kill existing animations safely
        animationsRef.current.forEach(animation => {
          if (animation && typeof animation.kill === 'function') {
            animation.kill();
          }
        });
        animationsRef.current = [];
        
        // Clear all GSAP animations
        gsap.killTweensOf("*");
        
        // Clear ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
          }
        });

        if (!dashboardRef.current) return;

        // Simulate loading time for professional feel
        setTimeout(() => setIsLoading(false), 800);

        // Wait for DOM to be fully rendered
        timeoutRef.current = setTimeout(() => {
          if (!dashboardRef.current) return;

          // Safe element selector with validation
          const safeQuerySelector = (selector) => {
            try {
              const container = dashboardRef.current;
              if (!container) return [];
              
              const elements = container.querySelectorAll(selector);
              return Array.from(elements).filter(el => {
                return el && 
                       el.parentNode && 
                       el.isConnected && 
                       document.contains(el);
              });
            } catch (error) {
              console.warn(`Safe selector failed for: ${selector}`, error);
              return [];
            }
          };

          // Validate single element
          const validateElement = (element) => {
            return element && 
                   element.parentNode && 
                   element.isConnected && 
                   document.contains(element);
          };

          // Create master timeline for coordinated animations
          const masterTL = gsap.timeline({ 
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              // Add subtle breathing animation to floating icons after main animations
              const floatingIcons = safeQuerySelector('.floating-icon');
              if (floatingIcons.length > 0) {
                const breathingAnim = gsap.to(floatingIcons, {
                  scale: 1.1,
                  duration: 2,
                  repeat: -1,
                  yoyo: true,
                  ease: 'sine.inOut',
                  stagger: 0.3
                });
                animationsRef.current.push(breathingAnim);
              }
            }
          });

          // 1. Header entrance with professional slide-down effect
          const headerElement = dashboardRef.current.querySelector('.dashboard-header');
          if (validateElement(headerElement)) {
            masterTL.fromTo(headerElement, 
              { y: -60, opacity: 0, rotateX: -15 }, 
              { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: 'back.out(1.7)' }
            );

            // Enhanced title animation with wave effect
            const titleElement = headerElement.querySelector('.dashboard-title');
            if (validateElement(titleElement)) {
              const titleText = titleElement.textContent || titleElement.innerText || '';
              if (titleText) {
                titleElement.innerHTML = titleText.split('').map((char, i) => 
                  char === ' ' ? '<span class="char" style="display:inline-block;">&nbsp;</span>' : 
                  `<span class="char" style="display:inline-block;">${char}</span>`
                ).join('');
                
                setTimeout(() => {
                  const titleChars = safeQuerySelector('.dashboard-title .char');
                  if (titleChars.length > 0) {
                    const waveAnim = masterTL.fromTo(titleChars, 
                      { opacity: 0, y: 30, rotateX: -90, scale: 0.8 }, 
                      { 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0, 
                        scale: 1,
                        duration: 0.8, 
                        stagger: 0.05,
                        ease: 'back.out(2)'
                      }, 
                      '-=0.8'
                    );
                    animationsRef.current.push(waveAnim);
                  }
                }, 100);
              }
            }

            // Subtitle with elegant fade-up
            const subtitleElement = headerElement.querySelector('.dashboard-subtitle');
            if (validateElement(subtitleElement)) {
              const subtitleAnim = masterTL.fromTo(subtitleElement, 
                { opacity: 0, y: 20, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 
                '-=0.6'
              );
              animationsRef.current.push(subtitleAnim);
            }

            // Header action buttons with stagger
            const actionButtons = safeQuerySelector('.header-actions .btn');
            if (actionButtons.length > 0) {
              const buttonsAnim = masterTL.fromTo(actionButtons, 
                { opacity: 0, y: 20, scale: 0.9 }, 
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 }, 
                '-=0.4'
              );
              animationsRef.current.push(buttonsAnim);
            }
          }

          // 2. Stats cards with professional cascade effect
          const cardElements = safeQuerySelector('.dashboard-card');
          if (cardElements.length > 0) {
            const validCards = cardElements.filter(validateElement);
            
            if (validCards.length > 0) {
              const cardsAnim = masterTL.fromTo(validCards, 
                { 
                  y: 80, 
                  opacity: 0, 
                  scale: 0.8, 
                  rotateY: -20,
                  transformOrigin: 'center bottom'
                }, 
                { 
                  y: 0, 
                  opacity: 1, 
                  scale: 1, 
                  rotateY: 0,
                  duration: 1,
                  stagger: 0.15,
                  ease: 'back.out(1.4)'
                },
                '-=0.8'
              );
              animationsRef.current.push(cardsAnim);

              // Add professional hover effects to cards
              validCards.forEach((card, index) => {
                if (!validateElement(card)) return;
                
                // Hover animations
                card.addEventListener('mouseenter', () => {
                  gsap.to(card, {
                    y: -8,
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                });

                card.addEventListener('mouseleave', () => {
                  gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                });

                // Animate card content
                const cardTitle = card.querySelector('.card-title, .stat-value, .path-title');
                const cardText = card.querySelector('.card-subtitle, .stat-label, .path-description');
                
                if (validateElement(cardTitle)) {
                  const titleAnimation = masterTL.fromTo(cardTitle, 
                    { opacity: 0, x: -30, rotateX: -15 }, 
                    { opacity: 1, x: 0, rotateX: 0, duration: 0.8, ease: 'back.out(1.7)' },
                    `-=${0.8 - (index * 0.1)}`
                  );
                  animationsRef.current.push(titleAnimation);
                }
                
                if (validateElement(cardText)) {
                  const textAnimation = masterTL.fromTo(cardText, 
                    { opacity: 0, x: 30, scale: 0.9 }, 
                    { opacity: 1, x: 0, scale: 1, duration: 0.6 },
                    `-=${0.6 - (index * 0.1)}`
                  );
                  animationsRef.current.push(textAnimation);
                }
              });
            }
          }

          // 3. Learning paths with sophisticated entrance
          const learningPaths = safeQuerySelector('.learning-path-item');
          if (learningPaths.length > 0) {
            const validPaths = learningPaths.filter(validateElement);
            
            if (validPaths.length > 0) {
              const pathsAnim = masterTL.fromTo(validPaths,
                {
                  opacity: 0,
                  x: -100,
                  rotateY: -25,
                  scale: 0.9
                },
                {
                  opacity: 1,
                  x: 0,
                  rotateY: 0,
                  scale: 1,
                  duration: 1.2,
                  stagger: 0.2,
                  ease: 'power3.out'
                },
                '-=0.6'
              );
              animationsRef.current.push(pathsAnim);

              // Add hover effects to learning paths
              validPaths.forEach(path => {
                path.addEventListener('mouseenter', () => {
                  gsap.to(path, {
                    scale: 1.03,
                    x: 10,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    duration: 0.4,
                    ease: 'power2.out'
                  });
                });

                path.addEventListener('mouseleave', () => {
                  gsap.to(path, {
                    scale: 1,
                    x: 0,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    duration: 0.4,
                    ease: 'power2.out'
                  });
                });
              });
            }
          }

          // 4. Progress bars with smooth fill animation
          const progressBars = safeQuerySelector('.progress-fill');
          progressBars.forEach((bar, index) => {
            if (!validateElement(bar)) return;
            
            const width = bar.style.width || '0%';
            bar.style.width = '0%';
            
            const progressAnimation = masterTL.to(bar, {
              width: width,
              duration: 2,
              delay: index * 0.3,
              ease: 'power2.out',
              onUpdate: function() {
                // Add shimmer effect during progress
                bar.style.background = `linear-gradient(90deg, 
                  var(--primary) 0%, 
                  rgba(255,255,255,0.3) 50%, 
                  var(--primary) 100%)`;
              },
              onComplete: function() {
                // Reset to original background
                bar.style.background = '';
              }
            }, '-=1.5');
            animationsRef.current.push(progressAnimation);
          });

          // 5. Sidebar content with elegant slide-in
          const sidebarCards = safeQuerySelector('.dashboard-sidebar .dashboard-card');
          if (sidebarCards.length > 0) {
            const validSidebarCards = sidebarCards.filter(validateElement);
            
            if (validSidebarCards.length > 0) {
              const sidebarAnim = masterTL.fromTo(validSidebarCards,
                {
                  opacity: 0,
                  x: 60,
                  scale: 0.95
                },
                {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: 'power2.out'
                },
                '-=1'
              );
              animationsRef.current.push(sidebarAnim);
            }
          }

          // 6. Task items with professional list animation
          const taskItems = safeQuerySelector('.task-item');
          if (taskItems.length > 0) {
            const validTasks = taskItems.filter(validateElement);
            if (validTasks.length > 0) {
              const taskAnimation = masterTL.fromTo(validTasks, 
                { opacity: 0, x: -40, scale: 0.95 }, 
                { 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  duration: 0.6, 
                  stagger: 0.08,
                  ease: 'back.out(1.2)'
                },
                '-=0.8'
              );
              animationsRef.current.push(taskAnimation);

              // Add click ripple effect
              validTasks.forEach(task => {
                task.addEventListener('click', (e) => {
                  const ripple = document.createElement('div');
                  ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.3);
                    pointer-events: none;
                    width: 0;
                    height: 0;
                    left: ${e.offsetX}px;
                    top: ${e.offsetY}px;
                    transform: translate(-50%, -50%);
                  `;
                  
                  task.style.position = 'relative';
                  task.appendChild(ripple);
                  
                  gsap.to(ripple, {
                    width: 100,
                    height: 100,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => ripple.remove()
                  });
                });
              });
            }
          }

          // 7. Achievement items with celebration effect
          const achievementItems = safeQuerySelector('.achievement-item');
          if (achievementItems.length > 0) {
            const validAchievements = achievementItems.filter(validateElement);
            if (validAchievements.length > 0) {
              const achievementAnimation = masterTL.fromTo(validAchievements, 
                { opacity: 0, scale: 0, rotation: -180 }, 
                { 
                  opacity: 1, 
                  scale: 1, 
                  rotation: 0, 
                  duration: 1,
                  stagger: 0.1,
                  ease: 'back.out(2.5)'
                },
                '-=0.6'
              );
              animationsRef.current.push(achievementAnimation);

              // Add unlock animation for achieved items
              validAchievements.forEach(achievement => {
                if (achievement.classList.contains('unlocked')) {
                  const icon = achievement.querySelector('.achievement-icon');
                  if (validateElement(icon)) {
                    const unlockAnim = gsap.to(icon, {
                      rotation: 360,
                      scale: 1.2,
                      duration: 0.8,
                      delay: Math.random() * 2,
                      repeat: -1,
                      repeatDelay: 5,
                      ease: 'power2.inOut'
                    });
                    animationsRef.current.push(unlockAnim);
                  }
                }
              });
            }
          }

          // 8. Motivation section with inspiring entrance
          const motivationCard = dashboardRef.current?.querySelector('.motivation-card');
          if (validateElement(motivationCard)) {
            const motivationAnim = masterTL.fromTo(motivationCard,
              {
                opacity: 0,
                y: 50,
                scale: 0.9,
                rotateX: -10
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.2,
                ease: 'power3.out'
              },
              '-=0.4'
            );
            animationsRef.current.push(motivationAnim);

            // Animate progress circle
            const progressRing = motivationCard.querySelector('.progress-ring-progress');
            if (validateElement(progressRing)) {
              const circumference = 2 * Math.PI * 34; // radius = 34
              progressRing.style.strokeDasharray = circumference;
              progressRing.style.strokeDashoffset = circumference;
              
              const ringAnim = masterTL.to(progressRing, {
                strokeDashoffset: circumference * 0.3, // 70% progress
                duration: 2,
                ease: 'power2.out'
              }, '-=0.8');
              animationsRef.current.push(ringAnim);
            }
          }

          // 9. Add subtle parallax effect on scroll
          ScrollTrigger.create({
            trigger: dashboardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
              const cards = safeQuerySelector('.dashboard-card');
              cards.forEach((card, index) => {
                if (validateElement(card)) {
                  gsap.to(card, {
                    y: self.progress * (index % 2 === 0 ? -20 : 20),
                    duration: 0.3,
                    ease: 'none'
                  });
                }
              });
            }
          });

          animationsRef.current.push(masterTL);

        }, 400); // Increased delay for better reliability

      } catch (error) {
        console.error('Animation initialization error:', error);
      }
    };

    initializeAnimations();

    return () => {
      try {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Kill all tracked animations
        animationsRef.current.forEach(animation => {
          if (animation && typeof animation.kill === 'function') {
            animation.kill();
          }
        });
        animationsRef.current = [];
        
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
