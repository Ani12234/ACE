import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Features() {
  const heroRef = useRef(null);
  const featuresRef = useRef([]);
  const demoRef = useRef(null);

  const addToFeaturesRef = (el) => {
    if (el && !featuresRef.current.includes(el)) {
      featuresRef.current.push(el);
    }
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

    // Feature cards animation
    if (!prefersReducedMotion) {
      featuresRef.current.forEach((feature, index) => {
        gsap.fromTo(
          feature,
          { 
            y: isMobile ? 30 : 50, 
            opacity: 0,
            scale: isMobile ? 1 : 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: isMobile ? 0.6 : 0.8,
            ease: 'back.out(1.7)',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: feature,
              start: isMobile ? 'top 90%' : 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Demo section animation
      if (demoRef.current) {
        gsap.fromTo(
          demoRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: demoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section ref={heroRef} className="features-hero">
        <div className="container">
          <div className="features-hero-content">
            <h1 className="features-title" data-fade>
              Powerful Features for Modern Learning
            </h1>
            <p className="features-subtitle" data-fade>
              Experience the future of education with AI-powered personalization, realistic interview practice, and comprehensive skill assessment
            </p>
            <div className="features-cta" data-fade>
              <Link to="/signup" className="btn btnPrimary">Start Free Trial</Link>
              <Link to="/interview-practice" className="btn btnGhost">Try AI Interview</Link>
              <Link to="/domain-selection" className="btn btnSecondary">Select the Domain</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section features-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <div className="section-line"></div>
          </div>
          <div className="features-grid">
            <div ref={addToFeaturesRef} className="feature-card primary">
              <div className="feature-icon">🤖</div>
              <h3>AI Interview Proctor</h3>
              <p>Experience realistic technical interviews with our AI-powered proctor system that analyzes your responses, body language, and communication skills.</p>
              <ul className="feature-list">
                <li>Real-time feedback and scoring</li>
                <li>Technical and behavioral questions</li>
                <li>Performance analytics</li>
                <li>Industry-specific scenarios</li>
              </ul>
              <Link to="/interview-practice" className="feature-link">Try Interview →</Link>
            </div>

            <div ref={addToFeaturesRef} className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Curated Learning Paths</h3>
              <p>Follow structured, expert-designed learning paths that take you from beginner to job-ready professional in your chosen field.</p>
              <ul className="feature-list">
                <li>Progressive skill building</li>
                <li>Industry-aligned curriculum</li>
                <li>Hands-on projects</li>
                <li>Certification tracking</li>
              </ul>
              <Link to="/courses" className="feature-link">Explore Courses →</Link>
            </div>

            <div ref={addToFeaturesRef} className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Personalized Analytics</h3>
              <p>Track your progress with detailed analytics that identify strengths, weaknesses, and optimal learning strategies.</p>
              <ul className="feature-list">
                <li>Learning velocity tracking</li>
                <li>Skill gap analysis</li>
                <li>Performance predictions</li>
                <li>Custom recommendations</li>
              </ul>
              <Link to="/dashboard" className="feature-link">View Dashboard →</Link>
            </div>

            <div ref={addToFeaturesRef} className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Adaptive Assessment</h3>
              <p>Take assessments that adapt to your skill level, providing challenging questions that match your current abilities.</p>
              <ul className="feature-list">
                <li>Dynamic difficulty adjustment</li>
                <li>Comprehensive skill evaluation</li>
                <li>Instant detailed feedback</li>
                <li>Progress benchmarking</li>
              </ul>
              <Link to="/assessment" className="feature-link">Take Assessment →</Link>
            </div>

            <div ref={addToFeaturesRef} className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Career Guidance</h3>
              <p>Receive AI-powered career recommendations based on your skills, interests, and market demand.</p>
              <ul className="feature-list">
                <li>Job market insights</li>
                <li>Skill demand forecasting</li>
                <li>Career path suggestions</li>
                <li>Salary benchmarking</li>
              </ul>
              <Link to="/career-guidance" className="feature-link">Get Guidance →</Link>
            </div>

            <div ref={addToFeaturesRef} className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certification System</h3>
              <p>Earn industry-recognized certificates that validate your skills and boost your professional credibility.</p>
              <ul className="feature-list">
                <li>Blockchain-verified certificates</li>
                <li>Industry partnerships</li>
                <li>Portfolio integration</li>
                <li>LinkedIn sharing</li>
              </ul>
              <Link to="/certificates" className="feature-link">View Certificates →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Demo */}
      <section className="section demo-section">
        <div className="container">
          <div className="section-header">
            <h2>AI Technology in Action</h2>
            <div className="section-line"></div>
          </div>
          <div ref={demoRef} className="demo-content">
            <div className="demo-visual">
              <div className="demo-screen">
                <div className="demo-header">
                  <div className="demo-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="demo-title">AI Interview Session</div>
                </div>
                <div className="demo-body">
                  <div className="demo-question">
                    <div className="ai-avatar">🤖</div>
                    <div className="question-text">
                      "Can you explain the difference between REST and GraphQL APIs?"
                    </div>
                  </div>
                  <div className="demo-analysis">
                    <div className="analysis-item">
                      <span className="analysis-label">Technical Accuracy:</span>
                      <div className="analysis-bar">
                        <div className="analysis-fill" style={{width: '85%'}}></div>
                      </div>
                      <span className="analysis-score">85%</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Communication:</span>
                      <div className="analysis-bar">
                        <div className="analysis-fill" style={{width: '92%'}}></div>
                      </div>
                      <span className="analysis-score">92%</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Confidence:</span>
                      <div className="analysis-bar">
                        <div className="analysis-fill" style={{width: '78%'}}></div>
                      </div>
                      <span className="analysis-score">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="demo-description">
              <h3>Real-time AI Analysis</h3>
              <p>Our advanced AI system analyzes multiple aspects of your interview performance:</p>
              <div className="demo-features">
                <div className="demo-feature">
                  <div className="demo-feature-icon">🧠</div>
                  <div>
                    <h4>Technical Assessment</h4>
                    <p>Evaluates the accuracy and depth of your technical responses</p>
                  </div>
                </div>
                <div className="demo-feature">
                  <div className="demo-feature-icon">💬</div>
                  <div>
                    <h4>Communication Analysis</h4>
                    <p>Assesses clarity, structure, and professional communication skills</p>
                  </div>
                </div>
                <div className="demo-feature">
                  <div className="demo-feature-icon">📈</div>
                  <div>
                    <h4>Performance Tracking</h4>
                    <p>Monitors improvement over time with detailed progress reports</p>
                  </div>
                </div>
              </div>
              <Link to="/interview-practice" className="btn btnPrimary">Experience AI Interview</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="section integration-section">
        <div className="container">
          <div className="section-header">
            <h2>Seamless Integration</h2>
            <div className="section-line"></div>
          </div>
          <div className="integration-grid">
            <div className="integration-item">
              <div className="integration-icon">🔗</div>
              <h3>API Integration</h3>
              <p>Connect with your existing tools and workflows through our comprehensive API</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">☁️</div>
              <h3>Cloud Sync</h3>
              <p>Access your learning progress and materials from any device, anywhere</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">📱</div>
              <h3>Mobile App</h3>
              <p>Continue learning on-the-go with our fully-featured mobile application</p>
            </div>
            <div className="integration-item">
              <div className="integration-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Bank-level security with SSO, GDPR compliance, and data encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Learning?</h2>
            <p>Join thousands of learners who have successfully bridged the gap between education and career success</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btnPrimary">Start Your Journey</Link>
              <Link to="/about" className="btn btnGhost">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
