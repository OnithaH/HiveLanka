'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CreateCampaign() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', story: '', goal: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/fundraising/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, clerkId: user?.id }),
      });
      if (res.ok) {
        alert("✅ Campaign created and listed on the portal!");
        router.push('/fundraising');
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="fcp-form-wrapper">
      <div className="fcp-card">
        <h1 className="fcp-title">Start Campaign</h1>
        <form onSubmit={handleSubmit}>
          <div className="fcp-field-group">
            <label className="fcp-label">Campaign Title</label>
            <input required className="fcp-input" placeholder="e.g., Save Local Pottery" 
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="fcp-field-group">
            <label className="fcp-label">Goal Amount (LKR)</label>
            <input required type="number" className="fcp-input" placeholder="50000" 
              onChange={(e) => setFormData({...formData, goal: e.target.value})} />
          </div>
          <div className="fcp-field-group">
            <label className="fcp-label">Your Story</label>
            <textarea required className="fcp-textarea" style={{height: '150px'}} placeholder="Why do you need support?" 
              onChange={(e) => setFormData({...formData, story: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="fcp-submit-btn">
            {loading ? "Listing..." : "Launch Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}