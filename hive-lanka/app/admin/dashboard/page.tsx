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

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const pendingOrders = orders.filter(o =>
    ['PLACED', 'CONFIRMED'].includes(o.status)
  ).length;

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <>
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Admin.</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
          <Filter size={16} />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* STATS */}
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

      {/* ORDERS TABLE */}
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
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.status}</td>
                <td>LKR {Number(order.total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
