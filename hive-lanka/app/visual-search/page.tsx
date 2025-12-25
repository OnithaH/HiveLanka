'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Upload, X, Search } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  images: string[];
  similarity: number;
  category: string;
  seller: {
    businessName: string | null;
  };
}

export default function VisualSearchPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiDescription, setAiDescription] = useState('');
  const [modelLoading, setModelLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (! file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader. readAsDataURL(file);
  };

  // Handle search with TensorFlow. js
  const handleSearch = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setSearching(true);
    setResults([]);
    setAiDescription('Analyzing image.. .');
    setModelLoading(true);

    try {
      // Dynamic import TensorFlow
      const tf = await import('@tensorflow/tfjs');
      const mobilenet = await import('@tensorflow-models/mobilenet');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');

      console.log('🤖 Loading AI models...');

      // Load models
      const [imageModel, objectModel] = await Promise.all([
        mobilenet.load(),
        cocoSsd.load(),
      ]);

      setModelLoading(false);
      console.log('✅ Models loaded');

      // Create image element
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Classify image
      const predictions = await imageModel.classify(img);
      const objects = await objectModel.detect(img);

      console.log('🔍 Predictions:', predictions);
      console.log('🎯 Objects:', objects);

      // Extract keywords
      const keywords = [
        ... predictions.map(p => p.className.toLowerCase()),
        ...objects.map(o => o.class.toLowerCase()),
      ];

      // Remove duplicates
      const uniqueKeywords = [...new Set(keywords)];

      console.log('🔑 Keywords:', uniqueKeywords);

      // Guess category
      const category = guessCategory(uniqueKeywords);

      setAiDescription(
        `Detected:  ${predictions[0].className} (${Math.round(predictions[0].probability * 100)}% confidence). 
        Objects found: ${objects.map(o => o.class).join(', ') || 'none'}. 
        Category: ${category}`
      );

      // Search database
      const response = await fetch('/api/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords:  uniqueKeywords,
          category,
          topPrediction: predictions[0].className,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        alert(`Error: ${data.error}`);
      }

    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to analyze image');
    } finally {
      setSearching(false);
    }
  };

  // Guess category from keywords
  const guessCategory = (keywords: string[]): string => {
    const categoryMap:  Record<string, string[]> = {
      'Honey & Bee Products': ['honey', 'jar', 'bottle', 'bee', 'honeycomb', 'wax'],
      'Handicrafts': ['wood', 'wooden', 'carved', 'craft', 'handmade', 'sculpture'],
      'Jewelry': ['necklace', 'bracelet', 'ring', 'jewelry', 'gold', 'silver'],
      'Textiles': ['fabric', 'cloth', 'textile', 'scarf', 'dress', 'shirt'],
      'Food & Beverages': ['food', 'drink', 'tea', 'spice', 'beverage', 'plate'],
      'Home Decor': ['vase', 'lamp', 'cushion', 'frame', 'decor', 'pot'],
    };

    for (const [category, terms] of Object.entries(categoryMap)) {
      if (keywords. some(keyword => terms.some(term => keyword.includes(term)))) {
        return category;
      }
    }

    return 'Other';
  };

  // Clear search
  const clearSearch = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResults([]);
    setAiDescription('');
  };

  return (
    <main className="visual-search-page">
      <div className="container">
        
        {/* Header */}
        <div className="page-header">
          <h1>🔍 AI Visual Search</h1>         
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          
          {! selectedImage ? (
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                id="image-upload"
                className="hidden-input"
              />
              
              <label htmlFor="image-upload" className="upload-label">
                <Camera size={64} className="upload-icon" />
                <h3>Upload or Take a Photo</h3>
                <p>PNG, JPG, WEBP up to 10MB</p>
                <button type="button" className="btn-primary">
                  <Upload size={20} /> Choose Image
                </button>
              </label>
            </div>
          ) : (
            <div className="preview-section">
              <div className="preview-image-container">
                <Image
                  ref={imgRef}
                  src={selectedImage}
                  alt="Selected product"
                  width={400}
                  height={400}
                  className="preview-image"
                />
                <button onClick={clearSearch} className="clear-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="search-actions">
                <button
                  onClick={handleSearch}
                  disabled={searching || modelLoading}
                  className="btn-primary search-btn"
                >
                  {modelLoading ? (
                    <>⏳ Loading AI Models...</>
                  ) : searching ? (
                    <>🔍 Searching...</>
                  ) : (
                    <><Search size={20} /> Find Similar Products</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Description */}
        {aiDescription && (
          <div className="ai-description">
            <h3>🤖 AI Analysis: </h3>
            <p>{aiDescription}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="results-section">
            <h2>Similar Products Found ({results.length})</h2>
            <div className="results-grid">
              {results.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="result-card">
                    <div className="result-image">
                      <Image
                        src={product.images[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="product-img"
                      />
                      <div className="similarity-badge">
                        {Math.round(product.similarity * 100)}% Match
                      </div>
                    </div>
                    <div className="result-info">
                      <h4>{product.name}</h4>
                      <p className="category">{product.category}</p>
                      <p className="price">LKR {product.price.toLocaleString()}</p>
                      <p className="seller">{product.seller.businessName}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {! searching && results.length === 0 && aiDescription && (
          <div className="no-results">
            <p>😔 No similar products found. Try another image! </p>
          </div>
        )}

      </div>
    </main>
  );
}