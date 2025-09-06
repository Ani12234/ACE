import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function InterviewPractice() {
  const heroRef = useRef(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('intermediate');

  const questions = {
    technical: [
      "Explain the difference between REST and GraphQL APIs.",
      "How would you optimize a slow database query?",
      "Describe the concept of microservices architecture.",
      "What are the benefits of using TypeScript over JavaScript?"
    ],
    behavioral: [
      "Tell me about a challenging project you worked on.",
      "How do you handle tight deadlines and pressure?",
      "Describe a time when you had to learn a new technology quickly.",
      "How do you approach debugging complex issues?"
    ]
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      heroRef.current.querySelectorAll('[data-fade]'),
      { y: isMobile ? 20 : 30, opacity: 0 },
      { y: 0, opacity: 1, duration: isMobile ? 0.6 : 0.9, stagger: isMobile ? 0.08 : 0.12 }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestion(0);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions[interviewType].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsInterviewActive(false);
      // Show results
    }
  };

  const endInterview = () => {
    setIsInterviewActive(false);
  };

  return (
    <div className="interview-practice-page">
      {/* Hero Section */}
      <section ref={heroRef} className="interview-hero">
        <div className="container">
          <div className="interview-hero-content">
            <h1 className="interview-title" data-fade>
              AI-Powered Interview Practice
            </h1>
            <p className="interview-subtitle" data-fade>
              Experience realistic technical and behavioral interviews with our advanced AI proctor system
            </p>
            <div className="interview-stats" data-fade>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Practice Sessions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Question Bank</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isInterviewActive ? (
        <>
          {/* Setup Section */}
          <section className="section setup-section">
            <div className="container">
              <div className="setup-content">
                <h2>Customize Your Interview</h2>
                <div className="setup-grid">
                  <div className="setup-card">
                    <h3>Interview Type</h3>
                    <div className="setup-options">
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="type" 
                          value="technical"
                          checked={interviewType === 'technical'}
                          onChange={(e) => setInterviewType(e.target.value)}
                        />
                        <span>Technical Interview</span>
                        <p>Focus on coding, system design, and technical concepts</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="type" 
                          value="behavioral"
                          checked={interviewType === 'behavioral'}
                          onChange={(e) => setInterviewType(e.target.value)}
                        />
                        <span>Behavioral Interview</span>
                        <p>Assess soft skills, problem-solving, and cultural fit</p>
                      </label>
                    </div>
                  </div>

                  <div className="setup-card">
                    <h3>Difficulty Level</h3>
                    <div className="setup-options">
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="beginner"
                          checked={difficulty === 'beginner'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Beginner</span>
                        <p>Entry-level questions and concepts</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="intermediate"
                          checked={difficulty === 'intermediate'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Intermediate</span>
                        <p>Mid-level professional questions</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="advanced"
                          checked={difficulty === 'advanced'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Advanced</span>
                        <p>Senior-level and complex scenarios</p>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="setup-actions">
                  <button onClick={startInterview} className="btn btnPrimary btn-large">
                    Start AI Interview
                  </button>
                  <Link to="/features" className="btn btnGhost">
                    Learn More About AI Features
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="section features-section">
            <div className="container">
              <h2>What Makes Our AI Proctor Special</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎥</div>
                  <h3>Video Analysis</h3>
                  <p>AI analyzes your body language, eye contact, and presentation skills</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🗣️</div>
                  <h3>Speech Recognition</h3>
                  <p>Advanced NLP processes your responses for technical accuracy</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <h3>Real-time Feedback</h3>
                  <p>Instant scoring and suggestions during your practice session</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📈</div>
                  <h3>Progress Tracking</h3>
                  <p>Detailed analytics showing improvement over multiple sessions</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Interview Interface */
        <section className="section interview-interface">
          <div className="container">
            <div className="interview-screen">
              <div className="interview-header">
                <div className="interview-progress">
                  <span>Question {currentQuestion + 1} of {questions[interviewType].length}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${((currentQuestion + 1) / questions[interviewType].length) * 100}%`}}
                    ></div>
                  </div>
                </div>
                <button onClick={endInterview} className="btn btnGhost btn-small">
                  End Interview
                </button>
              </div>

              <div className="interview-content">
                <div className="ai-interviewer">
                  <div className="ai-avatar">🤖</div>
                  <div className="ai-name">AI Interviewer</div>
                </div>

                <div className="question-container">
                  <h3>Question {currentQuestion + 1}</h3>
                  <p className="question-text">
                    {questions[interviewType][currentQuestion]}
                  </p>
                </div>

                <div className="response-area">
                  <div className="video-placeholder">
                    <div className="camera-icon">📹</div>
                    <p>Camera Active - Recording Response</p>
                  </div>

                  <div className="live-analysis">
                    <h4>Live Analysis</h4>
                    <div className="analysis-metrics">
                      <div className="metric">
                        <span>Confidence Level</span>
                        <div className="metric-bar">
                          <div className="metric-fill" style={{width: '78%'}}></div>
                        </div>
                        <span>78%</span>
                      </div>
                      <div className="metric">
                        <span>Speaking Pace</span>
                        <div className="metric-bar">
                          <div className="metric-fill" style={{width: '85%'}}></div>
                        </div>
                        <span>Good</span>
                      </div>
                      <div className="metric">
                        <span>Eye Contact</span>
                        <div className="metric-bar">
                          <div className="metric-fill" style={{width: '92%'}}></div>
                        </div>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="interview-controls">
                  <button className="btn btnGhost">Pause</button>
                  <button onClick={nextQuestion} className="btn btnPrimary">
                    {currentQuestion < questions[interviewType].length - 1 ? 'Next Question' : 'Finish Interview'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Ace Your Next Interview?</h2>
            <p>Join thousands of professionals who have improved their interview skills with our AI system</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btnPrimary">Create Free Account</Link>
              <Link to="/dashboard" className="btn btnGhost">View Dashboard</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InterviewPractice;
