'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CartItem = {
  id:  string;
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
    // Redirect if not signed in
    if (isLoaded && !user) {
      router.push('/sign-in? redirect_url=/checkout');
      return;
    }

    // Load cart
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

    // Pre-fill user data
    if (user) {
      setFullName(user. fullName || '');
      setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user, isLoaded, router]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 300;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          items: cart,
          shippingAddress: {
            fullName,
            phone,
            address,
            city,
            district,
            postalCode,
          },
          paymentMethod,
          notes,
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to success page
        router.push(`/order-success?orderId=${data.orderId}`);
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
    return (
      <main className="checkout-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-layout">
            
            {/* Left Side - Shipping & Payment Info */}
            <div className="checkout-details">
              
              {/* Shipping Information */}
              <section className="form-section">
                <h2>Shipping Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target. value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target. value)}
                      placeholder="07XXXXXXXX"
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target. value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, street name"
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>District *</label>
                    <select 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    >
                      <option value="">Select District</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Matale">Matale</option>
                      <option value="Galle">Galle</option>
                      <option value="Matara">Matara</option>
                      <option value="Jaffna">Jaffna</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input 
                    type="text" 
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g., 10100"
                    required 
                  />
                </div>
              </section>

              {/* Payment Method */}
              <section className="form-section">
                <h2>Payment Method</h2>
                
                <div className="payment-options">
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target. value)}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="BANK"
                      checked={paymentMethod === 'BANK'}
                      onChange={(e) => setPaymentMethod(e.target. value)}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <strong>Bank Transfer</strong>
                        <p>Pay via bank deposit</p>
                      </div>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={(e) => setPaymentMethod(e.target. value)}
                    />
                    <div className="payment-info">
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Credit/Debit Card</strong>
                        <p>Pay securely online</p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {/* Order Notes */}
              <section className="form-section">
                <h2>Order Notes (Optional)</h2>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  rows={4}
                  className="notes-textarea"
                />
              </section>
            </div>

            {/* Right Side - Order Summary */}
            <div className="order-summary-section">
              <div className="order-summary-card">
                <h2>Order Summary</h2>

                <div className="order-items">
                  {cart.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-image">
                        <Image 
                          src={item. image} 
                          alt={item.name} 
                          width={60} 
                          height={60}
                        />
                      </div>
                      <div className="summary-item-details">
                        <p className="summary-item-name">{item. name}</p>
                        <p className="summary-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <div className="summary-item-price">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>LKR {shipping.toLocaleString()}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="place-order-btn"
                >
                  {loading ? 'Processing...' :  'Place Order 🎉'}
                </button>

                <p className="secure-notice">
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}