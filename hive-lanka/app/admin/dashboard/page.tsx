'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Filter } from 'lucide-react';

export default function AdminDashboardPage() {
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
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    // 1. Optimistic Update (Changes UI instantly)
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));

    try {
      // 2. Send to API
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');
    } catch (error) {
      alert('Failed to update status');
      fetchOrders(); // Revert on error
    }
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const pendingOrders = orders.filter(o =>
    ['PLACED', 'CONFIRMED'].includes(o.status)
  ).length;

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <>
      {/* HEADER - Keeping your exact UI */}
      <div className="admin-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Admin.</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
          <Filter size={16} />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ outline: 'none' }}>
            <option value="ALL">All</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* STATS - Keeping your exact UI */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Revenue</span>
          <div>LKR {totalRevenue.toLocaleString()}</div>
        </div>

        <div className="admin-stat-card">
          <span>Total Orders</span>
          <div>{orders.length}</div>
        </div>

        <div className="admin-stat-card">
          <span>Pending Actions</span>
          <div>{pendingOrders}</div>
        </div>
      </div>

      {/* ORDERS TABLE - Added 'Update Status' column only */}
      <div className="admin-panel">
        <div className="panel-header">
          <div className="panel-title">Recent Orders</div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th> {/* 🔥 Added Action Column */}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem',
                    background: order.status === 'DELIVERED' ? '#e8f5e9' : 
                                order.status === 'SHIPPED' ? '#e3f2fd' : 
                                order.status === 'CANCELLED' ? '#ffebee' : '#fff3e0',
                    color: order.status === 'DELIVERED' ? '#2e7d32' : 
                           order.status === 'SHIPPED' ? '#1565c0' : 
                           order.status === 'CANCELLED' ? '#c62828' : '#ef6c00',
                    fontWeight: 600
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>LKR {Number(order.total).toLocaleString()}</td>
                <td>
                  {/* 🔥 Status Update Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}