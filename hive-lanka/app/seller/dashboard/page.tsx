'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, ShoppingBag, Package, Star, Sparkles, ArrowUpRight } from 'lucide-react';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function SellerDashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    topProduct: 'N/A'
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/seller/stats?clerkId=${user?.id}`);
      const data = await res.json();
      setStats(data);
      fetchAiInsight(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
          topItem: data.topProduct
        })
      });
      const aiData = await res.json();
      setAiInsight(aiData.insight);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // --- CHART DATA ---
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (LKR)',
        data: [12000, 19000, 15000, 22000, 28000, stats.totalRevenue],
        backgroundColor: 'rgba(22, 163, 74, 0.8)', // Green
        borderRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  const orderStatusData = {
    labels: ['Completed', 'Pending', 'Shipped'],
    datasets: [
      {
        data: [
          Math.max(0, stats.totalOrders - 2), 
          1, 
          1
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(249, 115, 22, 0.8)',  // Orange
          'rgba(59, 130, 246, 0.8)',  // Blue
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
    },
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-xl font-semibold text-gray-500 animate-pulse">Loading Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your business performance in real-time</p>
          </div>
          <Link href="/seller/products/new">
            <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-green-600/20 hover:bg-green-700 hover:scale-105 transition-all active:scale-95">
              <ArrowUpRight size={20} />
              Add New Product
            </button>
          </Link>
        </div>

        {/* --- AI Insight Card (Styled for Tailwind) --- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative flex items-start gap-5 z-10">
            <div className="bg-white p-3 rounded-full shadow-sm shrink-0 border border-indigo-50">
              <Sparkles className="text-indigo-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">Hive AI Analyst Insight</h3>
              
              {aiLoading ? (
                <div className="animate-pulse space-y-2 max-w-2xl">
                  <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-indigo-800 text-base leading-relaxed font-medium whitespace-pre-line">
                  {aiInsight || "Analyzing your sales data to provide smart strategies..."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                LKR {stats.totalRevenue.toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 mt-1 text-sm font-medium text-green-600">
                <span>+12.5%</span>
                <span className="text-gray-400 font-normal">from last month</span>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.totalOrders}
              </h2>
              <Link href="/seller/orders" className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2 inline-block font-medium">
                View All Orders &rarr;
              </Link>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Products</span>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Package size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.totalProducts}
              </h2>
              <Link href="/seller/products" className="text-sm text-orange-600 hover:text-orange-800 hover:underline mt-2 inline-block font-medium">
                Manage Inventory &rarr;
              </Link>
            </div>
          </div>

          {/* Top Product Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Top Selling</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Star size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight" title={stats.topProduct}>
                {stats.topProduct}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Based on recent sales volume</p>
            </div>
          </div>

        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trends</h3>
            <div className="h-64 w-full">
              <Bar data={revenueData} options={revenueOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Order Status</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <Doughnut data={orderStatusData} options={pieOptions} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}