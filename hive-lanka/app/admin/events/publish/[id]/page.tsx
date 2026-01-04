'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft, Upload, User, MapPin, Calendar, AlignLeft, CheckCircle } from 'lucide-react';

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
      // 1. Upload to Azure Blob Storage
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 2. Publish Event with the Azure URL
      const res = await fetch('/api/admin/events/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submission,
          submissionId: submission.id,
          posterImage: uploadData.url // The Azure Blob URL
        })
      });

      if (res.ok) {
        alert("🚀 Event Live on Board!");
        router.push('/admin/events');
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="hev-board-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} /> Back to Submissions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Submission Details */}
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <AlignLeft className="text-blue-600" /> Proposal Details
            </h2>
            
            <div className="space-y-6">
              <DetailBox label="Event Name" value={submission.eventName} icon={<CheckCircle size={16}/>} />
              <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Proposed By" value={submission.submitter?.name || "Unknown User"} icon={<User size={16}/>} />
                <DetailBox label="Date" value={new Date(submission.date).toDateString()} icon={<Calendar size={16}/>} />
              </div>
              <DetailBox label="Venue" value={submission.venue} icon={<MapPin size={16}/>} />
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Description</label>
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                  {submission.description}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Poster Design & Upload */}
          <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <ImageIcon className="text-green-600" /> Official Poster
            </h2>

            <form onSubmit={handlePublish} className="flex-1 flex flex-col">
              <div 
                className={`relative flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all ${previewUrl ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}
                style={{ minHeight: '300px' }}
              >
                {previewUrl ? (
                  <div className="w-full h-full relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain rounded-xl" />
                    <button 
                      type="button"
                      onClick={() => {setFile(null); setPreviewUrl(null);}}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold text-center">Upload Designed JPG/PNG</p>
                    <p className="text-slate-400 text-xs mt-1">Maximum size 5MB</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || !file}
                className={`w-full mt-6 p-5 rounded-2xl font-black text-lg shadow-lg transform transition-all active:scale-95 ${loading ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {loading ? "PROCESSING..." : "APPROVE & PUBLISH LIVE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">{label}</label>
      <div className="flex items-center gap-2 font-bold text-slate-800">
        <span className="text-blue-500">{icon}</span>
        {value}
      </div>
    </div>
  );
}