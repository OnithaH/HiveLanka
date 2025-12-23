'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const banners = [
  '/images/banner/ad1.jpg',
  '/images/banner/ad2.png',
  '/images/banner/ad3.png',
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const changeSlide = (direction: number) => {
    setCurrentSlide((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return banners.length - 1;
      if (newIndex >= banners.length) return 0;
      return newIndex;
    });
  };

  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-slider">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ?  'active' : ''}`}
            >
              <Image
                src={banner}
                alt={`Advertisement ${index + 1}`}
                fill
                className="banner-image"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        <div className="banner-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' :  ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        <button className="banner-nav prev" onClick={() => changeSlide(-1)}>&#10094;</button>
        <button className="banner-nav next" onClick={() => changeSlide(1)}>&#10095;</button>
      </div>
    </section>
  );
}