import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const DomainSelectionPage = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [step, setStep] = useState(1); // 1: domain selection, 2: experience level
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const animationsRef = useRef([]);

  const domains = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Build modern, responsive websites and web applications using HTML, CSS, JavaScript, and popular frameworks like React.',
      icon: '🌐',
      color: '#3b82f6',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
      careerPaths: ['Frontend Developer', 'UI/UX Developer', 'Web Designer'],
      averageSalary: '$75,000'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      description: 'Dive into AI and data science. Learn algorithms, neural networks, and build intelligent systems that can learn and make predictions.',
      icon: '🤖',
      color: '#10b981',
      skills: ['Python', 'TensorFlow', 'Statistics', 'Data Analysis'],
      careerPaths: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
      averageSalary: '$120,000'
    },
    {
      id: 'backend-development',
      title: 'Backend Development',
      description: 'Master server-side programming, databases, APIs, and cloud infrastructure. Build the backbone that powers web applications.',
      icon: '⚙️',
      color: '#8b5cf6',
      skills: ['Node.js', 'Databases', 'APIs', 'Cloud Services'],
      careerPaths: ['Backend Developer', 'DevOps Engineer', 'System Architect'],
      averageSalary: '$95,000'
    },
    {
      id: 'fullstack-development',
      title: 'Full Stack Development',
      description: 'Become a complete developer mastering both frontend and backend technologies. Build end-to-end web applications.',
      icon: '🚀',
      color: '#f59e0b',
      skills: ['Frontend', 'Backend', 'Databases', 'DevOps'],
      careerPaths: ['Full Stack Developer', 'Technical Lead', 'Product Engineer'],
      averageSalary: '$110,000'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Extract insights from data and make data-driven decisions',
      icon: '📊',
      color: '#06b6d4',
      skills: ['Python/R', 'Statistics', 'Data Visualization', 'SQL', 'Business Intelligence'],
      careerPaths: ['Data Scientist', 'Data Analyst', 'Business Intelligence Developer'],
      averageSalary: '$90,000 - $135,000'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect systems and data from digital threats and attacks',
      icon: '🔒',
      color: '#ef4444',
      skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response'],
      careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Architect'],
      averageSalary: '$85,000 - $140,000'
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

  useEffect(() => {
    // Initialize animations
    const initializeAnimations = () => {
      try {
        // Clear any existing animations
        animationsRef.current.forEach(animation => {
          if (animation && typeof animation.kill === 'function') {
            animation.kill();
          }
        });
        animationsRef.current = [];

        // Animate page entrance
        const tl = gsap.timeline();
        
        tl.fromTo('.domain-hero', 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        tl.fromTo('.domain-card', 
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
          '-=0.4'
        );

        animationsRef.current.push(tl);
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    const timer = setTimeout(initializeAnimations, 100);
    return () => {
      clearTimeout(timer);
      animationsRef.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
    };
  }, [step]);

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setStep(2);
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
    setStep(1);
    setSelectedDomain(null);
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
                  ref={el => cardsRef.current[index] = el}
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
