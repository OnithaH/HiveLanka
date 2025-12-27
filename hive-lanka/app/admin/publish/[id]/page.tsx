'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Send, ArrowLeft } from 'lucide-react';

export default function AdminPublishEvent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/events/submission/${params.id}`)
      .then(res => res.json())
      .then(data => setSubmission(data.submission));
  }, [params.id]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/events/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        submissionId: submission.id,
        posterImage: posterUrl // The official poster designed by Admin
      })
    });

    if (res.ok) {
      alert("🚀 Event Published to Public Board!");
      router.push('/admin/events');
    }
  };

  if (!submission) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
       <button onClick={() => router.back()} className="verify-back-btn">
        <ArrowLeft size={18} /> Back to Submissions
      </button>

      <div className="hev-form-card" style={{maxWidth: '800px', margin: '20px auto'}}>
        <h1 className="hev-title" style={{fontSize: '28px'}}>Design Official Event Poster</h1>
        <p style={{marginBottom: '30px', color: '#64748b'}}>Review raw data and provide a high-quality poster URL.</p>

        <form onSubmit={handlePublish}>
          <div className="grid grid-cols-2 gap-6">
            <div className="hev-input-group">
              <label className="hev-label">Event Name</label>
              <input readOnly className="hev-input" value={submission.eventName} style={{background: '#f8fafc'}} />
            </div>
            <div className="hev-input-group">
              <label className="hev-label">Event Date</label>
              <input readOnly className="hev-input" value={new Date(submission.date).toDateString()} style={{background: '#f8fafc'}} />
            </div>
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Official Poster URL (designed in Canva/PS)</label>
            <div style={{position: 'relative'}}>
              <ImageIcon style={{position: 'absolute', left: '15px', top: '18px', color: '#94a3b8'}} size={20} />
              <input 
                required 
                className="hev-input" 
                style={{paddingLeft: '50px'}}
                placeholder="https://imgur.com/example-poster.png"
                onChange={(e) => setPosterUrl(e.target.value)} 
              />
            </div>
          </div>

          <div className="hev-input-group">
            <label className="hev-label">Description Review</label>
            <textarea readOnly className="hev-textarea" value={submission.description} style={{background: '#f8fafc', height: '100px'}} />
          </div>

          <button type="submit" disabled={loading || !posterUrl} className="hev-btn" style={{width: '100%', marginTop: '20px'}}>
            {loading ? "Publishing..." : "APPROVE & PUBLISH LIVE"}
          </button>
        </form>
      </div>
    </div>
  );
}