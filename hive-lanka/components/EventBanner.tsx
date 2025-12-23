'use client';

import { useState } from 'react';
import Image from 'next/image';

const events = [
  '/images/event/event1.jpg',
  '/images/event/event2.jpg',
  '/images/event/event3.jpg',
];

export default function EventBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const changeSlide = (direction: number) => {
    setCurrentSlide((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return events.length - 1;
      if (newIndex >= events. length) return 0;
      return newIndex;
    });
  };

  return (
    <section className="event-banner-section">
      <div className="container">
        <div className="event-banner-container">
          <div className="event-banner-slider">
            {events.map((event, index) => (
              <div
                key={index}
                className={`event-banner-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <Image
                  src={event}
                  alt={`Event ${index + 1}`}
                  fill
                  className="event-banner-image"
                />
              </div>
            ))}
          </div>
          
          <div className="event-banner-dots">
            {events.map((_, index) => (
              <span
                key={index}
                className={`event-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          <button className="event-banner-nav prev" onClick={() => changeSlide(-1)}>&#10094;</button>
          <button className="event-banner-nav next" onClick={() => changeSlide(1)}>&#10095;</button>
        </div>
      </div>
    </section>
  );
}