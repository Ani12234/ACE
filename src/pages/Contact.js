import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero section">
        <div className="container">
          <div className="contact-hero-content">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
              Have questions about our AI-powered learning platform? We're here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="contact-icon">📧</span>
                  <div>
                    <h3>Email</h3>
                    <p>support@aielearning.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">📞</span>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">🏢</span>
                  <div>
                    <h3>Office</h3>
                    <p>123 AI Learning Street<br />Silicon Valley, CA 94000</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">⏰</span>
                  <div>
                    <h3>Support Hours</h3>
                    <p>Monday - Friday: 9AM - 6PM PST<br />Weekend: 10AM - 4PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btnPrimary btn-large">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <div className="section-line"></div>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does the AI interview system work?</h3>
              <p>Our AI system analyzes your responses in real-time, providing feedback on communication skills, technical knowledge, and interview performance.</p>
            </div>
            <div className="faq-item">
              <h3>Is my data secure?</h3>
              <p>Yes, we use enterprise-grade encryption and follow strict privacy policies to protect your personal information and learning data.</p>
            </div>
            <div className="faq-item">
              <h3>Can I access courses offline?</h3>
              <p>Selected course materials can be downloaded for offline access. Premium subscribers get extended offline capabilities.</p>
            </div>
            <div className="faq-item">
              <h3>What devices are supported?</h3>
              <p>Our platform works on all modern browsers, mobile devices, tablets, and desktop computers with camera and microphone access.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
