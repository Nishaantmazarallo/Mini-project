import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CreativeNavbar.css';

const CreativeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: '👨‍🏫' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="creative-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🧮</span>
          <span className="logo-text">ANF Academy</span>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-hover-effect"></span>
            </Link>
          ))}
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default CreativeNavbar;
