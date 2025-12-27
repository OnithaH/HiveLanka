'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SubmitEvent() {
  const { user } = useUser();
  const router = useRouter();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ eventName: '', date: '', description: '', venue: '', location: '' });

  // Fetch your internal database ID first
  useEffect(() => {
    if (user) {
      fetch(`/api/user/role?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => setDbUserId(data.user?.id));
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!dbUserId) return alert("User data not synced. Please try again.");

    const res = await fetch('/api/events/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        submittedBy: dbUserId, // Use internal ID, not Clerk ID
        contactEmail: user?.primaryEmailAddress?.emailAddress 
      })
    });

    if (res.ok) {
      alert("✅ Proposal sent! Admin will publish once the poster is ready.");
      router.push('/events');
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  return (
    <div className="hev-board-wrapper">
      <div className="hev-container" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSubmit} className="hev-card" style={{padding: '40px'}}>
          <h1 className="hev-title" style={{marginBottom: '20px'}}>Submit Event Proposal</h1>
          
          <div className="hev-input-group">
            <label className="hev-label">Event Name</label>
            <input required className="hev-input" placeholder="e.g., Kandy Craft Fair" onChange={(e)=>setFormData({...formData, eventName: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Date</label>
            <input required type="date" className="hev-input" onChange={(e)=>setFormData({...formData, date: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Venue / City</label>
            <input required className="hev-input" placeholder="e.g., BMICH, Colombo" onChange={(e)=>setFormData({...formData, venue: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Description</label>
            <textarea required className="hev-input" style={{height: '120px'}} placeholder="Describe the event..." onChange={(e)=>setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" className="hev-btn" style={{width: '100%', marginTop: '10px'}}>SEND TO ADMIN</button>
        </form>
      </div>
    </div>
  );
}