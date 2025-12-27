'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicEventBoard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events/published').then(res => res.json()).then(data => setEvents(data.events || []));
  }, []);

  return (
    <div className="hev-board-wrapper">
      <div className="hev-container">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '40px'}}>
          <h1 className="hev-title" style={{fontSize: '32px'}}>Community Events</h1>
          <Link href="/events/submit" className="hev-btn">PROPOSE EVENT</Link>
        </div>
        <div className="hev-grid">
          {events.map((event: any) => (
            <div key={event.id} className="hev-card">
              <Image src={event.posterImage} alt={event.title} width={400} height={450} className="hev-poster" />
              <div className="hev-details">
                <span className="hev-tag">{event.type}</span>
                <h2 className="hev-title">{event.title}</h2>
                <p style={{fontWeight: 'bold'}}>📅 {new Date(event.date).toDateString()}</p>
                <p style={{margin: '15px 0', color: '#64748b'}}>{event.description}</p>
                <button className="hev-btn" style={{width: '100%', background: '#2563eb'}}>RSVP INTEREST</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}