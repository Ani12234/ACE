import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

function Login() {
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const card = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(card, { y: 24, opacity: 0, rotateX: -6 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7 });
    tl.fromTo(card.querySelectorAll('[data-stagger]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '<0.05');

    // ScrollTrigger for below-the-fold feature items
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0] || 'User',
        email: email,
        level: 'Intermediate',
        streak: 7
      };
      
      login(userData);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="authWrap">
        <form ref={cardRef} className="authCard" onSubmit={handleLogin}>
          <h2 className="authTitle">Welcome back</h2>
          <p className="authSubtitle">Log in to continue your AI‑powered learning journey.</p>

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
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <Link to="/signup" className="link">Create an account</Link>
          </div>
        </form>
      </div>
      <section className="section">
        <div className="container grid-3">
          <div className="card" data-feature-item>
            <h3>Secure Authentication</h3>
            <p>We keep your data protected with modern standards and best practices.</p>
          </div>
          <div className="card" data-feature-item>
            <h3>Personalized Dashboard</h3>
            <p>Pick up where you left off and track your learning progress.</p>
          </div>
          <div className="card" data-feature-item>
            <h3>One‑click Practice</h3>
            <p>Jump into AI‑powered mock interviews tailored to your skills.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
