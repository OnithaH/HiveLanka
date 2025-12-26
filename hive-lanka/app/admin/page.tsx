'use client';

import { useEffect, useState } from 'react';
import { 
  Package, Truck, CheckCircle, Clock, XCircle, 
  LayoutDashboard, Users, Settings, LogOut, Search, Filter 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));

    await fetch('/api/admin/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    fetchOrders();
  };

  // Filter Logic
  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter((o: any) => o.status === filter);

  // Stats Logic
  const totalRevenue = orders.reduce((sum, o: any) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o: any) => ['PLACED', 'CONFIRMED'].includes(o.status)).length;

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f4f6f8] text-[#682626]">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">HiveLanka Admin</div>
        <div>Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      {/* 1. SIDEBAR SECTION */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <LayoutDashboard size={28} />
          <span>HiveAdmin</span>
        </div>
        
        <nav>
          <div className="admin-nav-item active">
            <LayoutDashboard size={20} /> Overview
          </div>
          <div className="admin-nav-item">
            <Package size={20} /> Orders
          </div>
          <div className="admin-nav-item">
            <Users size={20} /> Customers
          </div>
          <div className="admin-nav-item">
            <Settings size={20} /> Settings
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-nav-item">
            <LogOut size={20} /> Exit to Store
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT SECTION */}
      <main className="admin-content">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Admin. Here is what’s happening today.</p>
          </div>
          <div className="flex gap-3">
             {/* Filter Dropdown */}
             <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                <Filter size={16} className="text-gray-400"/>
                <select 
                  className="bg-transparent outline-none text-sm font-medium text-gray-600"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PLACED">Placed</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
             </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-label">Total Revenue</span>
            <div className="stat-value">LKR {totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle size={14} /> Verified Earnings
            </p>
            <div className="stat-icon-bg"><Package size={120} /></div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Total Orders</span>
            <div className="stat-value">{orders.length}</div>
            <p className="text-sm text-gray-500">Lifetime orders</p>
            <div className="stat-icon-bg"><Truck size={120} /></div>
          </div>

          <div className="admin-stat-card">
            <span className="stat-label">Pending Actions</span>
            <div className="stat-value" style={{ color: pendingOrders > 0 ? '#E65100' : '#2E7D32' }}>
              {pendingOrders}
            </div>
            <p className="text-sm text-gray-500">Requires attention</p>
            <div className="stat-icon-bg"><Clock size={120} /></div>
          </div>
        </div>

        {/* Orders Table Panel */}
        <div className="admin-panel">
          <div className="panel-header">
            <div className="panel-title">Recent Orders</div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No orders found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs">{order.orderNumber}</td>
                      <td>
                        <div className="font-semibold">{order.customer?.name || 'Guest'}</div>
                        <div className="text-xs text-gray-400">{order.customer?.email}</div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status === 'PLACED' && <Clock size={14} />}
                          {order.status === 'DELIVERED' && <CheckCircle size={14} />}
                          {order.status === 'SHIPPED' && <Truck size={14} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="font-bold text-gray-800">
                        LKR {Number(order.total).toLocaleString()}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {order.status === 'PLACED' && (
                            <button onClick={() => updateStatus(order.id, 'CONFIRMED')} className="action-btn btn-confirm">
                              Confirm
                            </button>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <button onClick={() => updateStatus(order.id, 'PACKED')} className="action-btn btn-confirm">
                              Pack
                            </button>
                          )}
                          {order.status === 'PACKED' && (
                            <button onClick={() => updateStatus(order.id, 'SHIPPED')} className="action-btn btn-ship">
                              Ship
                            </button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="action-btn btn-deliver">
                              Complete
                            </button>
                          )}
                           {['PLACED', 'CONFIRMED'].includes(order.status) && (
                            <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="action-btn btn-cancel">
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}