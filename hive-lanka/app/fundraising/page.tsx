'use client';
import { useState, useEffect } from 'react';

export default function FundraisingPortal() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fundraising/campaigns')
      .then(res => res.json()).then(data => {
        setCampaigns(data.campaigns || []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleDonate = async (campaignId: string, amount: number) => {
    alert("💸 Payment Successful! (Demo Sandbox Mode)");
    const res = await fetch('/api/fundraising/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, amount })
    });
    if (res.ok) { window.location.reload(); }
  };

  if (loading) return <div className="hfp-portal-container" style={{textAlign: 'center'}}>LOADING...</div>;

  return (
    <div className="hfp-portal-container">
      <div className="hfp-grid">
        {campaigns.map((c) => {
          const progress = Math.min((Number(c.raised) / Number(c.goal)) * 100, 100);
          return (
            <div key={c.id} className="hfp-campaign-card">
              <h2 style={{fontSize: '20px', fontWeight: '900'}}>{c.title}</h2>
              <p style={{color: '#64748b', margin: '10px 0'}}>{c.story}</p>
              <div className="hfp-progress-container">
                <div className="hfp-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                <span>{progress.toFixed(1)}% Raised</span>
                <span>Goal: LKR {Number(c.goal).toLocaleString()}</span>
              </div>
              <button onClick={() => handleDonate(c.id, 1000)} className="hev-btn" style={{width: '100%', marginTop: '20px', background: '#2563eb'}}>DONATE LKR 1,000</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}