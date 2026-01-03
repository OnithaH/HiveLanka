'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function AdminPublishEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Next.js 15 requirement
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetching from the PLURAL submissions route
    fetch(`/api/admin/events/submissions/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubmission(data.submission);
      })
      .catch(err => console.error("Load Error:", err));
  }, [id]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      router.push('/admin/events');
    } else {
      alert("Failed to publish.");
      setLoading(false);
    }
  };

  if (!submission) return <div className="p-10 font-bold text-center">Loading Details...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 font-bold text-slate-500">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="bg-white p-10 rounded-3xl border shadow-sm">
        <h1 className="text-2xl font-black mb-6">Design Official Poster</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl">
                <label className="text-xs font-bold text-slate-400 uppercase">Event</label>
                <div className="font-bold">{submission.eventName}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
                <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                <div className="font-bold">{new Date(submission.date).toDateString()}</div>
            </div>
        </div>
        <form onSubmit={handlePublish}>
          <label className="block text-xs font-bold text-green-600 uppercase mb-2">Poster Image URL</label>
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon className="text-slate-300" />
            <input required className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-green-500" 
              placeholder="Paste image link..." onChange={(e) => setPosterUrl(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-5 rounded-2xl font-black text-lg">
            {loading ? "Publishing..." : "APPROVE & GO LIVE"}
          </button>
        </form>
      </div>
    </div>
  );
}