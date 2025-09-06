import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

function Signup() {
  const cardRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const card = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(card, { y: 28, opacity: 0, rotateX: -8 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.75 });
    tl.fromTo(card.querySelectorAll('[data-stagger]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '<0.05');

    const featureItems = document.querySelectorAll('[data-feature-item]');
    featureItems.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: name,
        email: email,
        level: 'Beginner',
        streak: 0
      };
      
      login(userData);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="authWrap">
        <form ref={cardRef} className="authCard" onSubmit={handleSignup}>
          <h2 className="authTitle">Create your account</h2>
          <p className="authSubtitle">Personalized learning, curated content, and interview simulations await.</p>

          <div className="field" data-stagger>
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              className="input" 
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field" data-stagger>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              className="input" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field" data-stagger>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="authActions" data-stagger>
            <button 
              className="btn btnPrimary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
            <Link to="/login" className="link">I already have an account</Link>
          </div>
        </form>
      </div>
      <section className="section">
        <div className="container grid-3">
          <div className="card" data-feature-item>
            <h3>Curated Content</h3>
            <p>Learn from high‑quality, organized materials that fit your goals.</p>
          </div>
          <div className="card" data-feature-item>
            <h3>AI Personalization</h3>
            <p>Recommendations that adapt to your progress and proficiency.</p>
          </div>
          <div className="card" data-feature-item>
            <h3>Interview Proctoring</h3>
            <p>Practice real‑world interviews and get actionable feedback.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
