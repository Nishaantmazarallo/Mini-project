// components/Experience/Experience.jsx
import React, { useEffect } from 'react';
import './Experience.css';

const Experience = () => {
  useEffect(() => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
        }
      });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });

    // Make floating pencils more dynamic
    const floatingPencils = document.querySelector('.floating-pencils');
    for (let i = 0; i < 3; i++) {
      const pencil = document.createElement('div');
      pencil.className = 'pencil';
      pencil.style.left = Math.random() * 100 + '%';
      pencil.style.top = Math.random() * 100 + '%';
      pencil.style.animationDelay = Math.random() * 3 + 's';
      pencil.style.transform = `rotate(${Math.random() * 360}deg)`;
      floatingPencils.appendChild(pencil);
    }

    return () => {
      timelineItems.forEach(item => timelineObserver.unobserve(item));
    };
  }, []);

  const experiences = [
    { year: '2010', title: 'Good Shepherd Matric Higher Secondary School', location: 'Marthandam', icon: 'fas fa-school' },
    { year: '2015', title: 'Bishop Remigius School (CBSE)', location: 'Nagercoil', icon: 'fas fa-graduation-cap' },
    { year: '2017', title: 'Packianathan Public School (CBSE)', location: 'Kattadurai', icon: 'fas fa-school' },
    { year: '2017', title: 'Spring Field Public School (CBSE)', location: 'Thenthamaralkulam', icon: 'fas fa-graduation-cap' },
    { year: '2017', title: 'Evans Matric Higher Secondary School', location: 'NGO Colony', icon: 'fas fa-school' },
    { year: '2020', title: 'Vins School of Excellence (CBSE)', location: 'Chunkankadai', icon: 'fas fa-graduation-cap' },
    { year: '2024', title: 'Pearl Matric Higher Secondary School', location: 'Therekalputhur', icon: 'fas fa-school' },
    { year: '2024', title: 'Gnanammal Nursery and Primary School', location: 'Santhapuram', icon: 'fas fa-child' },
    { year: '2024', title: 'Holy Family Nursery & Primary School', location: 'Ramanputhur', icon: 'fas fa-child' },
    { year: '2025', title: "St. Anne's", location: 'Melmidalam', icon: 'fas fa-school' }
  ];

  return (
    <section className="experience-section">
      <div className="container">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">"Spreading knowledge everywhere"</p>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{exp.year}</div>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <p>{exp.location}</p>
                <div className="school-icon">
                  <i className={exp.icon}></i>
                </div>
              </div>
            </div>
          ))}
          <div className="timeline-line"></div>
        </div>

        <div className="floating-pencils"></div>
      </div>
    </section>
  );
};

export default Experience;