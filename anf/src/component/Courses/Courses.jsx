// components/Courses/Courses.jsx
import React from 'react';
import './Courses.css';

const Courses = () => {
  const courses = [
    {
      id: 1,
      type: 'abacus',
      icon: '🧮',
      title: 'Abacus',
      description: 'Master mental math techniques with our proven abacus training program.'
    },
    {
      id: 2,
      type: 'vedic',
      icon: '🔢',
      title: 'Vedic Maths',
      description: 'Ancient techniques for modern problem solving and faster calculations.'
    },
    {
      id: 3,
      type: 'chess',
      icon: '♟️',
      title: 'Chess',
      description: 'Develop strategic thinking and problem-solving skills through chess.'
    },
    {
      id: 4,
      type: 'drawing',
      icon: '🎨',
      title: 'Drawing',
      description: 'Unlock creativity and artistic expression with professional guidance.'
    },
    {
      id: 5,
      type: 'english',
      icon: '📚',
      title: 'Spoken English',
      description: 'Build confidence in English communication with our interactive classes.'
    },
    {
      id: 6,
      type: 'rubiks',
      icon: '🧊',
      title: "Rubik's Cube",
      description: 'Learn to solve the cube while improving memory and spatial skills.'
    }
  ];

  return (
    <section id="courses-section" className="courses-section">
      <div className="container">
        <h2 className="section-title">Our Featured Courses</h2>
        <p className="section-subtitle">Learn new skills with our expert instructors</p>

        <div className="courses-container">
          {courses.map(course => (
            <div key={course.id} className={`course-card ${course.type}`}>
              <div className="course-icon">{course.icon}</div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              <a href="#" className="btn">Learn More</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;