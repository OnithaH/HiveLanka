'use client';
import { useState, useEffect } from 'react';

export default function FundraisingPortal() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fundraising/campaigns')
      .then(res => res.ok ? res.json() : { campaigns: [] }) // Safety check for empty responses
      .then(data => {
        setCampaigns(data.campaigns || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDonate = async (campaignId: string, amount: number) => {
    // Simulate payment success before database update
    alert("💸 Payment Successful! Updating artisan ledger...");

    const res = await fetch('/api/fundraising/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, amount })
    });

    if (res.ok) {
      alert("❤️ Thank you for your support!");
      window.location.reload(); // Refresh to see progress bar move
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Loading Campaigns...</div>;

  return (
    <div className="hsh-dashboard-wrapper">
      <div className="hsh-main-container">
        <h1 className="text-3xl font-black mb-8 uppercase text-slate-900">Fundraising Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.length === 0 ? (
            <p className="text-slate-500">No active campaigns at the moment.</p>
          ) : (
            campaigns.map((c) => {
              // Calculate progress percentage: (raised / goal) * 100
              const progress = Math.min((Number(c.raised) / Number(c.goal)) * 100, 100);
              
              return (
                <div key={c.id} className="hsh-header-card !flex-col !items-start">
                  <h2 className="text-xl font-bold">{c.title}</h2>
                  <p className="text-slate-500 text-sm my-4 line-clamp-3">{c.story}</p>
                  
                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden border">
                    <div 
                      className="h-full bg-green-600 transition-all duration-1000" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between w-full mt-2 mb-6 text-sm font-bold">
                    <span className="text-green-700">{progress.toFixed(1)}% Raised</span>
                    <span className="text-slate-400">Goal: LKR {Number(c.goal).toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={() => handleDonate(c.id, 1000)} 
                    className="hsh-add-btn w-full !bg-blue-600"
                  >
                    Donate LKR 1,000
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}