import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🧮',
      title: 'Abacus Training',
      description: 'Comprehensive abacus programs for all age groups, focusing on mental math skills and cognitive development.',
      features: ['Age 5-15 years', 'Certified Curriculum', 'Progress Tracking']
    },
    {
      icon: '🧠',
      title: 'Brain Development',
      description: 'Specialized programs to enhance memory, concentration, and overall brain functionality.',
      features: ['Memory Techniques', 'Focus Training', 'Cognitive Exercises']
    },
    {
      icon: '🎓',
      title: 'School Partnerships',
      description: 'Collaborative programs with educational institutions to integrate abacus into school curriculum.',
      features: ['Custom Curriculum', 'Teacher Training', 'School Workshops']
    },
    {
      icon: '📊',
      title: 'Competition Preparation',
      description: 'Expert training for national and international abacus competitions and Olympiads.',
      features: ['Competition Strategy', 'Speed Training', 'Mock Tests']
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <h2>Our Programs & Services</h2>
          <p>Comprehensive educational solutions designed for excellence</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className="service-btn">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
