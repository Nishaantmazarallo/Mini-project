// components/About/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="cards">
      <div className="cards-container">
        <div className="card">
          <h3>ANF ACADEMY</h3>
          <p>Over 10 years of experience teaching abacus to students of various age groups and academic backgrounds.
            <br /><br />
            Certified trainer accredited by both UCMAS and Jaya Vidya Academy
            <br /><br />
            Trained Over 100+ Students across different age groups
            <br /><br />
            Certified with ISO 9001:2015 issued by INGRAIN GLOBAL STANDARD PRIVATE LIMITED (MS03241775)
            <br /><br />
            Received positive feedback from parents and school administrators regarding the effectiveness of training
            <br /><br />
            Successfully taught abacus classes in a variety of educational settings, including 10+ primary & Public schools</p>
        </div>

        <div className="card">
        <h2>Why Choose ANF Academy?</h2>
          <p>At ANF Academy, we take pride in over a decade of experience in nurturing young minds through Abacus training. With a strong foundation built on expertise and quality, we have consistently empowered students of various age groups and academic backgrounds to excel.</p>
        </div>
      </div>
    </section>
  );
};

export default About;