import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const statsRef = useRef([]);

  const addToSectionsRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const addToStatsRef = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
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

    // Section animations
    if (!prefersReducedMotion) {
      sectionsRef.current.forEach((section, index) => {
        gsap.fromTo(
          section,
          { y: isMobile ? 30 : 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.6 : 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: isMobile ? 'top 90%' : 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Stats counter animation
      statsRef.current.forEach((stat, index) => {
        const number = stat.querySelector('.stat-number');
        const finalValue = parseInt(number.textContent);
        
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(stat, 
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, delay: index * 0.1 }
            );
            
            gsap.fromTo({ value: 0 }, {
              value: finalValue,
              duration: 2,
              delay: index * 0.1,
              ease: 'power2.out',
              onUpdate: function() {
                number.textContent = Math.round(this.targets()[0].value) + (number.dataset.suffix || '');
              }
            });
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section ref={heroRef} className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title" data-fade>
              Bridging the Gap Between Learning and Career Success
            </h1>
            <p className="about-subtitle" data-fade>
              Transforming online education with AI-powered personalization and realistic interview preparation
            </p>
            <div className="about-cta" data-fade>
              <Link to="/features" className="btn btnPrimary">Explore Features</Link>
              <Link to="/courses" className="btn btnGhost">View Courses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section ref={addToSectionsRef} className="section">
        <div className="container">
          <div className="section-content">
            <div className="section-header">
              <h2>Our Motivation</h2>
              <div className="section-line"></div>
            </div>
            <div className="motivation-grid">
              <div className="motivation-text">
                <p className="lead-text">
                  The primary motivation for this project is to bridge the gap between online self-learning and real-world job readiness.
                </p>
                <p>
                  While e-learning resources are abundant, learners often struggle to find structured, reliable content and rarely get the opportunity to test their skills in realistic interview settings. This system ensures not only that learners gain knowledge but also that they are assessed in a professional manner, preparing them for actual workplace challenges.
                </p>
                <div className="motivation-highlights">
                  <div className="highlight-item">
                    <div className="highlight-icon">🎯</div>
                    <div>
                      <h4>Structured Learning</h4>
                      <p>Curated, organized content that follows proven learning pathways</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">🤖</div>
                    <div>
                      <h4>AI-Powered Assessment</h4>
                      <p>Realistic interview simulations with intelligent feedback</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">🚀</div>
                    <div>
                      <h4>Career Readiness</h4>
                      <p>Bridge the gap between learning and professional success</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="motivation-visual">
                <div className="visual-card">
                  <div className="visual-icon">📚</div>
                  <h3>Traditional E-Learning</h3>
                  <ul>
                    <li>Scattered resources</li>
                    <li>No practical evaluation</li>
                    <li>Limited feedback</li>
                    <li>Generic content</li>
                  </ul>
                </div>
                <div className="visual-arrow">→</div>
                <div className="visual-card enhanced">
                  <div className="visual-icon">🎓</div>
                  <h3>Our Solution</h3>
                  <ul>
                    <li>Curated content</li>
                    <li>AI interview practice</li>
                    <li>Personalized feedback</li>
                    <li>Adaptive learning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section ref={addToSectionsRef} className="section problem-section">
        <div className="container">
          <div className="section-content">
            <div className="section-header">
              <h2>Problem Statement</h2>
              <div className="section-line"></div>
            </div>
            <div className="problem-content">
              <div className="problem-statement">
                <p className="lead-text">
                  The AI-Powered E-Learning & Interview Proctor System addresses the challenges of scattered learning resources and lack of practical evaluation by delivering curated content, simulating real-world interviews, and providing personalized feedback for skill improvement.
                </p>
              </div>
              <div className="problem-breakdown">
                <div className="problem-item">
                  <div className="problem-number">01</div>
                  <div className="problem-details">
                    <h3>Scattered Learning Resources</h3>
                    <p>Learners waste time searching through fragmented content across multiple platforms, leading to inefficient learning paths and knowledge gaps.</p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-number">02</div>
                  <div className="problem-details">
                    <h3>Lack of Practical Evaluation</h3>
                    <p>Most online courses provide theoretical knowledge without realistic assessment methods that mirror actual job requirements and interview processes.</p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-number">03</div>
                  <div className="problem-details">
                    <h3>Limited Personalized Feedback</h3>
                    <p>Generic feedback systems fail to provide actionable insights tailored to individual learning styles and career goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={addToSectionsRef} className="section stats-section">
        <div className="container">
          <div className="section-header">
            <h2>The Challenge in Numbers</h2>
            <div className="section-line"></div>
          </div>
          <div className="stats-grid">
            <div ref={addToStatsRef} className="stat-item">
              <div className="stat-number" data-suffix="%">73</div>
              <div className="stat-label">of learners struggle with scattered resources</div>
            </div>
            <div ref={addToStatsRef} className="stat-item">
              <div className="stat-number" data-suffix="%">68</div>
              <div className="stat-label">feel unprepared for technical interviews</div>
            </div>
            <div ref={addToStatsRef} className="stat-item">
              <div className="stat-number" data-suffix="%">82</div>
              <div className="stat-label">want personalized learning paths</div>
            </div>
            <div ref={addToStatsRef} className="stat-item">
              <div className="stat-number" data-suffix="%">91</div>
              <div className="stat-label">prefer practical skill assessment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section ref={addToSectionsRef} className="section solution-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Solution</h2>
            <div className="section-line"></div>
          </div>
          <div className="solution-grid">
            <div className="solution-item">
              <div className="solution-icon">🎯</div>
              <h3>Curated Content</h3>
              <p>High-quality, organized learning materials structured in progressive pathways that eliminate the need to search across multiple platforms.</p>
            </div>
            <div className="solution-item">
              <div className="solution-icon">🤖</div>
              <h3>AI Interview Proctor</h3>
              <p>Realistic interview simulations powered by AI that analyze technical expertise, communication skills, and provide actionable feedback.</p>
            </div>
            <div className="solution-item">
              <div className="solution-icon">📊</div>
              <h3>Personalized Learning</h3>
              <p>Adaptive algorithms that customize content recommendations and learning paths based on individual progress and career goals.</p>
            </div>
            <div className="solution-item">
              <div className="solution-icon">🎓</div>
              <h3>Skill Assessment</h3>
              <p>Comprehensive evaluation system that measures both theoretical knowledge and practical application in real-world scenarios.</p>
            </div>
          </div>
          <div className="solution-cta">
            <Link to="/interview-practice" className="btn btnPrimary">Try AI Interview</Link>
            <Link to="/dashboard" className="btn btnGhost">Start Learning</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
