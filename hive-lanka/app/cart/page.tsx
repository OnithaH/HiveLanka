'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CartItem = {
  id:  string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON. parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item
  const removeItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 300 : 0; // LKR 300 flat shipping
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main className="cart-page">
        <div className="container">
          <p>Loading cart...</p>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some beautiful handicrafts to your cart!</p>
            <Link href="/shop">
              <button className="btn-primary">Start Shopping</button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart. map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={100} 
                    height={100}
                    className="cart-product-image"
                  />
                </div>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">LKR {item.price.toLocaleString()}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item. quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
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

            <button 
              className="btn-primary checkout-btn"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <Link href="/shop">
              <button className="btn-secondary continue-shopping-btn">
                ← Continue Shopping
              </button>
            </Link>

            <div className="payment-icons">
              <p>We accept: </p>
              <div className="icons">
                <span>💳</span>
                <span>🏦</span>
                <span>📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}