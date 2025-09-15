import React from 'react';
import HeroSection from '../component/HeroSection/HeroSection';
import Services from '../component/Services/Services';
import Testimonials from '../component/Testimonials/Testimonials';
import About from '../component/About/About';
import Courses from '../component/Courses/Courses';
import Achievements from '../component/Achievements/Achievements';
import Experience from '../component/Experience/Experience';
import Gallery from '../component/Gallery/Gallery';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Services />
      <About />
      <Testimonials />
      <Courses />
      <Achievements />
      <Experience />
      <Gallery />
    </div>
  );
};

export default Home;
