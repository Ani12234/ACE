import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DomainSelection = ({ isOpen, onClose, onDomainSelect }) => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [step, setStep] = useState(1); // 1: domain selection, 2: experience level
  const modalRef = useRef(null);
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
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      skills: ['Python/R', 'Statistics', 'Data Visualization', 'SQL', 'Business Intelligence'],
      careerPaths: ['Data Scientist', 'Data Analyst', 'Business Intelligence Developer'],
      averageSalary: '$90,000 - $135,000',
      jobDemand: 'High'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect systems and data from digital threats and attacks',
      icon: '🔒',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response'],
      careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Architect'],
      averageSalary: '$85,000 - $140,000',
      jobDemand: 'Very High'
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
    // Clean up previous animations
    animationsRef.current.forEach(animation => {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
      }
    });
    animationsRef.current = [];

    if (isOpen && modalRef.current) {
      // Validate element before animating
      const validateElement = (element) => {
        return element && 
               element.parentNode && 
               element.isConnected && 
               document.contains(element);
      };

      if (validateElement(modalRef.current)) {
        // Animate modal entrance
        const modalAnim = gsap.fromTo(modalRef.current, 
          { opacity: 0, scale: 0.8 }, 
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
        animationsRef.current.push(modalAnim);
      }

      // Animate cards with validation
      setTimeout(() => {
        const validCards = cardsRef.current.filter(card => validateElement(card));
        
        if (validCards.length > 0) {
          const cardsAnim = gsap.fromTo(validCards, 
            { y: 50, opacity: 0, rotateY: -15 }, 
            { y: 0, opacity: 1, rotateY: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }
          );
          animationsRef.current.push(cardsAnim);
        }
      }, 200);
    }

    // Cleanup function
    return () => {
      animationsRef.current.forEach(animation => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
        }
      });
      animationsRef.current = [];
    };
  }, [isOpen, step]);

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    
    // Validate element before animating
    const validateElement = (element) => {
      return element && 
             element.parentNode && 
             element.isConnected && 
             document.contains(element);
    };
    
    // Animate selection with validation
    const selectedCard = cardsRef.current.find(card => 
      card && card.dataset && card.dataset.domainId === domain.id
    );
    
    if (selectedCard && validateElement(selectedCard)) {
      const selectAnim = gsap.to(selectedCard, {
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
        duration: 0.3
      });
      animationsRef.current.push(selectAnim);
    }
    
    setTimeout(() => setStep(2), 500);
  };

  const handleExperienceSelect = (experience) => {
    onDomainSelect({
      domain: selectedDomain,
      experience: experience
    });
    onClose();
  };

  const handleBack = () => {
    setStep(1);
    setSelectedDomain(null);
  };

  if (!isOpen) return null;

  return (
    <div className="domain-selection-overlay">
      <div ref={modalRef} className="domain-selection-modal">
        {step === 1 ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="title-icon">🎯</span>
                Choose Your Learning Path
              </h2>
              <p className="modal-subtitle">
                Select the domain that excites you most. We'll personalize your learning journey based on your choice.
              </p>
            </div>

            <div className="domains-grid">
              {domains.map((domain, index) => (
                <div
                  key={domain.id}
                  ref={el => cardsRef.current[index] = el}
                  data-domain-id={domain.id}
                  className="domain-card"
                  onClick={() => handleDomainSelect(domain)}
                >
                  <div className="domain-card-header">
                    <div className="domain-icon" style={{ background: domain.color }}>
                      {domain.icon}
                    </div>
                    <div className="domain-info">
                      <h3 className="domain-title">{domain.title}</h3>
                      <p className="domain-description">{domain.description}</p>
                    </div>
                  </div>
                  
                  <div className="domain-details">
                    <div className="domain-stats">
                      <div className="stat-item">
                        <span className="stat-label">Job Demand</span>
                        <span className={`stat-value demand-${domain.jobDemand?.toLowerCase().replace(' ', '-')}`}>
                          {domain.jobDemand}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Avg. Salary</span>
                        <span className="stat-value">{domain.averageSalary}</span>
                      </div>
                    </div>
                    
                    <div className="domain-skills">
                      <h4>Key Skills:</h4>
                      <div className="skills-list">
                        {domain.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                        {domain.skills.length > 3 && (
                          <span className="skill-tag more">+{domain.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="career-paths">
                      <h4>Career Paths:</h4>
                      <ul>
                        {domain.careerPaths.map((path, idx) => (
                          <li key={idx}>{path}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="domain-card-footer">
                    <button className="select-domain-btn">
                      Select This Path
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="modal-header">
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <h2 className="modal-title">
                <span className="title-icon">📈</span>
                What's Your Experience Level?
              </h2>
              <p className="modal-subtitle">
                Tell us about your experience in <strong>{selectedDomain?.title}</strong> so we can customize your learning path.
              </p>
            </div>

            <div className="experience-grid">
              {experienceLevels.map((level, index) => (
                <div
                  key={level.id}
                  ref={el => cardsRef.current[index] = el}
                  className="experience-card"
                  onClick={() => handleExperienceSelect(level)}
                >
                  <div className="experience-icon">{level.icon}</div>
                  <h3 className="experience-title">{level.title}</h3>
                  <p className="experience-description">{level.description}</p>
                  <div className="experience-details">
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{level.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time Commitment:</span>
                      <span className="detail-value">{level.commitment}</span>
                    </div>
                  </div>
                  <button className="select-experience-btn">
                    Choose {level.title}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DomainSelection;
