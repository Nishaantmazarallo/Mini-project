import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to handle the email submission, e.g., send to backend
    setMessage('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2>Stay Updated with ANF Academy</h2>
        <p>Subscribe to our newsletter for the latest updates on courses, events, and more!</p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {message && <p className="newsletter-message">{message}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
