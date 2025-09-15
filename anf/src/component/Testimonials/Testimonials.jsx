import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Parent of Student',
      content: 'ANF Academy transformed my child\'s math skills. The abacus training not only improved calculation speed but also boosted confidence tremendously. Highly recommended!',
      rating: 5,
      image: '👨‍👦'
    },
    {
      name: 'Priya ',
      role: 'School Principal',
      content: 'We partnered with ANF Academy for our school program. The structured curriculum and professional approach have shown remarkable results in our students\' cognitive development.',
      rating: 5,
      image: '👩‍🏫'
    },
    {
      name: 'Vikram ',
      role: 'Satisfied Parent',
      content: 'The teachers are exceptional and the learning environment is fantastic. My daughter went from struggling with math to winning school competitions!',
      rating: 5,
      image: '👨‍👧'
    },
    {
      name: 'Praveen Kumar',
      role: 'Education Consultant',
      content: 'Professional, dedicated, and results-oriented. ANF Academy sets the standard for abacus education with their innovative teaching methodologies.',
      rating: 5,
      image: '👩‍💼'
    }
  ];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>What Our Clients Say</h2>
          <p>Real success stories from students, parents, and educational partners</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-image">
                  {testimonial.image}
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonials-cta">
          <p>Join hundreds of satisfied students and parents</p>
          <button className="cta-button">Start Your Journey</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
