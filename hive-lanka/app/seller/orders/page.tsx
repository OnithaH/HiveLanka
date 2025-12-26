'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function SellerOrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/seller/orders?clerkId=${user?.id}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic Update
    setOrders((prev: any) => prev.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));

    try {
      const res = await fetch('/api/seller/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (error) {
      alert('Failed to update status');
      fetchOrders(); // Revert
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return '#FF9800'; // Orange
      case 'CONFIRMED': return '#2196F3'; // Blue
      case 'PACKED': return '#9C27B0'; // Purple
      case 'SHIPPED': return '#673AB7'; // Deep Purple
      case 'DELIVERED': return '#4CAF50'; // Green
      case 'CANCELLED': return '#F44336'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Orders...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#2E7D32' }}>Incoming Orders</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Manage orders from your customers</p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <h2>No orders yet</h2>
          <p style={{ color: '#666' }}>When customers buy your products, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {orders.map((order: any) => (
            <div key={order.id} style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Order #{order.orderNumber}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Customer: <strong>{order.customer?.name}</strong> ({order.customer?.email})
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ 
                      background: getStatusColor(order.status), 
                      color: 'white', 
                      padding: '5px 15px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      {order.status}
                    </span>
                  </div>
                  {/* Status Dropdown */}
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirm Order</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Hand Over to Courier</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancel Order</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '20px' }}>
                {order.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                    <Image 
                      src={item.product?.images[0] || '/images/placeholder.jpg'} 
                      alt={item.product?.name} 
                      width={60} height={60} 
                      style={{ borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{item.product?.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        Qty: {item.quantity} x LKR {Number(item.price).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer / Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Delivery Address: {order.deliveryAddress}, {order.deliveryCity}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32' }}>
                  Total: LKR {Number(order.total).toLocaleString()}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}