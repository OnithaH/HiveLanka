'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function MyOrdersPage() {
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
      const response = await fetch(`/api/orders/my-orders? clerkId=${user?.id}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const reorder = (order: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    order.items.forEach((item: any) => {
      const existing = cart.find((c: any) => c.productId === item.product.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push({
          productId: item.product.id,
          name: item.product. name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.product.images[0] || '/images/placeholder.jpg',
        });
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('✅ Items added to cart!');
  };

  const getStatusColor = (status: string) => {
    const colors:  any = {
      PLACED: '#FF9800',
      CONFIRMED: '#2196F3',
      PACKED: '#9C27B0',
      SHIPPED: '#FF5722',
      OUT_FOR_DELIVERY: '#FF9800',
      DELIVERED:  '#4CAF50',
      CANCELLED: '#F44336',
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign:  'center' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#2E7D32' }}>My Orders</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Track and manage your orders</p>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          background: 'white', 
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <h2>No orders yet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Start shopping to see your orders here!</p>
          <Link href="/shop">
            <button style={{
              background: '#4CAF50',
              color:  'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order: any) => (
            <div key={order.id} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>Order #{order.orderNumber}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div style={{
                  background: getStatusColor(order.status),
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius:  '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {order.status}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '20px' }}>
                {order.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <Image
                      src={item.product.images[0] || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '5px' }}>{item.product.name}</h4>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Quantity: {item.quantity} × LKR {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Amount</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2E7D32' }}>
                    LKR {Number(order.total).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => reorder(order)}
                  style={{
                    background: '#4CAF50',
                    color:  'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  🔄 Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}