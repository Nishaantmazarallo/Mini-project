import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TopHeaderBar from '../component/TopHeaderBar/TopHeaderBar';
import HeroSection from '../component/HeroSection/HeroSection';
import Services from '../component/Services/Services';
import Testimonials from '../component/Testimonials/Testimonials';
import Achievements from '../component/Achievements/Achievements';
import Experience from '../component/Experience/Experience';
import Gallery from '../component/Gallery/Gallery';
import WhyChooseUs from '../component/EnhancedHeroSection/WhyChooseUs';
import CallToAction from './CallToAction';
import Newsletter from '../component/Newsletter/Newsletter';
import './ProfessionalHome.css';

const Footer = () => (
  <footer className="professional-footer">
    {/* Footer content would go here */}
    <p>&copy; {new Date().getFullYear()} ANF Academy. All Rights Reserved.</p>
  </footer>
);

const ProfessionalHome = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="professional-home">
      <TopHeaderBar />
      <main>
        <HeroSection data-aos="fade-up" />
        <WhyChooseUs data-aos="fade-up" data-aos-delay="200" />
        <Services data-aos="fade-up" data-aos-delay="400" />
        <CallToAction data-aos="fade-up" data-aos-delay="600" />
        <Testimonials data-aos="fade-up" data-aos-delay="800" />
        <Achievements data-aos="fade-up" data-aos-delay="1000" />
        <Experience data-aos="fade-up" data-aos-delay="1200" />
        <Gallery data-aos="fade-up" data-aos-delay="1400" />
        <Newsletter data-aos="fade-up" data-aos-delay="1600" />
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalHome;
