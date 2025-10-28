import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import CourseProgressManager from '../utils/courseProgress';

const CourseRecommendations = ({ showTitle = true, maxCourses = 6, source = 'home' }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  // Load enrolled courses and progress from localStorage
  useEffect(() => {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    setEnrolledCourses(enrolled);
    setUserProgress(progress);
  }, []);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/learning/courses');
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Fallback to static courses if API fails
        setCourses(getFallbackCourses());
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fallback courses if API is not available
  const getFallbackCourses = () => [
      {
        id: 'web-basics',
        title: 'Web Development Fundamentals',
      description: 'Master HTML, CSS, and JavaScript for modern web development',
        duration: '8 weeks',
        difficulty: 'Beginner',
      instructor: 'Sarah Johnson',
      price: 'Free',
        rating: 4.8,
        students: 15420,
      thumbnail: '/api/placeholder/300/200',
      domain: 'web-development',
      isRecommended: true
      },
      {
        id: 'react-fundamentals',
        title: 'React.js for Beginners',
      description: 'Learn component-based UI development with React',
        duration: '6 weeks',
        difficulty: 'Beginner',
      instructor: 'Mike Chen',
      price: '$49',
        rating: 4.7,
        students: 12350,
      thumbnail: '/api/placeholder/300/200',
      domain: 'web-development',
      isRecommended: true
    },
    {
      id: 'backend-basics',
      title: 'Backend Development Fundamentals',
      description: 'Node.js and Express API development with databases',
      duration: '10 weeks',
      difficulty: 'Beginner',
      instructor: 'Alex Thompson',
      price: 'Free',
      rating: 4.8,
      students: 13250,
      thumbnail: '/api/placeholder/300/200',
      domain: 'backend-development',
      isRecommended: true
    },
      {
        id: 'ml-basics',
        title: 'Machine Learning Fundamentals',
      description: 'Python, NumPy, Pandas, and scikit-learn basics',
        duration: '10 weeks',
        difficulty: 'Beginner',
      instructor: 'Dr. Anna Patel',
      price: 'Free',
        rating: 4.8,
        students: 18750,
      thumbnail: '/api/placeholder/300/200',
      domain: 'machine-learning',
      isRecommended: true
    },
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      description: 'Core Python concepts: syntax, variables, types, and functions',
      duration: '6 weeks',
        difficulty: 'Beginner',
      instructor: 'Priya Sharma',
        price: 'Free',
        rating: 4.9,
      students: 22500,
      thumbnail: '/api/placeholder/300/200',
      domain: 'programming',
      isRecommended: true
    },
      {
        id: 'fullstack-basics',
        title: 'Full Stack Development Bootcamp',
      description: 'Complete web development with React, Node.js, and databases',
        duration: '16 weeks',
      difficulty: 'Intermediate',
        instructor: 'Jessica Williams',
        price: '$299',
        rating: 4.9,
      students: 11200,
      thumbnail: '/api/placeholder/300/200',
      domain: 'fullstack-development',
      isRecommended: true
    }
  ];

  const isEnrolled = (courseId) => {
    return CourseProgressManager.isEnrolled(courseId);
  };

  const getProgress = (courseId) => {
    return CourseProgressManager.getCourseProgress(courseId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const handleEnroll = (course) => {
    const success = CourseProgressManager.enrollInCourse(course);
    if (success) {
      // Refresh the enrolled courses and progress
      setEnrolledCourses(CourseProgressManager.getEnrolledCourses());
      setUserProgress(CourseProgressManager.getAllProgress());
    }
  };

  const handleContinue = (course) => {
    const slugOrId = course.slug || course.id;
    navigate(`/learning/${slugOrId}`);
  };

  // Filter and limit courses
  const displayCourses = courses.slice(0, maxCourses);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          width: '40px', 
          height: '40px', 
          border: '4px solid rgba(108,140,255,0.3)', 
          borderTop: '4px solid #6C8CFF', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p style={{ marginTop: '12px', color: 'var(--muted)' }}>Loading courses...</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      {showTitle && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: '700',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {source === 'home' ? 'Recommended Courses' : 'Available Courses'}
        </h2>
          <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
            {source === 'home' 
              ? 'Start your learning journey with these handpicked courses' 
              : 'Explore all available courses and continue your learning'}
        </p>
      </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px' 
      }}>
        {displayCourses.map((course) => {
          const enrolled = isEnrolled(course.id);
          const progress = getProgress(course.id);
          
          return (
          <div
            key={course.id}
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '16px', 
                padding: '20px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 8px 32px rgba(108,140,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {/* Course Thumbnail */}
              <div style={{ 
                width: '100%', 
                height: '160px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '12px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {course.title.charAt(0)}
              </div>
              
              {/* Course Info */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  lineHeight: '1.3'
                }}>
                  {course.title}
                </h3>
                <p style={{ 
                  margin: '0 0 12px 0', 
                  color: 'var(--muted)', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {course.description}
                </p>
                
                {/* Course Meta */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px', 
                  marginBottom: '12px' 
                }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    background: 'rgba(108,140,255,0.1)', 
                    color: '#6C8CFF', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {course.duration}
                  </span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: getDifficultyColor(course.difficulty), 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                  {course.difficulty}
                </span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'var(--text)', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ⭐ {course.rating || '4.8'}
                  </span>
              </div>
              
                {/* Progress Bar for Enrolled Courses */}
                {enrolled && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '4px',
                      fontSize: '12px',
                      color: 'var(--muted)'
                    }}>
                      <span>Progress</span>
                      <span>{progress}%</span>
                </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #6C8CFF, #17D2C2)',
                        transition: 'width 0.3s ease'
                      }}></div>
                </div>
              </div>
                )}
            </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {enrolled ? (
                  <>
                    <button
                      onClick={() => handleContinue(course)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: 'linear-gradient(90deg, #6C8CFF, #17D2C2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {progress > 0 ? 'Continue' : 'Start Learning'}
                    </button>
                    <Link
                      to={`/learning/${course.slug || course.id}`}
                      style={{
                        padding: '10px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'var(--text)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}
                    >
                      View Details
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEnroll(course)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: 'linear-gradient(90deg, #6C8CFF, #17D2C2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {course.price ? (course.price === 'Free' ? 'Enroll Free' : `Enroll - ${course.price}`) : 'Enroll'}
                    </button>
                    <Link
                      to={`/learning/${course.slug || course.id}`}
                      style={{
                        padding: '10px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'var(--text)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}
                    >
                      Preview
                    </Link>
                  </>
                )}
              </div>

              {/* Recommended Badge */}
              {course.isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(90deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  Recommended
                  </div>
                )}
                </div>
          );
        })}
            </div>

      {/* View All Courses Link */}
      {source === 'home' && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/learning"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'rgba(108,140,255,0.1)',
              color: '#6C8CFF',
              border: '1px solid rgba(108,140,255,0.3)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(108,140,255,0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(108,140,255,0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View All Courses →
          </Link>
            </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CourseRecommendations;