// components/Header/Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="header-bg"></div>
      <div className="header-overlay"></div>

      <div className="floating-elements">
        <div className="floating-element star"></div>
        <div className="floating-element book"></div>
        <div className="floating-element pencil"></div>
        <div className="floating-element abc-block"></div>
      </div>

      <section id="header">
        <div className="header-content">
          <h1>ANF ACADEMY</h1>
          <p>SIMPLIFYING EDUCATION</p>
        </div>
      </section>
    </header>
  );
};

export default Header;