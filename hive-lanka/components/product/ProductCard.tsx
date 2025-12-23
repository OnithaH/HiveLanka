import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    seller: {
      businessName: string | null;
      verified: boolean;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-showcase-card">
        <div className="product-showcase-image">
          <Image 
            src={product.images[0] || '/images/placeholder.jpg'} 
            alt={product.name}
            width={400}
            height={200}
            className="product-image"
          />
        </div>
        <div className="product-showcase-info">
          <h3 className="product-showcase-title">{product.name}</h3>
          <p className="product-showcase-price">{formatPrice(product.price)}</p>
          <div className="product-showcase-seller">
            <span className="shop-name">{product.seller. businessName || 'Shop'}</span>
            {product.seller.verified && (
              <span className="verified-badge">✓ Verified Seller</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}