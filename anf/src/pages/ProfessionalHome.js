import React from 'react';
import TopHeaderBar from '../component/TopHeaderBar/TopHeaderBar';
import HeroSection from '../component/HeroSection/HeroSection';
import Services from '../component/Services/Services';
import Testimonials from '../component/Testimonials/Testimonials';
import Achievements from '../component/Achievements/Achievements';
import Experience from '../component/Experience/Experience';
import Gallery from '../component/Gallery/Gallery';
import WhyChooseUs from '../component/EnhancedHeroSection/WhyChooseUs';
import CallToAction from './CallToAction';
import './ProfessionalHome.css';

const Footer = () => (
  <footer className="professional-footer">
    {/* Footer content would go here */}
    <p>&copy; {new Date().getFullYear()} ANF Academy. All Rights Reserved.</p>
  </footer>
);

const ProfessionalHome = () => {
  return (
    <div className="professional-home">
      <TopHeaderBar />
      <main>
        <HeroSection />
        <WhyChooseUs />
        <Services />
        <CallToAction />
        <Testimonials />
        <Achievements />
        <Experience />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalHome;
