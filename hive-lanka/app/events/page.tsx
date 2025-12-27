'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicEventBoard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events/published').then(res => res.json()).then(data => setEvents(data.events || []));
  }, []);

  return (
    <div className="hev-board-wrapper">
      <div className="hev-container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
          <h1 className="hev-title" style={{fontSize: '40px'}}>Community Events</h1>
          <Link href="/events/submit">
            <button className="hev-btn">PROPOSE AN EVENT</button>
          </Link>
        </div>

        <div className="hev-grid">
          {events.map((event: any) => (
            <div key={event.id} className="hev-card">
              <Image src={event.posterImage} alt={event.title} width={400} height={500} className="hev-poster" />
              <div className="hev-details">
                <span className="hev-tag">{event.type}</span>
                <h2 className="hev-title">{event.title}</h2>
                <p className="hev-date" style={{color: '#64748b', fontWeight: 'bold', fontSize: '14px'}}>
                  📅 {new Date(event.date).toDateString()} | {event.venue}
                </p>
                <p className="hev-desc" style={{margin: '15px 0'}}>{event.description}</p>
                <Link href="/events/apply">
                   <button className="hev-btn" style={{width: '100%', background: '#2563eb'}}>RSVP / INTERESTED</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}