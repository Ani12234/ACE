import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  sectionsRef.current = [];

  const addToSectionsRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    const hero = heroRef.current;

    // Intro animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      hero.querySelectorAll('[data-hero-fade]'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }
    );

    // Scroll reveal for sections
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <>
      <section ref={heroRef} className="hero">
        <div className="container hero-grid">
          <div>
            <h1 className="heroTitle" data-hero-fade>
              Accelerate learning with AI‑powered study & interview practice
            </h1>
            <p className="heroSubtitle" data-hero-fade>
              Curated content, personalized journeys, and realistic interview proctoring—designed to bridge learning and job‑readiness.
            </p>
            <div className="ctaRow" data-hero-fade>
              <Link to="/signup" className="btn btnPrimary">Get Started</Link>
              <Link to="/login" className="btn btnGhost">I already have an account</Link>
            </div>

            <div className="statCard" style={{ marginTop: 18 }} data-hero-fade>
              <span className="statIcon" />
              <div>
                <strong>AI‑Powered E‑Learning & Interview Proctor System</strong>
                <div style={{ color: 'var(--muted)' }}>Personalized, structured, and assessment‑ready.</div>
              </div>
            </div>
          </div>
          <div>
            <div className="heroMock">Interactive learning canvas • GSAP scroll animations</div>
          </div>
        </div>
      </section>

      <section ref={addToSectionsRef} className="section">
        <div className="container">
          <h2>Introduction</h2>
          <p>
            This project belongs to the domain of Artificial Intelligence (AI) in E‑Learning and Automated Assessment. It leverages technologies like machine learning, large language models (LLMs), and organized high‑quality educational content.
            This enhances learning by personalizing study materials, tracking progress, and recommending relevant topics. In parallel, AI‑powered interview proctoring simulates real‑world evaluations, analyzing technical expertise.
          </p>
          <p>
            This domain bridges the gap between online learning and job readiness by ensuring learners are equipped with knowledge and practical competencies.
          </p>
        </div>
      </section>

      <section ref={addToSectionsRef} className="section">
        <div className="container grid-3">
          <div className="card">
            <h3>Motivation</h3>
            <p>
              Bridge the gap between self‑learning and job readiness. Learners need structured, reliable content and realistic interview practice to validate their skills.
            </p>
          </div>
          <div className="card">
            <h3>Problem Statement</h3>
            <p>
              Scattered resources and lack of practical evaluation make it hard to measure progress. Our system delivers curated content, simulated interviews, and personalized feedback.
            </p>
          </div>
          <div className="card">
            <h3>What You Get</h3>
            <p>
              AI‑guided study paths, topic recommendations, progress tracking, and interview simulations that assess technical expertise and communication.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;


