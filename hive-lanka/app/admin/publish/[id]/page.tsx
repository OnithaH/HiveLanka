'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function AdminPublishEvent({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap params (Next.js 15 Requirement)
  const { id } = use(params);
  
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 2. Fetch specific submission
    fetch(`/api/admin/events/submissions/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load submission");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSubmission(data.submission);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 3. Publish to Live Event Table
    const res = await fetch('/api/admin/events/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        submissionId: submission.id,
        posterImage: posterUrl
      })
    });

    if (res.ok) {
      alert("✅ Event Published!");
      router.push('/admin/events'); // Redirect back to list
    } else {
      alert("Failed to publish.");
      setLoading(false);
    }
  };

  if (!submission) return <div className="p-10 font-bold text-center">Loading...</div>;

  return (
    <div className="hev-board-wrapper">
      <div className="hev-container" style={{maxWidth: '800px'}}>
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 font-bold text-slate-500">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="hev-card" style={{padding: '40px'}}>
          <h1 className="hev-title">Design Official Poster</h1>
          
          <form onSubmit={handlePublish}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Event Name</label>
                <div className="p-3 bg-slate-100 rounded-lg font-bold">{submission.eventName}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                <div className="p-3 bg-slate-100 rounded-lg font-bold">{new Date(submission.date).toDateString()}</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
              <div className="p-3 bg-slate-100 rounded-lg text-sm">{submission.description}</div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-green-600 uppercase mb-2 block">Official Poster URL</label>
              <div className="flex items-center gap-3">
                <ImageIcon className="text-slate-400" />
                <input 
                  required 
                  className="w-full p-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none"
                  placeholder="Paste image link here..."
                  onChange={(e) => setPosterUrl(e.target.value)} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="hev-btn">
              {loading ? "Publishing..." : "APPROVE & GO LIVE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}