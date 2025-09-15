import React from 'react';
import ContactForm from '../component/ContactForm/ContactForm';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch to start your learning journey</p>
      </div>
      <ContactForm />
    </div>
  );
};

export default Contact;
