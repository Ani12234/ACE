import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
// No animations on Home

function Home() {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const heroMockRef = useRef(null);
  const cardsRef = useRef([]);
  sectionsRef.current = [];

  const addToSectionsRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // animations removed
  }, []);

  return (
    <div className="no-anim">
      <section 
        ref={heroRef} 
        style={{
          padding: '80px 0 60px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <h1 
              data-hero-fade
              style={{
                fontSize: '2.5rem',
                lineHeight: '1.2',
                marginBottom: '20px',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}
            >
              Accelerate learning with AI‑powered study & interview practice
            </h1>
            <p 
              data-hero-fade
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--muted)',
                marginBottom: '32px'
              }}
            >
              Curated content, personalized journeys, and realistic interview proctoring—designed to bridge learning and job‑readiness.
            </p>
            <div 
              data-hero-fade
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <Link 
                to="/signup" 
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--gradient)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                I already have an account
              </Link>
            </div>

            <div 
              data-hero-fade
              style={{ 
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  content: '"AI"',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >AI</span>
              <div>
                <strong>AI‑Powered E‑Learning & Interview Proctor System</strong>
                <div style={{ color: 'var(--muted)' }}>Personalized, structured, and assessment‑ready.</div>
              </div>
            </div>
          </div>
          <div>
            <div 
              ref={heroMockRef} 
              style={{
                width: '100%',
                aspectRatio: '16/9',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 80px rgba(108, 140, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                background: 'linear-gradient(135deg, rgba(108, 140, 255, 0.1) 0%, rgba(23, 210, 194, 0.1) 100%)'
              }}
            >
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div 
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    background: 'var(--gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Interactive Learning
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                  AI-powered curriculum
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={addToSectionsRef} 
        style={{
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>Introduction</h2>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            <p>
              This project belongs to the domain of Artificial Intelligence (AI) in E‑Learning and Automated Assessment. It leverages technologies like machine learning, large language models (LLMs), and organized high‑quality educational content.
              This enhances learning by personalizing study materials, tracking progress, and recommending relevant topics. In parallel, AI‑powered interview proctoring simulates real‑world evaluations, analyzing technical expertise.
            </p>
            <p>
              This domain bridges the gap between online learning and job readiness by ensuring learners are equipped with knowledge and practical competencies.
            </p>
          </div>
        </div>
      </section>

      <section 
        ref={addToSectionsRef} 
        style={{
          padding: '80px 0',
          position: 'relative',
          background: 'radial-gradient(800px at 50% 100%, rgba(108, 140, 255, 0.08), transparent)'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '30px',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            display: 'block'
          }}>Key Features</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '40px'
          }}>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>M</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Motivation</h3>
              <p>
                Bridge the gap between self‑learning and job readiness. Learners need structured, reliable content and realistic interview practice to validate their skills.
              </p>
            </div>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>P</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Problem Statement</h3>
              <p>
                Scattered resources and lack of practical evaluation make it hard to measure progress. Our system delivers curated content, simulated interviews, and personalized feedback.
              </p>
            </div>
            <div 
              ref={addToCardsRef} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px 24px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient)',
                position: 'relative',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>S</div>
              <h3 style={{
                marginTop: '0',
                marginBottom: '16px',
                fontSize: '1.25rem',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>What You Get</h3>
              <p>
                AI‑guided study paths, topic recommendations, progress tracking, and interview simulations that assess technical expertise and communication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
