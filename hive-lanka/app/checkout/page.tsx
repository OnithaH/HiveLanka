'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CartItem = {
  id:  string;
  productId: string;
  name:  string;
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
    // Redirect if not signed in
    if (isLoaded && !user) {
      router.push('/sign-in? redirect_url=/checkout');
      return;
    }

    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON. parse(savedCart);
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
      setEmail(user.primaryEmailAddress?. emailAddress || '');
      fetchLoyaltyPoints();
    }
  }, [user, isLoaded, router]);

  const fetchLoyaltyPoints = async () => {
    try {
      const response = await fetch(`/api/loyalty/balance?clerkId=${user?.id}`);
      const data = await response. json();
      setLoyaltyPoints(data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch loyalty points:', error);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 300;
  const discount = pointsToUse; // 100 points = LKR 100
  const total = subtotal + shipping - discount;

  const handleApplyPoints = () => {
    if (pointsToUse > loyaltyPoints) {
      alert(`❌ You only have ${loyaltyPoints} points available`);
      setPointsToUse(0);
      return;
    }
    if (pointsToUse > subtotal) {
      alert(`❌ Points cannot exceed subtotal amount`);
      setPointsToUse(Math.min(loyaltyPoints, subtotal));
      return;
    }
    alert(`✅ ${pointsToUse} points applied!  Discount:  LKR ${pointsToUse}`);
  };

  const handleUseAllPoints = () => {
    const maxPoints = Math.min(loyaltyPoints, subtotal);
    setPointsToUse(maxPoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders/create', {
        method:  'POST',
        headers:  { 'Content-Type': 'application/json' },
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
          subtotal,
          shipping,
          discount,
          totalAmount: total,
          pointsUsed: pointsToUse,
        }),
      });

      const data = await response. json();

      if (response. ok) {
        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to success page
        router.push(`/order-success?orderId=${data.orderId}&orderNumber=${data.orderNumber}&points=${data.pointsEarned}`);
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
          <p>Loading... </p>
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
                      onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="e. g., 10100"
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
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
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
                      onChange={(e) => setPaymentMethod(e.target.value)}
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
              
              {/* 🔥 LOYALTY POINTS CARD */}
              {loyaltyPoints > 0 && (
                <div className="loyalty-points-card">
                  <h2>⭐ Use Loyalty Points</h2>
                  <p className="points-available">
                    You have <strong>{loyaltyPoints}</strong> points available
                  </p>
                  <p className="points-value">100 points = LKR 100 discount</p>

                  <div className="points-input-group">
                    <input
                      type="number"
                      value={pointsToUse}
                      onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), loyaltyPoints, subtotal))}
                      placeholder="Points to use"
                      min="0"
                      max={Math.min(loyaltyPoints, subtotal)}
                      className="points-input"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPoints}
                      className="apply-points-btn"
                    >
                      Apply
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseAllPoints}
                    className="use-all-points-btn"
                  >
                    Use All Available Points
                  </button>

                  {pointsToUse > 0 && (
                    <div className="points-applied">
                      ✅ Discount applied:  LKR {pointsToUse. toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* ORDER SUMMARY */}
              <div className="order-summary-card">
                <h2>Order Summary</h2>

                <div className="order-items">
                  {cart.map((item) => (
                    <div key={item. id} className="summary-item">
                      <div className="summary-item-image">
                        <Image 
                          src={item.image} 
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
                  
                  {discount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Points Discount</span>
                      <span>- LKR {discount.toLocaleString()}</span>
                    </div>
                  )}

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
                  {loading ? 'Processing...' : 'Place Order 🎉'}
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