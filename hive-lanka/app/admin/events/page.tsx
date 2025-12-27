'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, MapPin, ExternalLink } from 'lucide-react';

export default function AdminEventSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/events/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="admin-content">Loading Submissions...</div>;

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Event Submissions</h1>
          <p>Review and publish official community events</p>
        </div>
      </div>

      <div className="hev-grid">
        {submissions.length === 0 ? (
          <div className="empty-state" style={{gridColumn: '1/-1'}}>
            <Calendar size={48} className="empty-icon" />
            <p>No pending event submissions found.</p>
          </div>
        ) : (
          submissions.map((sub: any) => (
            <div key={sub.id} className="hev-card">
              <div className="hev-details">
                <span className="hev-tag">{sub.eventType}</span>
                <h2 className="hev-title">{sub.eventName}</h2>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b'}}>
                    <Calendar size={14} /> {new Date(sub.date).toDateString()}
                  </span>
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b'}}>
                    <MapPin size={14} /> {sub.venue}
                  </span>
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b'}}>
                    <User size={14} /> Submitted by: {sub.submittedBy}
                  </span>
                </div>

<Link href={`/admin/events/publish/${sub.id}`} className="hev-btn" style={{width: '100%', display: 'block', background: '#667eea'}}>
  REVIEW & DESIGN POSTER
</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}