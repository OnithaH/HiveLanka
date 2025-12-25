'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SellerDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    products: 0,
    orders:  0,
    revenue: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSellerStats();
    }
  }, [user]);

  const fetchSellerStats = async () => {
    try {
      const response = await fetch(`/api/seller/stats? clerkId=${user?. id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.firstName}!  🎉</h1>
          <p>Your Seller Dashboard</p>
        </div>

        {loading ? (
          <p>Loading stats...</p>
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
                <div className="stat-number">LKR {stats.revenue. toLocaleString()}</div>
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