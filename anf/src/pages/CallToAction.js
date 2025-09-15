import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section-component">
      <div className="cta-overlay"></div>
      <div className="container cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Unlock Your Child's Potential?</h2>
          <p className="cta-subtitle">
            Join hundreds of successful students who have transformed their math skills and confidence with ANF Academy.
          </p>
          <div className="cta-buttons-container">
            <button className="cta-btn-component primary" onClick={() => navigate('/online-classes')}>
              Enroll Now
            </button>
            <button className="cta-btn-component secondary">Request a Free Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;