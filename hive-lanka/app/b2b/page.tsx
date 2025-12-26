'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

type ProductWithSeller = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  seller: {
    businessName: string | null;
    verified: boolean;
  };
};

function B2BContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSeller[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch B2B products
  useEffect(() => {
    fetchB2BProducts();
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
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
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchB2BProducts = async () => {
    try {
      setLoading(true);
      // 🔥 Fetch from the specific B2B API
      const response = await fetch('/api/b2b/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch B2B products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shop-page" style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="shop-container">
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#1a237e', marginBottom: '10px' }}>🏭 B2B Wholesale Directory</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Source raw materials and bulk handicrafts directly from artisans
          </p>
        </div>

        {/* Search info */}
        {searchQuery && (
          <div className="search-info">
            <p>
              Found <strong>{filteredProducts.length}</strong> wholesale item
              {filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
            <button 
              onClick={() => window.location.href = '/b2b'}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="loading-state">
            <p>Loading wholesale directory...</p>
          </div>
        ) : (
          <div className="shop-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} style={{ position: 'relative' }}>
                  {/* 🔥 Wholesale Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 10,
                    background: '#1a237e',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    WHOLESALE
                  </div>
                  <ProductCard product={product} />
                </div>
              ))
            ) : searchQuery ? (
              <div className="no-results">
                <p>😔 No materials found for "{searchQuery}"</p>
                <p>Try searching for "Clay", "Yarn", or "Fabric"</p>
                <button 
                  onClick={() => window.location.href = '/b2b'}
                  className="btn-primary"
                >
                  View All Materials
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                <p className="no-products">No wholesale items listed yet.</p>
                <p style={{ color: '#666', marginTop: '10px' }}>Sellers: Tick "Available for wholesale" when adding a product to appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function B2BPage() {
  return (
    <Suspense fallback={<div className="loading-state">Loading directory...</div>}>
      <B2BContent />
    </Suspense>
  );
}