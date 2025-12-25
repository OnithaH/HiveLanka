'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <main className="order-success-page">
      <div className="success-container">
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order!  We've received your order and will process it shortly.
        </p>

        {orderId && (
          <div className="order-id-box">
            <p>Your Order ID: </p>
            <strong>{orderId}</strong>
          </div>
        )}

        <div className="success-actions">
          <Link href="/shop">
            <button className="btn-primary">Continue Shopping</button>
          </Link>
          <Link href="/orders">
            <button className="btn-secondary">View My Orders</button>
          </Link>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 You'll receive an email confirmation shortly</li>
            <li>📦 Seller will process your order</li>
            <li>🚚 You'll be notified when your order ships</li>
            <li>⭐ You can track your order status in "My Orders"</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}