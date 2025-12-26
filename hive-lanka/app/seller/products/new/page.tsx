'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PRODUCT_CATEGORIES, CATEGORY_TRANSLATIONS } from '@/lib/categories';
import { useLanguage } from '@/lib/LanguageContext'; // 🔥 Import Language Hook
import Image from 'next/image';

// 🔥 Translations Dictionary
const translations = {
  en: {
    title: "Add New Product",
    subtitle: "List your handmade product on Hive Lanka",
    basicInfo: "Basic Information",
    productName: "Product Name *",
    productNamePlaceholder: "e.g., Handmade Clay Pot",
    description: "Description *",
    descriptionPlaceholder: "Describe your product in detail...",
    category: "Category *",
    categoryPlaceholder: "Type to search categories...",
    price: "Price (LKR) *",
    stock: "Stock Quantity *",
    imagesSection: "Product Images",
    uploadLabel: "Upload Images (Max 5) *",
    uploading: "⏳ Uploading...",
    options: "Options",
    wholesale: "Available for wholesale",
    delivery: "Delivery available",
    createButton: "Create Product",
    creatingButton: "Creating Product...",
    success: "✅ Product added successfully!",
    errorImage: "Please upload at least one image",
    errorUpload: "Failed to upload images",
    errorGeneric: "Failed to add product"
  },
  si: {
    title: "නව භාණ්ඩයක් එකතු කරන්න",
    subtitle: "ඔබගේ අත්කම් නිර්මාණ Hive Lanka හි ලැයිස්තුගත කරන්න",
    basicInfo: "මූලික විස්තර",
    productName: "භාණ්ඩයේ නම *",
    productNamePlaceholder: "උදා: අතින් සාදන ලද මැටි වළඳ",
    description: "විස්තරය *",
    descriptionPlaceholder: "ඔබේ භාණ්ඩය ගැන විස්තරාත්මකව ලියන්න...",
    category: "වර්ගය *",
    categoryPlaceholder: "වර්ගය සොයන්න...",
    price: "මිල (LKR) *",
    stock: "තොග ප්‍රමාණය *",
    imagesSection: "භාණ්ඩයේ පින්තූර",
    uploadLabel: "පින්තූර උඩුගත කරන්න (උපරිම 5) *",
    uploading: "⏳ උඩුගත කරමින්...",
    options: "වෙනත්",
    wholesale: "තොග වශයෙන් ලබා දිය හැක",
    delivery: "බෙදාහැරීමේ පහසුකම් ඇත",
    createButton: "භාණ්ඩය එකතු කරන්න",
    creatingButton: "සකසමින් පවතී...",
    success: "✅ භාණ්ඩය සාර්ථකව එකතු කරන ලදී!",
    errorImage: "කරුණාකර අවම වශයෙන් එක් පින්තූරයක් හෝ උඩුගත කරන්න",
    errorUpload: "පින්තූර උඩුගත කිරීම අසාර්ථකයි",
    errorGeneric: "භාණ්ඩය එකතු කිරීම අසාර්ථකයි"
  }
};

export default function AddProductPage() {
  const { user } = useUser();
  const router = useRouter();
  const { language } = useLanguage(); // 🔥 Get current language
  const t = translations[language];   // 🔥 Get translations

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isWholesale, setIsWholesale] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 🔥 Filter categories based on language
  const filteredCategories = PRODUCT_CATEGORIES.filter(catKey => {
    // If Sinhala, search against the Sinhala name
    const displayName = language === 'si' ? (CATEGORY_TRANSLATIONS[catKey] || catKey) : catKey;
    return displayName.toLowerCase().includes(categorySearch.toLowerCase());
  });

  // Handle image upload to Azure
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          uploadedUrls.push(data.url);
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      }

      setImages([...images, ...uploadedUrls]);

    } catch (error) {
      console.error('Upload error:', error);
      alert(t.errorUpload);
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert(t.errorImage);
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
          price: parseFloat(price),
          category, // Saves the English Key (e.g., "Clay Pots")
          stockQuantity: parseInt(stockQuantity),
          images, 
          isWholesale,
          deliveryAvailable,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t.success);
        router.push('/seller/dashboard');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-product-page">
      <div className="container">
        <div className="page-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          
          {/* Basic Information */}
          <section className="form-section">
            <h2>{t.basicInfo}</h2>

            <div className="form-group">
              <label>{t.productName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.productNamePlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label>{t.description}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows={6}
                required
              />
            </div>

            <div className="form-row">
                <div className="form-group">
                <label>{t.category}</label>
                <div className="category-input-wrapper">
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      placeholder={t.categoryPlaceholder}
                      required
                    />
                    
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                    <div className="category-dropdown">
                        {filteredCategories.map((catKey) => {
                          // 🔥 Display Translated Name
                          const displayName = language === 'si' ? (CATEGORY_TRANSLATIONS[catKey] || catKey) : catKey;
                          
                          return (
                            <div
                                key={catKey}
                                className="category-option"
                                onClick={() => {
                                  setCategory(catKey); // Store ID (English)
                                  setCategorySearch(displayName); // Show Display Name
                                  setShowCategoryDropdown(false);
                                }}
                            >
                                {displayName}
                            </div>
                          );
                        })}
                    </div>
                    )}
                </div>
                </div>

              <div className="form-group">
                <label>{t.price}</label>
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
              <label>{t.stock}</label>
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
            <h2>{t.imagesSection}</h2>

            <div className="form-group">
              <label>{t.uploadLabel}</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading || images.length >= 5}
                className="file-input"
              />
              {uploading && <p className="upload-status">{t.uploading}</p>}
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="image-previews">
                {images.map((url, index) => (
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
            <h2>{t.options}</h2>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                />
                <span>&nbsp;&nbsp;&nbsp;{t.wholesale}</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                />
                <span>&nbsp;&nbsp;&nbsp;{t.delivery}</span>
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
              {loading ? t.creatingButton : t.createButton}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}