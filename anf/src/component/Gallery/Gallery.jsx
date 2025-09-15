// components/Gallery/Gallery.jsx
import React from 'react';
import './Gallery.css';

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      hue: 0,
      src: 'https://lh3.googleusercontent.com/p/AF1QipMBRIdg3q5g2y3vuqUwG9kmoFMpxAbpEGQPt1Tt=s1360-w1360-h1020-rw',
      title: 'ACADEMY IMAGE'
    },
    {
      id: 2,
      hue: 60,
      src: 'https://lh3.googleusercontent.com/p/AF1QipN_El5Vx2MNPzrSr34IqZLuunWbAgZ7W4T4-djw=s1360-w1360-h1020-rw',
      title: 'Classroom Moments'
    },
    {
      id: 3,
      hue: 120,
      src: 'https://lh3.googleusercontent.com/p/AF1QipPwQ-6O5W6VCdvY7xBIMQEaaCUVj-TLY1WtnXjp=s1360-w1360-h1020-rw',
      title: 'Special Events'
    },
    {
      id: 4,
      hue: 180,
      src: 'https://lh3.googleusercontent.com/p/AF1QipOoErenkREOusDunwZ000agvf17b4tCb1zOXuth=s1360-w1360-h1020-rw',
      title: 'Achievements'
    },
    {
      id: 5,
      hue: 240,
      src: 'https://lh3.googleusercontent.com/p/AF1QipPkm39EjgRa3VPUIJe4RfK4H7NNL4WEANrlazTc=s1360-w1360-h1020-rw',
      title: 'Campus Life'
    },
    {
      id: 6,
      hue: 300,
      src: 'https://lh3.googleusercontent.com/p/AF1QipN6_g1e5VFNJ723tR8UIXq7uGYzyGAGgRLr4QkP=s1360-w1360-h1020-rw',
      title: 'Learning Spaces'
    }
  ];

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-header">
        <h2 className="gallery-title">ANF ACADEMY <span>Gallery</span></h2>
        <p className="gallery-subtitle">Explore our vibrant learning community</p>
      </div>
      <div className="gallery-container">
        {galleryItems.map(item => (
          <div key={item.id} className="gallery-item" style={{ '--hue': item.hue }}>
            <img src={item.src} alt={`ANF ACADEMY Image ${item.id}`} />
            <div className="gallery-overlay">
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;