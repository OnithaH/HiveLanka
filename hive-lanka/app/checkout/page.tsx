'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CartItem = {
  id: string; // Product ID from localStorage
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CheckoutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/signin?redirect_url=/checkout');
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(parsedCart);
    } else {
      router.push('/cart');
    }

    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.primaryEmailAddress?.emailAddress || '');
      fetchLoyaltyPoints();
    }
  }, [user, isLoaded, router]);

  const fetchLoyaltyPoints = async () => {
    try {
      const response = await fetch(`/api/loyalty/balance?clerkId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setLoyaltyPoints(data.balance || 0);
      }
    } catch (error) {
      console.error('Failed to fetch loyalty points:', error);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 300;
  const discount = pointsToUse; 
  const total = subtotal + shipping - discount;

  const handleUseAllPoints = () => {
    const maxPoints = Math.min(loyaltyPoints, subtotal);
    setPointsToUse(maxPoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 FIX: Map 'id' to 'productId' for the backend
    const formattedCart = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          cart: formattedCart, // Send as 'cart' to match backend
          deliveryInfo: {
            fullName,
            phone,
            address,
            city,
            district,
            postalCode,
            paymentMethod,
          },
          notes,
          subtotal,
          deliveryFee: shipping,
          discount,
          total,
          pointsUsed: pointsToUse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        router.push(`/order-success?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}&points=${data.pointsEarned}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || cart.length === 0) {
    return <div style={{padding:'50px', textAlign:'center'}}>Loading Checkout...</div>;
  }

  return (
    <main className="checkout-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#2E7D32' }}>Checkout</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        
        {/* LEFT COLUMN: FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <section style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Shipping Information</h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                <input type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
            </div>
          </section>

          <section style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Payment Method</h2>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </section>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* LOYALTY CARD - ALWAYS VISIBLE */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '2px solid #FF9800' 
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#E65100', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⭐ Loyalty Points
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#5D4037' }}>
              Available Balance: <strong>{loyaltyPoints}</strong>
            </p>

            {loyaltyPoints > 0 ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  value={pointsToUse} 
                  onChange={e => setPointsToUse(Math.min(Number(e.target.value), loyaltyPoints, subtotal))}
                  min="0" 
                  max={Math.min(loyaltyPoints, subtotal)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button type="button" onClick={handleUseAllPoints} style={{ background: '#E65100', color: 'white', border: 'none', padding: '0 15px', borderRadius: '6px', cursor: 'pointer' }}>Max</button>
              </div>
            ) : (
               <p style={{ fontSize: '0.9rem', color: '#777' }}>You need points to get a discount. Buy more to earn!</p>
            )}
            
            {pointsToUse > 0 && (
              <p style={{ marginTop: '10px', color: '#2E7D32', fontWeight: 'bold' }}>✅ Saving LKR {pointsToUse}</p>
            )}
          </div>

          {/* TOTALS */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>LKR {shipping.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                  <span>Points Discount</span>
                  <span>- LKR {discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #eee' }}>
                <span>Total</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                marginTop: '20px', 
                padding: '15px', 
                background: '#2E7D32', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>

        </div>
      </form>
    </main>
  );
}