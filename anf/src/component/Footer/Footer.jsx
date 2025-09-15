// components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <section id="footer">
        <div className="footer-content">
          <div className="footer-logo">ANF ACADEMY</div>

          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Courses</a>
            <a href="#">Contact</a>
          </div>

          <div className="copyright">
            © ANF Academy. All Rights Reserved.
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;