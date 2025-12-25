'use client';

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="add-to-cart-section">
      <div className="quantity-selector">
        <button onClick={() => setQuantity(Math. max(1, quantity - 1))}>-</button>
        <input type="number" value={quantity} readOnly />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      
      <button 
        className={`btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
        onClick={handleAddToCart}
      >
        {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
      </button>
    </div>
  );
}