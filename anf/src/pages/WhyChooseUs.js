import React from 'react';
import './WhyChooseUs.css';

// You can use an icon library like Font Awesome or custom SVG icons
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card-wcu">
    <div className="feature-icon-wcu">{icon}</div>
    <h3 className="feature-title-wcu">{title}</h3>
    <p className="feature-description-wcu">{description}</p>
  </div>
);

const WhyChooseUs = () => {
  const features = [
    {
      icon: '🎓',
      title: 'Expert Certified Trainers',
      description: 'Our instructors are certified by UCMAS and Jaya Vidya Academy, bringing over a decade of specialized experience.',
    },
    {
      icon: '📈',
      title: 'Proven Track Record',
      description: 'We have successfully trained over 100 students and partnered with more than 10 schools, delivering measurable results.',
    },
    {
      icon: '💡',
      title: 'Innovative Curriculum',
      description: 'Our ISO 9001:2015 certified curriculum is designed for comprehensive brain development and mental math mastery.',
    },
    {
      icon: '❤️',
      title: 'Parent-Trusted',
      description: 'We consistently receive positive feedback from parents and school administrators for our effective training methods.',
    },
  ];

  return (
    <section className="why-choose-us-section">
      <div className="container">
    <h2 className="section-title-wcu">Why Choose ANF Academy?</h2>
        <p className="section-subtitle-wcu">Discover the advantages that make our academy the premier choice for abacus education.</p>
        <div className="features-grid-wcu">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;