import React from 'react';
import { Link } from 'react-router-dom';
import CourseRecommendations from '../components/CourseRecommendations';

export default function LearningBrowse() {

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

  // Check if user has skipped domain selection
  const hasSkippedDomainSelection = () => {
    try {
      return localStorage.getItem('ace.domainSelectionSkipped') === 'true';
    } catch {
      return false;
    }
  };

  // All courses are rendered by CourseRecommendations from /api/learning/courses

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1>Learning Library</h1>
      <p className="muted">Browse engineering topics and courses</p>

      {/* Domain Selection Prompt */}
      {!hasCompletedDomainSelection() && !hasSkippedDomainSelection() && (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🎯 Get Personalized Recommendations</h3>
          <p style={{ margin: '0 0 16px 0', opacity: 0.9 }}>
            Tell us about your interests and experience level to get course recommendations tailored just for you.
          </p>
          <Link 
            to="/domain-selection" 
            style={{ 
              background: 'white', 
              color: '#667eea', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600',
              display: 'inline-block',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Choose Your Domain
          </Link>
        </div>
      )}

      {/* Course Recommendations (admin-backed) */}
      <CourseRecommendations source="learning" maxCourses={12} />
    </div>
  );
}
