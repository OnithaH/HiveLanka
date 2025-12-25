'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PRODUCT_CATEGORIES } from '@/lib/categories';
import Image from 'next/image';

export default function AddProductPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [images, setImages] = useState<string[]>([]); // Changed from imageUrls to images array
  const [isWholesale, setIsWholesale] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Filter categories
    const filteredCategories = PRODUCT_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

  // Handle image upload to Azure
  const handleImageUpload = async (e: React. ChangeEvent<HTMLInputElement>) => {
    const files = e. target.files;
    if (! files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        console.log('📤 Uploading:', file.name);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          uploadedUrls.push(data.url);
          console.log('✅ Uploaded:', data.url);
        } else {
          console.error('❌ Upload failed:', data.error);
          alert(`Failed to upload ${file.name}`);
        }
      }

      setImages([...images, ... uploadedUrls]);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index:  number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          name,
          description,
          price:  parseFloat(price),
          category,
          stockQuantity: parseInt(stockQuantity),
          images, // Now using uploaded URLs from Azure
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
                <div className="category-input-wrapper">
                    <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => {
                        setCategorySearch(e. target.value);
                        setShowCategoryDropdown(true);
                    }}
                    onFocus={() => setShowCategoryDropdown(true)}
                    placeholder="Type to search categories..."
                    required
                    />
                    
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                    <div className="category-dropdown">
                        {filteredCategories.map((cat) => (
                        <div
                            key={cat}
                            className="category-option"
                            onClick={() => {
                            setCategory(cat);
                            setCategorySearch(cat);
                            setShowCategoryDropdown(false);
                            }}
                        >
                            {cat}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>

              <div className="form-group">
                <label>Price (LKR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
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
                placeholder="0"
                required
              />
            </div>
          </section>

          {/* Image Upload Section */}
          <section className="form-section">
            <h2>Product Images</h2>

            <div className="form-group">
              <label>Upload Images (Max 5) *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading || images.length >= 5}
                className="file-input"
              />
              {uploading && <p className="upload-status">⏳ Uploading...</p>}
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="image-previews">
                {images. map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <Image
                      src={url}
                      alt={`Product ${index + 1}`}
                      width={150}
                      height={150}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Options */}
          <section className="form-section">
            <h2>Options</h2>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                />
                <span>&nbsp;&nbsp;&nbsp;Available for wholesale</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                />
                <span>&nbsp;&nbsp;&nbsp;Delivery available</span>
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || images.length === 0}
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}