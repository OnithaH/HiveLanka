'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select from 'react-select';
import { BUSINESS_TYPES } from '@/lib/categories';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER' | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');

  const businessOptions = BUSINESS_TYPES. map(type => ({
  value: type,
  label: type
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName || user?.firstName || 'User',
          role,
          phone,
          location,
          district,
          ...(role === 'SELLER' && { businessName, businessType }),
        }),
      });

      if (response.ok) {
        router.push(role === 'SELLER' ? '/seller/dashboard' : '/shop');
      } else {
        alert('Failed to create profile');
      }
    } catch (error) {
      console.error(error);
      alert('Error! ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <h1 className="onboarding-title">Welcome!  🎉</h1>
        <p className="onboarding-subtitle">Set up your account</p>

        {! role ?  (
          <div className="role-selection">
            <h2>I want to: </h2>
            <div className="role-cards">
              <button className="role-card" onClick={() => setRole('CUSTOMER')}>
                <div className="role-icon">🛍️</div>
                <h3>Buy Products</h3>
                <p>Browse handicrafts</p>
              </button>
              <button className="role-card" onClick={() => setRole('SELLER')}>
                <div className="role-icon">🏪</div>
                <h3>Sell Products</h3>
                <p>Sell your crafts</p>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="onboarding-form">
            <h2>{role === 'SELLER' ?  '🏪 Seller Info' : '🛍️ Customer Info'}</h2>

            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" required />
            </div>

            <div className="form-group">
              <label>District *</label>
              <select value={district} onChange={(e) => setDistrict(e. target.value)} required>
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Jaffna">Jaffna</option>
              </select>
            </div>

            <div className="form-group">
              <label>City *</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Kandy" required />
            </div>

            {role === 'SELLER' && (
              <>
                <div className="form-group">
                  <label>Business Name *</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                </div>
                <div className="form-group">
                <label>Business Type *</label>
                <Select
                    options={businessOptions}
                    value={businessOptions.find(opt => opt.value === businessType)}
                    onChange={(option) => setBusinessType(option?. value || '')}
                    placeholder="Search or select..."
                    isSearchable
                />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="button" onClick={() => setRole(null)} className="btn-secondary">← Back</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating.. .' : 'Complete →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}