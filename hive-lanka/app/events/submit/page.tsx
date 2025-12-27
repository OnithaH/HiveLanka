'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SubmitEvent() {
  const { user } = useUser();
  const router = useRouter();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ eventName: '', date: '', description: '', venue: '', location: '' });

  // 1. Fetch internal DB ID correctly
  useEffect(() => {
    if (user) {
      fetch(`/api/user/role?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          // 🔥 CRITICAL FIX: The API returns 'userId', NOT 'user.id'
          if (data.userId) {
            setDbUserId(data.userId);
          } else {
            console.error("User ID missing in response:", data);
          }
        })
        .catch(err => console.error("Error fetching role:", err));
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // This will now pass because dbUserId is correctly set
    if (!dbUserId) return alert("User data not synced. Please try again.");

    try {
      const res = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          submittedBy: dbUserId, 
          contactEmail: user?.primaryEmailAddress?.emailAddress 
        })
      });

      const json = await res.json();

      if (res.ok) {
        alert("✅ Proposal sent! Admin will publish once the poster is ready.");
        router.push('/events'); // Redirect to main event page
      } else {
        alert(`Error: ${json.error || 'Submission failed'}`);
      }
    } catch (error) {
      alert("Network error. Check console.");
      console.error(error);
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