'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useUser();
  
  // Stats State
  const [stats, setStats] = useState({
    products: 0,
    orders:  0,
    revenue: 0,
    reviews: 0,
  });
  
  // Verification State
  const [verificationStatus, setVerificationStatus] = useState('NONE'); // NONE, PENDING, APPROVED, REJECTED
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Stats
      const statsRes = await fetch(`/api/seller/stats?clerkId=${user?.id}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Fetch Verification Status
      const statusRes = await fetch('/api/user/status');
      const statusData = await statusRes.json();
      if (statusData.status) {
        setVerificationStatus(statusData.status);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        
        {/* HEADER SECTION WITH VERIFICATION UI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="dashboard-header mb-0">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-[#682626]">
              Welcome, {user?.firstName}!  🎉
              {/* ✅ BLUE TICK IF APPROVED */}
              {verificationStatus === 'APPROVED' && (
                <BadgeCheck className="text-blue-500 fill-blue-100" size={28} />
              )}
            </h1>
            <p className="text-gray-500 mt-1">Your Seller Dashboard</p>
          </div>

          {/* ✅ VERIFICATION ACTION BUTTONS */}
          <div className="w-full md:w-auto">
            {verificationStatus === 'NONE' && (
                <Link href="/seller/verify" className="flex items-center justify-center gap-2 bg-[#682626] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#4a1a1a] transition shadow-sm w-full md:w-auto">
                    <ShieldCheck size={20} /> Verify Shop
                </Link>
            )}
            {verificationStatus === 'PENDING' && (
                <div className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 px-5 py-3 rounded-xl font-bold border border-yellow-200 w-full md:w-auto">
                    <Clock size={20} /> Verification Pending
                </div>
            )}
            {verificationStatus === 'REJECTED' && (
                <Link href="/seller/verify" className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-xl font-bold border border-red-200 hover:bg-red-100 transition w-full md:w-auto">
                    <AlertCircle size={20} /> Rejected. Try Again?
                </Link>
            )}
          </div>
        </div>

        {/* STATS SECTION */}
        {loading ? (
          <div className="py-10 text-center text-gray-500 animate-pulse">Loading dashboard...</div>
        ) : (
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">{stats.products}</div>
                <div className="stat-label">Products</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <div className="stat-number">{stats.orders}</div>
                <div className="stat-label">Orders</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">LKR {stats.revenue.toLocaleString()}</div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{stats.reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="dashboard-actions">
          <Link href="/seller/products/new">
            <button className="btn-primary">➕ Add New Product</button>
          </Link>
          <Link href="/seller/products">
            <button className="btn-secondary">📦 Manage Products</button>
          </Link>
          <Link href="/seller/orders">
            <button className="btn-secondary">🛒 View Orders</button>
          </Link>
        </div>
      </div>
    </main>
  );
}