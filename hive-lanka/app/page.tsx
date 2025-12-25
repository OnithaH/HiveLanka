import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import CategoryIcon from '@/components/CategoryIcon';
import BannerSlider from '@/components/BannerSlider';
import EventBanner from '@/components/EventBanner';

// Define the product type
type ProductWithSeller = {
  id: string;
  name: string;
  price:  number;
  images: string[];
  category: string;
  seller: {
    businessName: string | null;
    verified: boolean;
  };
};

export const dynamic = 'force-dynamic'; // Add this to force dynamic rendering

export default async function HomePage() {
  // Fetch data from database
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
      take: 8,
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
    <main className="main-content">
      {/* Green Action Bar */}
      <section className="action-bar"></section>

      {/* Advertisement Banner Section */}
      <BannerSlider />

      {/* Products Showcase Section */}
      <section className="products-showcase">
        <div className="container">
          {/* Category Icons Row */}
          <div className="category-icons-row">
            <button className="category-nav prev-categories">❮</button>
            <div className="category-icons-container">
              <CategoryIcon name="Jewelry" image="/images/categories/jewelry.jpg" />
              <CategoryIcon name="Ceramic" image="/images/categories/ceramic.jpg" />
              <CategoryIcon name="Living" image="/images/categories/living.jpg" />
              <CategoryIcon name="Kitchen" image="/images/categories/kitchen.jpg" />
            </div>
            <button className="category-nav next-categories">❯</button>
          </div>

          {/* Products Grid */}
          <div className="products-showcase-grid">
            {products. length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Event Banner Section */}
      <EventBanner />

      {/* About Hive Lanka Section */}
      <section className="about-hive-section">
        <div className="container">
          <h2 className="about-hive-title">What is Hive Lanka?</h2>
          <div className="about-hive-content">
            <div className="about-card mission-card">
              <div className="card-icon">🌱</div>
              <div className="card-content">
                <h3>Our Mission</h3>
                <p>
                  Our mission is to create opportunities for entrepreneurs across the country, 
                  especially those from underrepresented groups like orphanages and elderly homes 
                  to showcase their crafts and generate sustainable income.
                </p>
              </div>
              <div className="card-decoration"></div>
            </div>
            
            <div className="about-card vision-card">
              <div className="card-icon">🤝</div>
              <div className="card-content">
                <h3>Our Vision</h3>
                <p>
                  At Hive Lanka we believe in empowering communities by uniting small businesses, 
                  local vendors, and charitable organizations on one inclusive platform. Together, 
                  we're building a sustainable future for Sri Lankan artisans.
                </p>
              </div>
              <div className="card-decoration"></div>
            </div>
          </div>
          
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Local Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Communities Helped</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">LKR 2M+</div>
              <div className="stat-label">Donations Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="testimonials-title">What Does Our Guests Say?</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="stars-rating">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <div className="rating-score">9.1</div>
              </div>
              <p className="testimonial-text">"The website is good experience for beginners"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Image src="/images/testimonials/person1.jpg" alt="Customer" width={60} height={60} className="avatar-image" />
                </div>
                <div className="author-info">
                  <div className="author-name">Limuthu Jundathissa</div>
                  <div className="author-role">Customer</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="stars-rating">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <div className="rating-score">10</div>
              </div>
              <p className="testimonial-text">"The website is good experience for beginners.  I liked how we can buy products easily"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Image src="/images/testimonials/person2.png" alt="Seller" width={60} height={60} className="avatar-image" />
                </div>
                <div className="author-info">
                  <div className="author-name">Random man</div>
                  <div className="author-role">Seller / Business Owner</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="stars-rating">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <div className="rating-score">9.7</div>
              </div>
              <p className="testimonial-text">"The website is good experience for beginners. It helped me raise funds Easily"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Image src="/images/testimonials/person3.jpg" alt="Organization" width={60} height={60} className="avatar-image" />
                </div>
                <div className="author-info">
                  <div className="author-name">Binduli Rathnayaka</div>
                  <div className="author-role">Organization Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}