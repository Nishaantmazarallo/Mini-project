import React, { useState } from 'react';
import './OnlineClasses.css';

const OnlineClasses = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    level: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/students/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Enrollment submitted successfully! We will contact you soon.' });
        setFormData({ name: '', age: '', email: '', phone: '', level: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to submit enrollment' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="online-classes-page">
      <div className="container">
        <header className="page-header">
          <h1>Online Abacus Classes</h1>
          <p>Join our interactive online abacus classes from the comfort of your home</p>
        </header>

        <section className="class-features">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Live Interactive Sessions</h3>
              <p>Real-time classes with certified instructors and interactive whiteboard</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Attention</h3>
              <p>Small batch sizes ensuring individual attention to each student</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Comprehensive Curriculum</h3>
              <p>Structured learning path from basics to advanced abacus techniques</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certification</h3>
              <p>Get certified upon completion of each level with performance tracking</p>
            </div>
          </div>
        </section>

        <section className="class-schedule">
          <h2>Class Schedule & Fees</h2>
          <div className="schedule-table">
            <div className="schedule-row header">
              <div>Level</div>
              <div>Duration</div>
              <div>Schedule</div>
              <div>Fees</div>
            </div>
            <div className="schedule-row">
              <div>Beginner</div>
              <div>3 Months</div>
              <div>Mon, Wed, Fri - 4-5 PM</div>
              <div>₹3,000/month</div>
            </div>
            <div className="schedule-row">
              <div>Intermediate</div>
              <div>4 Months</div>
              <div>Tue, Thu, Sat - 5-6 PM</div>
              <div>₹3,500/month</div>
            </div>
            <div className="schedule-row">
              <div>Advanced</div>
              <div>6 Months</div>
              <div>Mon to Fri - 6-7 PM</div>
              <div>₹4,000/month</div>
            </div>
          </div>
        </section>

        <section className="enrollment-section">
          <h2>Ready to Enroll?</h2>
          <p>Fill out the form below to register for our online classes</p>
          <form className="enrollment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                placeholder="Student Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="number" 
                name="age"
                placeholder="Age" 
                value={formData.age}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Parent's Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <select 
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
            </button>
            
            {submitStatus && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </section>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>What equipment do I need for online classes?</h3>
            <p>You'll need a computer/laptop with webcam, stable internet connection, and a notebook for practice.</p>
          </div>
          <div className="faq-item">
            <h3>Are the classes recorded?</h3>
            <p>Yes, all classes are recorded and shared with students for revision.</p>
          </div>
          <div className="faq-item">
            <h3>What is the class duration?</h3>
            <p>Each session is 60 minutes, scheduled 3-5 times per week based on the level.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OnlineClasses;
