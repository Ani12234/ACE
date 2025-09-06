import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CourseDetail = ({ course, onEnroll, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const courseRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if user is already enrolled
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.some(c => c.id === course.id));

    // Initialize animations
    if (courseRef.current && headerRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Animate course modules
      const modules = courseRef.current.querySelectorAll('.module-item');
      if (modules.length > 0) {
        gsap.fromTo(modules,
          { opacity: 0, x: -30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.5, 
            stagger: 0.1,
            scrollTrigger: {
              trigger: modules[0],
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [course.id]);

  const handleEnroll = () => {
    if (!isEnrolled) {
      // Simulate enrollment process
      setEnrollmentProgress(0);
      const interval = setInterval(() => {
        setEnrollmentProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsEnrolled(true);
            
            // Save to localStorage
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            enrolledCourses.push({
              ...course,
              enrolledAt: new Date().toISOString(),
              progress: 0
            });
            localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
            
            if (onEnroll) onEnroll(course);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content overview-content">
            <div className="course-description">
              <h3>About This Course</h3>
              <p>{course.description}</p>
              
              <div className="course-highlights">
                <h4>What You'll Learn</h4>
                <ul className="skills-list">
                  {course.skills?.map((skill, index) => (
                    <li key={index} className="skill-item">
                      <span className="skill-icon">✓</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="course-requirements">
                <h4>Prerequisites</h4>
                <ul className="requirements-list">
                  <li>Basic understanding of programming concepts</li>
                  <li>Access to a computer with internet connection</li>
                  <li>Willingness to learn and practice</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'curriculum':
        return (
          <div className="tab-content curriculum-content">
            <div className="curriculum-header">
              <h3>Course Curriculum</h3>
              <p>{course.modules?.length || 8} modules • {course.hours} hours total</p>
            </div>
            
            <div className="modules-list">
              {(course.modules || [
                "Introduction and Setup",
                "Core Concepts",
                "Practical Applications",
                "Advanced Techniques",
                "Project Development",
                "Testing and Debugging",
                "Deployment Strategies",
                "Final Project"
              ]).map((module, index) => (
                <div key={index} className="module-item">
                  <div className="module-header">
                    <div className="module-number">{index + 1}</div>
                    <div className="module-info">
                      <h4 className="module-title">{module}</h4>
                      <p className="module-duration">
                        {Math.ceil(course.hours / 8)} hours • 
                        {Math.floor(Math.random() * 5) + 3} lessons
                      </p>
                    </div>
                    <div className="module-status">
                      {isEnrolled ? (
                        <span className="status-badge available">Available</span>
                      ) : (
                        <span className="status-badge locked">🔒</span>
                      )}
                    </div>
                  </div>
                  
                  {isEnrolled && (
                    <div className="module-lessons">
                      <div className="lesson-item">
                        <span className="lesson-icon">▶️</span>
                        <span className="lesson-title">Introduction Video</span>
                        <span className="lesson-duration">15 min</span>
                      </div>
                      <div className="lesson-item">
                        <span className="lesson-icon">📖</span>
                        <span className="lesson-title">Reading Material</span>
                        <span className="lesson-duration">20 min</span>
                      </div>
                      <div className="lesson-item">
                        <span className="lesson-icon">💻</span>
                        <span className="lesson-title">Hands-on Exercise</span>
                        <span className="lesson-duration">45 min</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="tab-content instructor-content">
            <div className="instructor-profile">
              <div className="instructor-avatar">
                <div className="avatar-placeholder">
                  {course.instructor?.charAt(0) || 'I'}
                </div>
              </div>
              <div className="instructor-info">
                <h3>{course.instructor || 'Expert Instructor'}</h3>
                <p className="instructor-title">Senior Software Engineer & Educator</p>
                <div className="instructor-stats">
                  <div className="stat-item">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">15</span>
                    <span className="stat-label">Courses</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="instructor-bio">
              <h4>About the Instructor</h4>
              <p>
                With over 10 years of industry experience and a passion for teaching, 
                our instructor brings real-world expertise to every lesson. They have 
                worked with leading tech companies and have helped thousands of students 
                achieve their career goals.
              </p>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="tab-content reviews-content">
            <div className="reviews-summary">
              <div className="rating-overview">
                <div className="overall-rating">
                  <span className="rating-number">{course.rating || 4.8}</span>
                  <div className="stars">
                    {'★'.repeat(Math.floor(course.rating || 4.8))}
                    {'☆'.repeat(5 - Math.floor(course.rating || 4.8))}
                  </div>
                  <span className="rating-count">({course.students || 1234} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="reviews-list">
              {[
                {
                  name: "Sarah Johnson",
                  rating: 5,
                  comment: "Excellent course! The instructor explains complex concepts in a very clear way.",
                  date: "2 weeks ago"
                },
                {
                  name: "Mike Chen",
                  rating: 4,
                  comment: "Great practical examples and hands-on projects. Really helped me understand the material.",
                  date: "1 month ago"
                },
                {
                  name: "Emily Davis",
                  rating: 5,
                  comment: "This course exceeded my expectations. The content is up-to-date and relevant.",
                  date: "1 month ago"
                }
              ].map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="reviewer-name">{review.name}</h5>
                        <div className="review-rating">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="course-detail" ref={courseRef}>
      <div className="course-header" ref={headerRef}>
        <button className="back-btn" onClick={onBack}>
          ← Back to Courses
        </button>
        
        <div className="course-hero">
          <div className="course-info">
            <div className="course-badges">
              <span className={`difficulty-badge ${course.difficulty?.toLowerCase()}`}>
                {course.difficulty || 'Intermediate'}
              </span>
              {course.premium && <span className="premium-badge">Premium</span>}
            </div>
            
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>
            
            <div className="course-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{course.hours} hours</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <span>{course.students || 1234} students</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⭐</span>
                <span>{course.rating || 4.8} rating</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🏆</span>
                <span>Certificate included</span>
              </div>
            </div>
          </div>
          
          <div className="course-actions">
            <div className="price-section">
              {course.premium ? (
                <div className="price-info">
                  <span className="current-price">${course.price || 99}</span>
                  <span className="original-price">${(course.price || 99) * 1.5}</span>
                </div>
              ) : (
                <div className="price-info">
                  <span className="free-badge">Free</span>
                </div>
              )}
            </div>
            
            <button 
              className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
              onClick={handleEnroll}
              disabled={enrollmentProgress > 0 && enrollmentProgress < 100}
            >
              {enrollmentProgress > 0 && enrollmentProgress < 100 ? (
                <div className="enrollment-progress">
                  <span>Enrolling... {enrollmentProgress}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${enrollmentProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : isEnrolled ? (
                <>
                  <span className="enrolled-icon">✓</span>
                  Continue Learning
                </>
              ) : (
                <>
                  <span className="enroll-icon">🚀</span>
                  Enroll Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="course-content" ref={contentRef}>
        <div className="course-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
