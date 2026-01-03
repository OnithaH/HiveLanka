import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import '@/app/product/product-details.css';

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // AWAIT params first (Next.js 15 requirement)
  const { id } = await params;
  
  const product = await prisma.product. findUnique({
    where:  { id },  // Now use the awaited id
    include: {
      seller: {
        select: {
          id: true,
          businessName:  true,
          verified: true,
          location: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Create a clean product object for AddToCartButton
  const cartProduct = {
    id: product. id,
    name: product. name,
    price: Number(product.price),
    images: product.images,
  };

  return (
    <main className="product-detail-page">
      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            <Image 
              src={product.images[0] || '/images/placeholder.jpg'} 
              alt={product.name}
              width={600}
              height={600}
              className="product-image"
            />
          </div>
          <div className="thumbnail-grid">
            {product.images. slice(0, 4).map((img, idx) => (
              <div key={idx} className="thumbnail">
                <Image src={img} alt={`${product.name} ${idx + 1}`} width={100} height={100} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-category">📦 {product.category}</span>
            {product.seller. verified && <span className="verified-badge">✓ Verified Seller</span>}
          </div>

          <div className="product-price">
            LKR {Number(product.price).toLocaleString()}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <AddToCartButton product={cartProduct} />
            <button className="btn-secondary">💚 Add to Wishlist</button>
          </div>

          <div className="seller-info-card">
            <h3>Seller Information</h3>
            <div className="seller-details">
              <p><strong>Business: </strong> {product.seller.businessName}</p>
              <p><strong>Location:</strong> {product.seller.location}</p>
              <Link href={`/seller/${product.seller.id}`}>
                <button className="btn-link">View Seller Profile →</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}