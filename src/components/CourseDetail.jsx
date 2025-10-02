import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Simulated course data - in a real app, this would come from an API
  const courseData = {
    'web-basics': {
      id: 'web-basics',
      title: 'Web Development Fundamentals',
      description: 'Master the essential building blocks of modern web development.',
      duration: '8 weeks',
      difficulty: 'Beginner',
      instructor: 'Sarah Johnson',
      price: 'Free'
    },
    'react-fundamentals': {
      id: 'react-fundamentals',
      title: 'React.js for Beginners',
      description: 'Dive into the world of modern frontend development with React.js.',
      duration: '6 weeks',
      difficulty: 'Beginner',
      instructor: 'Mike Chen',
      price: '$49'
    }
  };
  
  const course = courseData[courseId] || {
    id: 'not-found',
    title: 'Course Not Found',
    description: 'The requested course could not be found.'
  };

  useEffect(() => {
    // Check if user is already enrolled
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.some(c => c.id === course.id));
  }, [course.id]);
  
  const handleEnroll = () => {
    setIsEnrolled(true);
    // Save enrollment status
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.some(c => c.id === course.id)) {
      enrolledCourses.push(course);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
  };
  
  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <Link 
        to="/courses"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '20px',
          color: 'rgba(255, 255, 255, 0.7)',
          textDecoration: 'none',
          fontSize: '16px'
        }}
      >
        ← Back to Courses
      </Link>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>{course.title}</h1>
        
        <p style={{ 
          fontSize: '18px', 
          lineHeight: '1.6',
          marginBottom: '25px' 
        }}>{course.description}</p>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '25px'
        }}>
          {course.difficulty && (
            <span style={{ 
              padding: '8px 16px',
              background: 'rgba(108, 140, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              {course.difficulty}
            </span>
          )}
          
          {course.duration && (
            <span style={{ 
              padding: '8px 16px',
              background: 'rgba(108, 140, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              {course.duration}
            </span>
          )}
          
          {course.price && (
            <span style={{ 
              padding: '8px 16px',
              background: 'rgba(108, 140, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              {course.price}
            </span>
          )}
        </div>
        
        {course.instructor && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '18px',
              marginBottom: '5px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>Instructor</h3>
            <p>{course.instructor}</p>
          </div>
        )}
        
        <button 
          onClick={handleEnroll}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: isEnrolled ? 'rgba(108, 140, 255, 0.3)' : 'var(--gradient)',
            borderRadius: '8px',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
