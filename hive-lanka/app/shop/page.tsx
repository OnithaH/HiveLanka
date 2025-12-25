import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';

type ProductWithSeller = {
  id: string;
  name:  string;
  price:  number;
  images: string[];
  category: string;
  seller: {
    businessName:  string | null;
    verified:  boolean;
  };
};

export default async function ShopPage() {
  let products: ProductWithSeller[] = [];

  try {
    const rawProducts = await prisma.product. findMany({
      where: { status: 'ACTIVE' },
      include: {
        seller: {
          select: {
            businessName: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    products = rawProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      images: p.images,
      category: p.category,
      seller: {
        businessName: p.seller. businessName,
        verified: p.seller.verified,
      },
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <main className="shop-page">
      <div className="shop-container">
        <h1 className="shop-title">Shop Handicrafts</h1>
        <p className="shop-subtitle">Discover authentic Sri Lankan products</p>

        <div className="shop-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-products">No products available</p>
          )}
        </div>
      </div>
    </main>
  );
}