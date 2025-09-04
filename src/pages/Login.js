import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

function Login() {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(card, { y: 24, opacity: 0, rotateX: -6 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7 });
    tl.fromTo(card.querySelectorAll('[data-stagger]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '<0.05');
  }, []);

  return (
    <div className="authWrap">
      <div ref={cardRef} className="authCard">
        <h2 className="authTitle">Welcome back</h2>
        <p className="authSubtitle">Log in to continue your AI‑powered learning journey.</p>

        <div className="field" data-stagger>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" placeholder="you@example.com" />
        </div>
        <div className="field" data-stagger>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="input" placeholder="••••••••" />
        </div>

        <div className="authActions" data-stagger>
          <button className="btn btnPrimary" type="button">Login</button>
          <Link to="/signup" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;


