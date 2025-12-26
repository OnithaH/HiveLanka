'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, ArrowLeft, CreditCard, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SellerVerifyPage() {
  const [nicFile, setNicFile] = useState<File | null>(null);
  const [brFile, setBrFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('LOADING');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/status').then(res => res.json()).then(data => setStatus(data.status));
  }, []);

  const handleUpload = async () => {
    if (!nicFile || !brFile) {
        alert("Both NIC and Business Registration are required!");
        return;
    }
    setUploading(true);

    try {
      // 1. Upload NIC
      const nicData = new FormData();
      nicData.append('file', nicFile);
      const nicRes = await fetch('/api/upload', { method: 'POST', body: nicData });
      const { url: nicUrl } = await nicRes.json();

      // 2. Upload BR
      const brData = new FormData();
      brData.append('file', brFile);
      const brRes = await fetch('/api/upload', { method: 'POST', body: brData });
      const { url: brUrl } = await brRes.json();

      // 3. Submit Request
      await fetch('/api/user/verify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicUrl, brUrl }),
      });

      window.location.reload(); 
    } catch (error) {
      alert('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'PENDING') {
    return (
      <div className="verify-page-container">
        <div className="pending-status-card">
          <div className="pending-icon-wrapper"><Clock size={40} className="text-yellow-700" /></div>
          <h1 className="pending-title">Verification Pending</h1>
          <p className="pending-description">We have received your NIC and Business Registration. Our team is reviewing them.</p>
          <Link href="/seller/dashboard" className="pending-back-btn">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (status === 'APPROVED') {
     return (
      <div className="verify-page-container">
        <div className="pending-status-card" style={{ borderColor: '#86EFAC' }}>
          <div className="pending-icon-wrapper" style={{ background: '#DCFCE7' }}>
             <CheckCircle size={40} className="text-green-700" />
          </div>
          <h1 className="pending-title">You are Verified!</h1>
          <p className="pending-description">Your shop is now a verified seller on HiveLanka.</p>
          <Link href="/seller/dashboard" className="pending-back-btn">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page-container">
      <div className="verify-card max-w-2xl">
        <Link href="/seller/dashboard" className="verify-back-btn"><ArrowLeft size={18} className="mr-2" /> Back</Link>
        
        <h1 className="verify-title">Verify Your Shop</h1>
        <p className="verify-subtitle">Both documents are mandatory for verification.</p>

        <div className="grid md:grid-cols-2 gap-4">
            {/* NIC UPLOAD */}
            <div className={`upload-box ${nicFile ? 'border-green-500 bg-green-50' : ''}`}>
                <input type="file" accept="image/*" onChange={(e) => setNicFile(e.target.files?.[0] || null)} />
                <div className="upload-icon-container">
                    {nicFile ? (
                        <div className="upload-success"><CheckCircle size={32} className="mb-2"/><span className="file-name">{nicFile.name}</span></div>
                    ) : (
                        <><CreditCard size={32} className="upload-icon text-gray-400" /><span className="upload-label">Upload NIC</span></>
                    )}
                </div>
            </div>

            {/* BR UPLOAD */}
            <div className={`upload-box ${brFile ? 'border-green-500 bg-green-50' : ''}`}>
                <input type="file" accept="image/*" onChange={(e) => setBrFile(e.target.files?.[0] || null)} />
                <div className="upload-icon-container">
                    {brFile ? (
                        <div className="upload-success"><CheckCircle size={32} className="mb-2"/><span className="file-name">{brFile.name}</span></div>
                    ) : (
                        <><FileText size={32} className="upload-icon text-gray-400" /><span className="upload-label">Upload BR</span></>
                    )}
                </div>
            </div>
        </div>

        <button onClick={handleUpload} disabled={!nicFile || !brFile || uploading} className="verify-submit-btn mt-6">
          {uploading ? 'Uploading...' : 'Submit Documents'}
        </button>
      </div>
    </div>
  );
}