'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SubmitEvent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ eventName: '', date: '', description: '', venue: '' });
  const [submitting, setSubmitting] = useState(false);

  // 1. Robust User Fetching
  useEffect(() => {
    if (isLoaded && user) {
      // Fetch the internal database ID
      fetch(`/api/user/role?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.userId) {
            setDbUserId(data.userId);
          } else {
            console.error("Internal User ID not found via API");
          }
        })
        .catch(e => console.error("API Error:", e));
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!dbUserId) {
        alert("⚠️ Please wait a moment for your profile to sync, then try again.");
        return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          submittedBy: dbUserId, // Validated ID
          contactEmail: user?.primaryEmailAddress?.emailAddress 
        })
      });

      if (res.ok) {
        alert("✅ Proposal successfully sent to Admin!");
        router.push('/events'); // Go to public board
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hev-board-wrapper">
      <div className="hev-container" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSubmit} className="hev-card" style={{padding: '40px'}}>
          <h1 className="hev-title" style={{marginBottom: '20px', textAlign: 'center'}}>Submit Event Proposal</h1>
          
          <div className="hev-input-group">
            <label className="hev-label">Event Name</label>
            <input required className="hev-input" placeholder="e.g., Summer Craft Fair" 
              onChange={(e)=>setFormData({...formData, eventName: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Event Date</label>
            <input required type="date" className="hev-input" 
              onChange={(e)=>setFormData({...formData, date: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Venue / City</label>
            <input required className="hev-input" placeholder="e.g., Colombo" 
              onChange={(e)=>setFormData({...formData, venue: e.target.value})} />
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Description</label>
            <textarea required className="hev-input" style={{height: '120px'}} placeholder="Describe your event..." 
              onChange={(e)=>setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" disabled={submitting} className="hev-btn" style={{width: '100%', marginTop: '10px'}}>
            {submitting ? "Sending..." : "SEND TO ADMIN"}
          </button>
        </form>
      </div>
    </div>
  );
}