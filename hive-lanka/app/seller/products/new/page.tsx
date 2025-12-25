'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

export default function AddProductPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [isWholesale, setIsWholesale] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Split comma-separated image URLs into array
      const imagesArray = imageUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url. length > 0);

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          name,
          description,
          price:  parseFloat(price),
          category,
          stockQuantity:  parseInt(stockQuantity),
          images: imagesArray,
          isWholesale,
          deliveryAvailable,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Product added successfully!');
        router.push('/seller/dashboard');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-product-page">
      <div className="container">
        <div className="page-header">
          <h1>Add New Product</h1>
          <p>List your handmade product on Hive Lanka</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          
          {/* Basic Information */}
          <section className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Handmade Clay Pot"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product in detail..."
                rows={6}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (LKR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="How many items do you have?"
                min="0"
                required
              />
            </div>
          </section>

          {/* Product Images */}
          <section className="form-section">
            <h2>Product Images</h2>
            <p className="section-note">
              Enter image URLs separated by commas.  First image will be the main image.
            </p>

            <div className="form-group">
              <label>Image URLs *</label>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={4}
                required
              />
              <small>Tip: Upload images to Imgur, Cloudinary, or use placeholder images for testing</small>
            </div>
          </section>

          {/* Additional Options */}
          <section className="form-section">
            <h2>Additional Options</h2>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                />
                <span>This is a wholesale product (B2B)</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                />
                <span>Delivery available</span>
              </label>
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Adding Product...' : '✅ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}