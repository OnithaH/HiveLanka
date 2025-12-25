'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  const pointsEarned = searchParams.get('points');

  return (
    <main className="order-success-page">
      <div className="success-container">
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order!   We've received your order and will process it shortly.
        </p>

        {orderNumber && (
          <div className="order-id-box">
            <p>Your Order Number:</p>
            <strong>{orderNumber}</strong>
          </div>
        )}

        {/* 🎁 LOYALTY POINTS EARNED BOX */}
        {pointsEarned && parseInt(pointsEarned) > 0 && (
          <div className="points-earned-box">
            <div className="points-icon"></div>
            <div className="points-content">
              <h3>You Earned {pointsEarned} Loyalty Points!</h3>
              <p><br></br></p>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link href="/loyalty">
            <button className="btn-primary">View My Points</button>
          </Link>
          <Link href="/orders">
            <button className="btn-secondary">Track Order</button>
          </Link>
          <Link href="/shop">
            <button className="btn-secondary">Continue Shopping</button>
          </Link>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 You'll receive an email confirmation shortly</li>
            <li>🎁 Your {pointsEarned || 0} loyalty points have been credited</li>
            <li>📦 Seller will process your order within 24 hours</li>
            <li>🚚 You'll be notified when your order ships</li>
            <li>⭐ Track your order status in "My Orders"</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="order-success-page">
        <div className="success-container">
          <p>Loading... </p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}