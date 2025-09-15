import React from 'react';
import './EnhancedHeroSection.css';

const EnhancedHeroSection = () => {
  return (
    <section className="enhanced-hero-section" style={{ backgroundImage: "url('/images/abacus-background.jpg')" }}>
      {/* Animated Background Elements */}
      <div className="math-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="math-particle" style={{
            animationDelay: `${i * 0.5}s`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}>
            {['+', '−', '×', '÷', '=', 'π', '∞', '√'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlighted-text">Abacus</span><br />Online Academy
          </h1>
          
          <p className="hero-subtitle">
            Mental Maths, Speed Calculation & Brain Development Centre
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="hero-buttons">
            <button className="cta-btn primary">
              Request for a Demo Class
            </button>
          </div>
        </div>

        {/* Interactive Math Visualization */}
        <div className="hero-visualization">
          <div className="abacus-animation">
            <div className="abacus-frame">
              <div className="abacus-beads">
                {[...Array(5)].map((_, row) => (
                  <div key={row} className="abacus-row">
                    {[...Array(10)].map((_, bead) => (
                      <div 
                        key={bead} 
                        className="abacus-bead"
                        style={{ animationDelay: `${row * 0.2 + bead * 0.1}s` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="math-equation">
            <span className="equation-text">7 + 8 = 15</span>
            <div className="equation-animation"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
