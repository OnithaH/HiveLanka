'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, ShoppingBag, Package, ArrowUpRight, Sparkles, ShieldCheck, Clock, ListChecks } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function SellerDashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('NONE');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // 1. Fetch Stats from your specific API route
          const statsRes = await fetch(`/api/seller/stats?clerkId=${user.id}`);
          const data = await statsRes.json();
          
          // 🔥 CORRECT DATA MAPPING: stats.totalProducts, stats.totalOrders, etc.
          setStats({
            totalRevenue: data.totalRevenue || 0,
            totalOrders: data.totalOrders || 0,
            totalProducts: data.totalProducts || 0
          });

          // 2. Trigger AI Analysis
          fetchAiInsight(data);

          // 3. Fetch Verification Status
          const statusRes = await fetch('/api/user/status');
          const statusData = await statusRes.json();
          if (statusData.status) setVerificationStatus(statusData.status);
          
        } catch (e) { console.error("Dashboard error:", e); }
        finally { setLoading(false); }
      };
      fetchData();
    }
  }, [user]);

  const fetchAiInsight = async (data: any) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/seller/ai-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revenue: data.totalRevenue,
          orders: data.totalOrders,
          products: data.totalProducts,
          topItem: data.topProduct || 'N/A'
        })
      });
      const aiData = await res.json();
      setAiInsight(aiData.insight);
    } catch (e) { console.error("AI insight error:", e); }
    finally { setAiLoading(false); }
  };

  if (loading) return <div className="hsh-dashboard-wrapper" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><h2 style={{color: '#94a3b8', fontWeight: 900}}>LOADING HIVE HUB...</h2></div>;

  return (
    <div className="hsh-dashboard-wrapper">
      <div className="hsh-main-container">
        
        {/* Header Section with All Action Buttons */}
        <div className="hsh-header-card">
          <div className="hsh-header-text">
            <h1>Seller Hub</h1>
            <p>Welcome back, {user?.firstName} 👋</p>
          </div>
          <div className="hsh-action-group">
            <Link href="/seller/orders" className="hsh-btn hsh-btn-blue"><ListChecks size={18}/> My Orders</Link>
            
            {verificationStatus === 'NONE' && (
              <Link href="/seller/verify" className="hsh-btn hsh-btn-maroon"><ShieldCheck size={18}/> Verify Shop</Link>
            )}
            {verificationStatus === 'PENDING' && (
              <div className="hsh-btn hsh-btn-yellow"><Clock size={18}/> Verification Pending</div>
            )}
            
            <Link href="/seller/products/new" className="hsh-btn hsh-btn-green"><ArrowUpRight size={18}/> Add Product</Link>
            <Link href="/seller/products" className="hsh-btn hsh-btn-blue"><ArrowUpRight size={18}/> Manage Product</Link>
          </div>
        </div>

        {/* AI Business Analyst Section */}
        <div className="hsh-ai-card">
          <div style={{background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center'}}><Sparkles size={24} color="#4338ca"/></div>
          <div className="hsh-ai-content">
            <h3>Hive AI Business Analyst</h3>
            {aiLoading ? (
              <p className="hsh-ai-text" style={{opacity: 0.5}}>Analyzing your sales data...</p>
            ) : (
              <p className="hsh-ai-text">{aiInsight || "Your personalized business strategies will appear here based on your sales!"}</p>
            )}
          </div>
        </div>

        {/* Stats Grid - Now correctly mapped to show product count */}
        <div className="hsh-stats-grid">
          <div className="hsh-stat-card">
            <span className="hsh-stat-label">Total Revenue</span>
            <div className="hsh-stat-value">LKR {stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="hsh-stat-card">
            <span className="hsh-stat-label">Total Orders</span>
            <div className="hsh-stat-value">{stats.totalOrders}</div>
          </div>
          <div className="hsh-stat-card">
            <span className="hsh-stat-label">Active Listings</span>
            <div className="hsh-stat-value">{stats.totalProducts}</div>
          </div>
          <div className="hsh-stat-card">
            <span className="hsh-stat-label">Performance</span>
            <div className="hsh-stat-value" style={{fontSize: '18px', color: '#16a34a'}}>Active</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="hsh-charts-row">
          <div className="hsh-chart-box">
             <Bar data={{
               labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
               datasets: [{ label: 'LKR', data: [4000, 7000, 5000, 11000, 8000, stats.totalRevenue], backgroundColor: '#16a34a', borderRadius: 8 }]
             }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <div className="hsh-chart-box">
             <Doughnut data={{
               labels: ['Orders', 'Products'],
               datasets: [{ data: [stats.totalOrders, stats.totalProducts], backgroundColor: ['#3b82f6', '#16a34a'], borderWidth: 0 }]
             }} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </div>
  );
}