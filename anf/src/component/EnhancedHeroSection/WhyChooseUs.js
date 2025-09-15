import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: '👨‍🏫',
      title: 'Expert Educators',
      description: 'Our certified teachers have years of experience in mathematics education and personalized learning.'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'Each student receives a customized learning plan tailored to their pace and learning style.'
    },
    {
      icon: '📊',
      title: 'Proven Results',
      description: '95% of our students show significant improvement in math scores within 6 months.'
    },
    {
      icon: '💻',
      title: 'Interactive Technology',
      description: 'Modern learning tools and interactive games make math engaging and fun.'
    },
    {
      icon: '🏆',
      title: 'Award-Winning Curriculum',
      description: 'Our curriculum is recognized by educational institutions and follows international standards.'
    },
    {
      icon: '🤝',
      title: '24/7 Support',
      description: 'Round-the-clock assistance for students and parents through our dedicated support team.'
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose ANF Academy?</h2>
          <p className="section-subtitle">
            Discover what makes us the preferred choice for mathematics education
          </p>
        </div>

        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">
                <span className="icon-emoji">{reason.icon}</span>
              </div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Expert Teachers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
