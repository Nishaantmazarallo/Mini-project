import React from 'react';
import HeroSection from '../component/HeroSection/HeroSection';
import Services from '../component/Services/Services';
import Testimonials from '../component/Testimonials/Testimonials';

import Achievements from '../component/Achievements/Achievements';
import Experience from '../component/Experience/Experience';
import Gallery from '../component/Gallery/Gallery';
import './EnhancedHome.css';

const EnhancedHome = () => {
  return (
    <div className="enhanced-home">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-element element-1">🧮</div>
        <div className="floating-element element-2">📚</div>
        <div className="floating-element element-3">🎓</div>
        <div className="floating-element element-4">🌟</div>
      </div>

      <HeroSection />
      
      {/* Quick Stats Section */}
      <section className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <h3>10+ Years</h3>
              <p>Of Excellence</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🎓</div>
              <h3>100+</h3>
              <p>Students Trained</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏫</div>
              <h3>10+</h3>
              <p>Partner Schools</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <h3>50+</h3>
              <p>Awards Won</p>
            </div>
          </div>
        </div>
      </section>

      <Services />
      <Testimonials />
      <Achievements />
      <Experience />
      <Gallery />

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join hundreds of successful students who have transformed their math skills with ANF Academy</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Enroll Now</button>
              <button className="cta-btn secondary">Free Demo Class</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedHome;
