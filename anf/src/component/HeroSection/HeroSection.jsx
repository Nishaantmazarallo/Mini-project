import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Excellence in Abacus Education
          </h1>
          <p className="hero-subtitle">
            Transforming young minds through innovative mental math techniques and 
            comprehensive brain development programs
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Students Trained</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Partner Schools</span>
            </div>
          </div>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/online-classes')}>Enroll Now</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <img src="https://media.istockphoto.com/id/1159394306/vector/flying-to-school.jpg?s=612x612&w=0&k=20&c=dGpN9BSA2CkFO_gfkaqj1Aa54hDP3jqMCZFPzm-A7Hk=" alt="Successful Student" className="student-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
