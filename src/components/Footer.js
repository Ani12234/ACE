import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <div style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} AI E‑Learning & Proctor. All rights reserved.
        </div>
        <div className="footer-cta">
          <Link to="/login" className="btn btnGhost">Login</Link>
          <Link to="/signup" className="btn btnPrimary">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


