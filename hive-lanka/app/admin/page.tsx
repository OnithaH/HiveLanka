'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(d => setOrders(d.orders));
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch('/api/admin/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    
    alert(`✅ Order updated to ${newStatus}`);
    window.location.reload();
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>🛡️ Admin - All Orders</h1>
      
      {orders.map((order: any) => (
        <div key={order.id} style={{ 
          background: 'white', 
          padding:  '20px', 
          margin: '10px 0',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Order #{order.orderNumber}</h3>
          <p><strong>Customer:</strong> {order.customer. name}</p>
          <p><strong>Total:</strong> LKR {Number(order.total).toLocaleString()}</p>
          <p><strong>Status:</strong> <span style={{ 
            background: order.status === 'DELIVERED' ? '#4CAF50' : '#FF9800',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px'
          }}>{order.status}</span></p>
          
          <div style={{ marginTop:  '15px', display: 'flex', gap: '10px' }}>
            {order.status === 'PLACED' && (
              <button onClick={() => updateStatus(order.id, 'CONFIRMED')} 
                style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                ✅ Confirm
              </button>
            )}
            
            {order.status === 'CONFIRMED' && (
              <button onClick={() => updateStatus(order.id, 'PACKED')}
                style={{ padding: '10px 20px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                📦 Mark Packed
              </button>
            )}
            
            {order. status === 'PACKED' && (
              <button onClick={() => updateStatus(order.id, 'SHIPPED')}
                style={{ padding: '10px 20px', background: '#FF9800', color: 'white', border: 'none', borderRadius:  '5px', cursor: 'pointer' }}>
                🚚 Ship Order
              </button>
            )}
            
            {order.status === 'SHIPPED' && (
              <button onClick={() => updateStatus(order.id, 'DELIVERED')}
                style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border:  'none', borderRadius: '5px', cursor: 'pointer' }}>
                ✅ Mark Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}