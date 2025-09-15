import React from 'react';
import Services from '../component/Services/Services';
import CoursesComponent from '../component/Courses/Courses';

const Courses = () => {
  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Our Courses & Programs</h1>
        <p>Comprehensive learning solutions for all age groups</p>
      </div>
      <Services />
      <CoursesComponent />
    </div>
  );
};

export default Courses;
