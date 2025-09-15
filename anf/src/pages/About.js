import React from 'react';
import AboutComponent from '../component/About/About';
import Testimonials from '../component/Testimonials/Testimonials';
import Achievements from '../component/Achievements/Achievements';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About ANF Academy</h1>
        <p>Excellence in Abacus Education Since 2013</p>
      </div>
      <AboutComponent />
      <Achievements />
      <Testimonials />
    </div>
  );
};

export default About;
