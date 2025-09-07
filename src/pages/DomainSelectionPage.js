import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DomainSelectionPage = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [step, setStep] = useState(1); // 1: domain selection, 2: course details, 3: experience level
  const navigate = useNavigate();

  const domains = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Build modern, responsive websites and web applications using HTML, CSS, JavaScript, and popular frameworks like React.',
      icon: '🌐',
      color: '#3b82f6',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
      careerPaths: ['Frontend Developer', 'UI/UX Developer', 'Web Designer'],
      averageSalary: '$75,000',
      courses: [
        {
          id: 'web-fundamentals',
          title: 'Web Development Fundamentals',
          description: 'Master the essential building blocks of modern web development. Learn HTML5 for semantic structure, CSS3 for stunning designs, and JavaScript for interactive functionality.',
          duration: '120 hours',
          weeks: '8 weeks',
          level: 'Beginner',
          videos: [
            { title: 'HTML5 Semantic Elements', duration: '15 min', thumbnail: '🎥' },
            { title: 'CSS Grid & Flexbox Mastery', duration: '22 min', thumbnail: '🎥' },
            { title: 'JavaScript DOM Manipulation', duration: '18 min', thumbnail: '🎥' },
            { title: 'Responsive Design Principles', duration: '20 min', thumbnail: '🎥' }
          ]
        },
        {
          id: 'react-advanced',
          title: 'Advanced React Development',
          description: 'Build complex, scalable React applications with hooks, context, state management, and modern development practices.',
          duration: '80 hours',
          weeks: '6 weeks',
          level: 'Intermediate',
          videos: [
            { title: 'React Hooks Deep Dive', duration: '25 min', thumbnail: '🎥' },
            { title: 'State Management with Redux', duration: '30 min', thumbnail: '🎥' },
            { title: 'React Performance Optimization', duration: '20 min', thumbnail: '🎥' },
            { title: 'Testing React Applications', duration: '18 min', thumbnail: '🎥' }
          ]
        }
      ]
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      description: 'Dive into AI and data science. Learn algorithms, neural networks, and build intelligent systems that can learn and make predictions.',
      icon: '🤖',
      color: '#10b981',
      skills: ['Python', 'TensorFlow', 'Statistics', 'Data Analysis'],
      careerPaths: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
      averageSalary: '$120,000',
      courses: [
        {
          id: 'ml-fundamentals',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning concepts, algorithms, and practical implementation using Python and popular ML libraries.',
          duration: '150 hours',
          weeks: '10 weeks',
          level: 'Beginner',
          videos: [
            { title: 'Introduction to Machine Learning', duration: '20 min', thumbnail: '🎥' },
            { title: 'Linear Regression & Classification', duration: '28 min', thumbnail: '🎥' },
            { title: 'Neural Networks Basics', duration: '25 min', thumbnail: '🎥' },
            { title: 'Model Evaluation & Validation', duration: '22 min', thumbnail: '🎥' }
          ]
        },
        {
          id: 'deep-learning',
          title: 'Deep Learning with TensorFlow',
          description: 'Advanced deep learning techniques using TensorFlow and Keras for computer vision, NLP, and complex AI applications.',
          duration: '200 hours',
          weeks: '12 weeks',
          level: 'Advanced',
          videos: [
            { title: 'Deep Neural Networks', duration: '35 min', thumbnail: '🎥' },
            { title: 'Convolutional Neural Networks', duration: '40 min', thumbnail: '🎥' },
            { title: 'Recurrent Neural Networks', duration: '32 min', thumbnail: '🎥' },
            { title: 'Transfer Learning & Fine-tuning', duration: '28 min', thumbnail: '🎥' }
          ]
        }
      ]
    },
    {
      id: 'backend-development',
      title: 'Backend Development',
      description: 'Master server-side programming, databases, APIs, and cloud infrastructure. Build the backbone that powers web applications.',
      icon: '⚙️',
      color: '#8b5cf6',
      skills: ['Node.js', 'Databases', 'APIs', 'Cloud Services'],
      careerPaths: ['Backend Developer', 'DevOps Engineer', 'System Architect'],
      averageSalary: '$95,000',
      courses: [
        {
          id: 'backend-fundamentals',
          title: 'Backend Development Fundamentals',
          description: 'Learn server-side programming with Node.js, database design, RESTful APIs, and authentication systems.',
          duration: '100 hours',
          weeks: '8 weeks',
          level: 'Beginner',
          videos: [
            { title: 'Node.js & Express Setup', duration: '18 min', thumbnail: '🎥' },
            { title: 'Database Design & MongoDB', duration: '25 min', thumbnail: '🎥' },
            { title: 'RESTful API Development', duration: '30 min', thumbnail: '🎥' },
            { title: 'Authentication & Security', duration: '22 min', thumbnail: '🎥' }
          ]
        },
        {
          id: 'microservices',
          title: 'Microservices Architecture',
          description: 'Design and implement scalable microservices using Docker, Kubernetes, and cloud-native technologies.',
          duration: '120 hours',
          weeks: '10 weeks',
          level: 'Advanced',
          videos: [
            { title: 'Microservices Design Patterns', duration: '28 min', thumbnail: '🎥' },
            { title: 'Docker & Containerization', duration: '25 min', thumbnail: '🎥' },
            { title: 'Kubernetes Orchestration', duration: '35 min', thumbnail: '🎥' },
            { title: 'API Gateway & Service Mesh', duration: '30 min', thumbnail: '🎥' }
          ]
        }
      ]
    },
    {
      id: 'fullstack-development',
      title: 'Full Stack Development',
      description: 'Become a complete developer mastering both frontend and backend technologies. Build end-to-end web applications.',
      icon: '🚀',
      color: '#f59e0b',
      skills: ['Frontend', 'Backend', 'Databases', 'DevOps'],
      careerPaths: ['Full Stack Developer', 'Technical Lead', 'Product Engineer'],
      averageSalary: '$110,000',
      courses: [
        {
          id: 'fullstack-bootcamp',
          title: 'Full Stack Development Bootcamp',
          description: 'Complete full stack development course covering React, Node.js, databases, and deployment strategies.',
          duration: '180 hours',
          weeks: '12 weeks',
          level: 'Intermediate',
          videos: [
            { title: 'Full Stack Architecture Overview', duration: '20 min', thumbnail: '🎥' },
            { title: 'Frontend-Backend Integration', duration: '30 min', thumbnail: '🎥' },
            { title: 'Database Integration & ORMs', duration: '25 min', thumbnail: '🎥' },
            { title: 'Deployment & DevOps Basics', duration: '28 min', thumbnail: '🎥' }
          ]
        }
      ]
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Extract insights from data and make data-driven decisions',
      icon: '📊',
      color: '#06b6d4',
      skills: ['Python/R', 'Statistics', 'Data Visualization', 'SQL', 'Business Intelligence'],
      careerPaths: ['Data Scientist', 'Data Analyst', 'Business Intelligence Developer'],
      averageSalary: '$90,000 - $135,000',
      courses: [
        {
          id: 'data-science-fundamentals',
          title: 'Data Science Fundamentals',
          description: 'Learn data analysis, visualization, and statistical modeling using Python, pandas, and popular data science libraries.',
          duration: '140 hours',
          weeks: '10 weeks',
          level: 'Beginner',
          videos: [
            { title: 'Data Analysis with Pandas', duration: '25 min', thumbnail: '🎥' },
            { title: 'Data Visualization with Matplotlib', duration: '20 min', thumbnail: '🎥' },
            { title: 'Statistical Analysis & Hypothesis Testing', duration: '30 min', thumbnail: '🎥' },
            { title: 'SQL for Data Science', duration: '22 min', thumbnail: '🎥' }
          ]
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect systems and data from digital threats and attacks',
      icon: '🔒',
      color: '#ef4444',
      skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response'],
      careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Architect'],
      averageSalary: '$85,000 - $140,000',
      courses: [
        {
          id: 'cybersecurity-fundamentals',
          title: 'Cybersecurity Fundamentals',
          description: 'Learn network security, ethical hacking techniques, risk assessment, and incident response procedures.',
          duration: '160 hours',
          weeks: '12 weeks',
          level: 'Beginner',
          videos: [
            { title: 'Network Security Basics', duration: '25 min', thumbnail: '🎥' },
            { title: 'Ethical Hacking & Penetration Testing', duration: '35 min', thumbnail: '🎥' },
            { title: 'Risk Assessment & Management', duration: '20 min', thumbnail: '🎥' },
            { title: 'Incident Response & Forensics', duration: '30 min', thumbnail: '🎥' }
          ]
        }
      ]
    }
  ];

  const experienceLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to programming and technology',
      icon: '🌱',
      duration: '6-12 months',
      commitment: '10-15 hours/week'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Some programming experience',
      icon: '🌿',
      duration: '4-8 months',
      commitment: '15-20 hours/week'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Experienced developer looking to specialize',
      icon: '🌳',
      duration: '2-4 months',
      commitment: '20+ hours/week'
    }
  ];

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setStep(2);
  };

  const handleContinueToExperience = () => {
    setStep(3);
  };

  const handleExperienceSelect = (experience) => {
    // Store selections in localStorage
    const userPreferences = {
      domain: selectedDomain,
      experience: experience,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userDomainSelection', JSON.stringify(userPreferences));
    
    // Navigate to course recommendations
    navigate('/course-recommendations', { 
      state: { 
        domain: selectedDomain, 
        experience: experience 
      } 
    });
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
      setSelectedDomain(null);
    }
  };

  return (
    <div className="domain-selection-page">
      <div className="container">
        {step === 1 ? (
          <>
            <div className="domain-hero">
              <h1>Choose Your Learning Path</h1>
              <p>Select the domain that interests you most to get personalized course recommendations</p>
            </div>

            <div className="domains-grid">
              {domains.map((domain, index) => (
                <div
                  key={domain.id}
                  className="domain-card"
                  onClick={() => handleDomainSelect(domain)}
                >
                  <div className="domain-icon" style={{ color: domain.color }}>
                    {domain.icon}
                  </div>
                  <h3>{domain.title}</h3>
                  <p>{domain.description}</p>
                  
                  <div className="domain-details">
                    <div className="skills">
                      <h4>Key Skills:</h4>
                      <div className="skill-tags">
                        {domain.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="career-info">
                      <div className="career-paths">
                        <h4>Career Paths:</h4>
                        <ul>
                          {domain.careerPaths.map(path => (
                            <li key={path}>{path}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="salary">
                        <h4>Average Salary:</h4>
                        <span className="salary-amount">{domain.averageSalary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : step === 2 ? (
          <>
            <div className="domain-hero">
              <button className="back-btn" onClick={handleBack}>← Back</button>
              <h1>{selectedDomain?.title} Courses</h1>
              <p>Explore our comprehensive courses designed for {selectedDomain?.title.toLowerCase()}</p>
            </div>

            <div className="courses-overview">
              {selectedDomain?.courses?.map((course) => (
                <div key={course.id} className="course-detail-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <span className="course-duration">⏱️ {course.duration}</span>
                      <span className="course-weeks">📅 {course.weeks}</span>
                      <span className="course-level">📊 {course.level}</span>
                    </div>
                  </div>
                  
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-videos">
                    <h4>Course Videos:</h4>
                    <div className="videos-grid">
                      {course.videos.map((video, index) => (
                        <div key={index} className="video-item">
                          <div className="video-thumbnail">{video.thumbnail}</div>
                          <div className="video-info">
                            <h5>{video.title}</h5>
                            <span className="video-duration">{video.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="continue-section">
              <button className="btn btnPrimary" onClick={handleContinueToExperience}>
                Continue to Experience Level
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="domain-hero">
              <button className="back-btn" onClick={handleBack}>← Back</button>
              <h1>What's Your Experience Level?</h1>
              <p>Help us recommend the right courses for your <strong>{selectedDomain?.title}</strong> journey</p>
            </div>

            <div className="experience-grid">
              {experienceLevels.map((level) => (
                <div
                  key={level.id}
                  className="experience-card domain-card"
                  onClick={() => handleExperienceSelect(level)}
                >
                  <div className="experience-icon">{level.icon}</div>
                  <h3>{level.title}</h3>
                  <p>{level.description}</p>
                  <div className="experience-details">
                    <div className="duration">
                      <strong>Duration:</strong> {level.duration}
                    </div>
                    <div className="commitment">
                      <strong>Time Commitment:</strong> {level.commitment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DomainSelectionPage;
