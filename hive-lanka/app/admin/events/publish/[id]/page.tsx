'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, ArrowLeft, Upload, User, 
  MapPin, Calendar, AlignLeft, CheckCircle, Clock 
} from 'lucide-react';

export default function AdminPublishEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/events/submissions/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubmission(data.submission);
      })
      .catch(err => console.error("Load Error:", err));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a designed poster first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Azure
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error("Azure upload failed: " + uploadData.error);

      // Publish Event
      const res = await fetch('/api/admin/events/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          submissionId: submission.id,
          posterImage: uploadData.url
        })
      });

      if (res.ok) {
        alert("🚀 Event Published Successfully!");
        router.push('/admin/events');
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return <div style={{padding: '50px', textAlign: 'center', fontWeight: 'bold'}}>LOADING...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '30px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> BACK TO SUBMISSIONS
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* LEFT: Submission Details */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
              <AlignLeft color="#2563eb" /> Event Details
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <DetailBox label="Event Title" value={submission.eventName} icon={<CheckCircle size={18} color="#3b82f6" />} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <DetailBox label="Proposed By" value={submission.submitter?.name || "User"} icon={<User size={18} color="#3b82f6" />} />
                <DetailBox label="Date" value={new Date(submission.date).toDateString()} icon={<Calendar size={18} color="#3b82f6" />} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <DetailBox label="Venue" value={submission.venue} icon={<MapPin size={18} color="#3b82f6" />} />
                <DetailBox label="Time" value={submission.time} icon={<Clock size={18} color="#3b82f6" />} />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Full Description</label>
                <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '20px', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                  "{submission.description}"
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Design Upload (FIXED CLICK) */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
              <ImageIcon color="#16a34a" /> Poster Upload
            </h2>

            <form onSubmit={handlePublish} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* THE CLICKABLE AREA */}
              <label 
                style={{ 
                  flex: 1, 
                  minHeight: '350px', 
                  border: previewUrl ? '3px solid #4ade80' : '3px dashed #cbd5e1', 
                  borderRadius: '24px', 
                  background: previewUrl ? '#f0fdf4' : '#f8fafc',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* This input is hidden but triggered by the label click */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />

                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                ) : (
                  <>
                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                      <Upload size={32} color="#cbd5e1" />
                    </div>
                    <p style={{ color: '#64748b', fontWeight: 'bold' }}>Click to Upload Design</p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '5px' }}>PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>

              {previewUrl && (
                <button type="button" onClick={() => {setFile(null); setPreviewUrl(null);}} style={{ marginTop: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                  Remove Image ✕
                </button>
              )}

              <button 
                type="submit" 
                disabled={loading || !file}
                style={{ 
                  width: '100%', 
                  marginTop: '30px', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  background: loading ? '#cbd5e1' : '#1e293b', 
                  color: 'white', 
                  fontWeight: '900', 
                  fontSize: '16px', 
                  border: 'none', 
                  cursor: loading || !file ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {loading ? "UPLOADING TO AZURE..." : "APPROVE & GO LIVE"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#334155' }}>
        {icon} {value}
      </div>
    </div>
  );
}