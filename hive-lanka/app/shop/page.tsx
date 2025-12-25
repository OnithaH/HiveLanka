'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

type ProductWithSeller = {
  id: string;
  name:  string;
  description: string;
  price: number;
  images: string[];
  category: string;
  seller:  {
    businessName: string | null;
    verified: boolean;
  };
};

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSeller[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      console.log('🔍 Filtering products with query:', searchQuery);
      
      const filtered = products.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.seller.businessName?.toLowerCase().includes(query)
        );
      });
      
      setFilteredProducts(filtered);
      console.log(`✅ Found ${filtered.length} matching products`);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response. json();
      
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shop-page">
      <div className="shop-container">
        <h1 className="shop-title">Shop Handicrafts</h1>
        <p className="shop-subtitle">
          {searchQuery 
            ? `Search results for "${searchQuery}"` 
            : 'Discover authentic Sri Lankan products'}
        </p>

        {/* Search info */}
        {searchQuery && (
          <div className="search-info">
            <p>
              Found <strong>{filteredProducts.length}</strong> product
              {filteredProducts.length !== 1 ? 's' :  ''} matching "{searchQuery}"
            </p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ?  (
          <div className="loading-state">
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="shop-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts. map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : searchQuery ?  (
              <div className="no-results">
                <p>😔 No products found for "{searchQuery}"</p>
                <p>Try different keywords or browse all products</p>
                <button 
                  onClick={() => window.location.href = '/shop'}
                  className="btn-primary"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <p className="no-products">No products available</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="loading-state">Loading shop... </div>}>
      <ShopContent />
    </Suspense>
  );
}