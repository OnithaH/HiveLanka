'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function ManageProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/seller/products?clerkId=${user?.id}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch('/api/seller/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        alert('✅ Product deleted!');
        fetchProducts();
      } else {
        alert('❌ Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Error deleting product');
    }
  };

  const toggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const response = await fetch('/api/seller/products/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status: newStatus }),
      });

      if (response.ok) {
        alert(`✅ Product ${newStatus.toLowerCase()}!`);
        fetchProducts();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p>Loading your products...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#2E7D32' }}>My Products</h1>
          <p style={{ color: '#666' }}>Manage your product listings</p>
        </div>
        <Link href="/seller/products/new">
          <button style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            ➕ Add New Product
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <h2>No products yet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Add your first product to start selling!</p>
          <Link href="/seller/products/new">
            <button style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Add Product
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {products.map((product: any) => (
            <div key={product.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {product.status === 'INACTIVE' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#F44336',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  zIndex: 10
                }}>
                  INACTIVE
                </div>
              )}

              <Image
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                width={300}
                height={250}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                  {product.description}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2E7D32', marginBottom: '10px' }}>
                  LKR {Number(product.price).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Stock: {product.stockQuantity} | Category: {product.category}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Link href={`/seller/products/edit/${product.id}`} style={{ flex: 1 }}>
                    <button style={{
                      width: '100%',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}>
                      ✏️ Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => toggleStatus(product.id, product.status)}
                    style={{
                      flex: 1,
                      background: product.status === 'ACTIVE' ? '#FF9800' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {product.status === 'ACTIVE' ? '🚫 Deactivate' : '✅ Activate'}
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      background: '#F44336',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}