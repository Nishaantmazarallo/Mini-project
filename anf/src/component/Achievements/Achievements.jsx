// components/Achievements/Achievements.jsx
import React, { useEffect } from 'react';
import './Achievements.css';

const Achievements = () => {
  useEffect(() => {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    achievementCards.forEach((card, index) => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
      observer.observe(card);
    });

    // Create confetti elements
    const celebration = document.querySelector('.celebration-animation');
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.animationDuration = Math.random() * 3 + 3 + 's';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
      celebration.appendChild(confetti);
    }

    return () => {
      achievementCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  const achievements = [
    {
      id: 1,
      medalType: 'gold',
      title: '22nd International Online Abacus Competition',
      items: [
        { label: 'Champion of Champions', value: 15 },
        { label: 'Champions', value: 6 },
        { label: 'Toppers', value: 10 }
      ]
    },
    {
      id: 2,
      medalType: 'silver',
      title: 'Suvai Brain Centre (District Level)',
      items: [
        { label: '1st Place', value: 10 },
        { label: '2nd Place', value: 15 },
        { label: '3rd Place', value: 20 }
      ]
    },
    {
      id: 3,
      medalType: 'bronze',
      title: 'Infotek 15th District Level Competition',
      items: [
        { label: '1st Place', value: 15 },
        { label: '2nd Place', value: 18 },
        { label: '3rd Place', value: 9 }
      ]
    },
    {
      id: 4,
      medalType: 'gold',
      title: 'Amata International Open Competition',
      items: [
        { label: 'Champion of Champions', value: 5 },
        { label: 'Champions', value: 3 },
        { label: 'Topper', value: 1 }
      ]
    }
  ];

  return (
    <section className="achievements-section">
      <div className="container">
        <h2 className="section-title">Our Achievements</h2>
        <p className="section-subtitle">Celebrating Excellence in Abacus Education</p>

        {/* Student Success Image Section */}
        <div className="student-success-section">
          <div className="success-image-container">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Happy students celebrating success with abacus"
              className="success-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <h3>Student Success Stories</h3>
                <p>Witness the journey of our talented students achieving remarkable results</p>
                <div className="success-stats">
                  <div className="success-stat">
                    <span className="stat-number">95%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                  <div className="success-stat">
                    <span className="stat-number">100+</span>
                    <span className="stat-label">Happy Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <div className={`medal-animation ${achievement.medalType}`}>
                <div className="medal"></div>
                <div className="ribbon"></div>
              </div>
              <h3>{achievement.title}</h3>
              <ul className="achievement-list">
                {achievement.items.map((item, index) => (
                  <li key={index}>
                    <span className="highlight">{item.value}</span> {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="celebration-animation">
          <div className="kid kid1"></div>
          <div className="kid kid2"></div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;