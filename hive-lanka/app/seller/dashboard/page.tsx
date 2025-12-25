'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SellerDashboard() {
  const { user } = useUser();

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.firstName}!  🎉</h1>
          <p>Your Seller Dashboard</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Products</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Orders</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">LKR 0</div>
              <div className="stat-label">Revenue</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
        </div>

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