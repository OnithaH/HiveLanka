'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

type Transaction = {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
};

export default function LoyaltyPage() {
  const { user } = useUser();
  const [points, setPoints] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
    }
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      const response = await fetch(`/api/loyalty/get?clerkId=${user?. id}`);
      const data = await response.json();
      
      if (data.success) {
        setPoints(data.points);
        setLifetime(data.lifetime);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loyalty-page"><p>Loading... </p></div>;
  }

  return (
    <main className="loyalty-page">
      <div className="container">
        <div className="loyalty-header">
          <h1>Your Loyalty Points</h1>
          <p>Earn points with every purchase and redeem for discounts! </p>
        </div>

        <div className="loyalty-cards">
          <div className="loyalty-card primary">
            <div className="card-icon">💎</div>
            <div className="card-content">
              <h3>Available Points</h3>
              <div className="points-number">{points}</div>
              <p className="points-value">Worth LKR {points}</p>
            </div>
          </div>

          <div className="loyalty-card">
            <div className="card-icon">⭐</div>
            <div className="card-content">
              <h3>Lifetime Earned</h3>
              <div className="points-number">{lifetime}</div>
              <p className="points-value">Total points ever earned</p>
            </div>
          </div>

          <div className="loyalty-card">
            <div className="card-icon">🏆</div>
            <div className="card-content">
              <h3>Your Tier</h3>
              <div className="tier-badge">
                {lifetime < 1000 ? 'Bronze' : lifetime < 5000 ? 'Silver' : 'Gold'}
              </div>
              <p className="points-value">
                {lifetime < 1000 ? `${1000 - lifetime} to Silver` : 'VIP Member'}
              </p>
            </div>
          </div>
        </div>

        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Shop & Earn</h3>
              <p>Earn 1 point for every Rs. 100 spent</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Collect Points</h3>
              <p>Points are added automatically after delivery</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Redeem</h3>
              <p>100 points = Rs. 100 discount on checkout</p>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((txn) => (
                <div key={txn.id} className="transaction-item">
                  <div className="txn-icon">
                    {txn.type === 'EARNED' ? '✅' : '🎁'}
                  </div>
                  <div className="txn-details">
                    <p className="txn-desc">{txn.description}</p>
                    <p className="txn-date">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`txn-points ${txn.type === 'EARNED' ? 'earned' : 'redeemed'}`}>
                    {txn.type === 'EARNED' ? '+' : '-'}{txn.points}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-transactions">No transactions yet. Start shopping to earn points!</p>
          )}
        </div>

        <Link href="/shop">
          <button className="btn-primary">Start Shopping</button>
        </Link>
      </div>
    </main>
  );
}