'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ShieldAlert, FileCheck, CreditCard } from 'lucide-react';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    const res = await fetch('/api/admin/sellers');
    const data = await res.json();
    if (data.sellers) setSellers(data.sellers);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setSellers(prev =>
      prev.map(s => (s.id === id ? { ...s, verificationStatus: action } : s))
    );

    await fetch('/api/admin/sellers/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, action })
    });
  };

  if (loading) return <div className="loading-screen">Loading Requests...</div>;

  return (
    <div className="seller-verification-container">
      <div className="verification-header">
        <h1>Seller Verification</h1>
        <p>Review NIC & Business documents</p>
      </div>

      {sellers.length === 0 ? (
        <div className="empty-state">
          <ShieldAlert size={48} />
          <p>No pending requests</p>
        </div>
      ) : (
        sellers.map(seller => (
          <div key={seller.id} className="seller-card">
            <div>
              <h3>{seller.name}</h3>
              <span>{seller.email}</span>
            </div>

            <div>
              {seller.nicDocument && (
                <a href={seller.nicDocument} target="_blank">
                  <CreditCard /> NIC
                </a>
              )}
              {seller.businessDoc && (
                <a href={seller.businessDoc} target="_blank">
                  <FileCheck /> BR
                </a>
              )}
            </div>

            {seller.verificationStatus === 'PENDING' && (
              <div>
                <button onClick={() => handleAction(seller.id, 'APPROVED')}>
                  <CheckCircle /> Approve
                </button>
                <button onClick={() => handleAction(seller.id, 'REJECTED')}>
                  <XCircle /> Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
