const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Cleared all data');

  // ============================================
  // CREATE USERS
  // ============================================

  // Admin
  const admin = await prisma.user.create({
    data: {
      clerkId: 'admin_001',
      email: 'admin@hivelanka.com',
      name: 'Admin User',
      role: 'ADMIN',
      verified: true,
      phone: '0771234567',
      location: 'Colombo',
      district: 'Colombo',
    },
  });
  console.log('✅ Admin created');

  // Sellers
  const seller1 = await prisma.user. create({
    data: {
      clerkId: 'seller_001',
      email: 'ravi. pottery@gmail.com',
      name: 'Ravi Silva',
      role: 'SELLER',
      verified: true,
      phone: '0773456789',
      location: 'Kandy',
      district: 'Kandy',
      businessName: 'Traditional Pottery by Ravi',
      businessType: 'Pottery & Ceramics',
      businessRegNo: 'BR-2023-KAN-001',
      bio: 'Handcrafted traditional pottery for over 15 years.',
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      clerkId: 'seller_002',
      email: 'nimal.masks@gmail.com',
      name: 'Nimal Perera',
      role: 'SELLER',
      verified: true,
      phone: '0774567890',
      location: 'Ambalangoda',
      district:  'Galle',
      businessName: 'Ambalangoda Mask Gallery',
      businessType: 'Traditional Masks',
      businessRegNo: 'BR-2022-GAL-002',
      bio: 'Authentic Sri Lankan traditional masks.',
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      clerkId:  'seller_003',
      email: 'kumari.textiles@gmail.com',
      name: 'Kumari Fernando',
      role: 'SELLER',
      verified: true,
      phone: '0775678901',
      location: 'Matara',
      district: 'Matara',
      businessName: 'Kumari Handloom Textiles',
      businessType: 'Textiles',
      businessRegNo: 'BR-2023-MAT-003',
      bio: 'Premium handloom sarees and textiles.',
    },
  });

  console.log('✅ 3 Sellers created');

  // Customers
  const customers = [];
  for (let i = 1; i <= 10; i++) {
    const customer = await prisma.user. create({
      data: {
        clerkId: `customer_${String(i).padStart(3, '0')}`,
        email: `customer${i}@example.com`,
        name: `Customer ${i}`,
        role: 'CUSTOMER',
        phone: `077100000${i}`,
        location: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara'][i % 5],
        district:  ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara'][i % 5],
      },
    });
    customers.push(customer);
  }
  console.log('✅ 10 Customers created');

  // ============================================
  // CREATE PRODUCTS
  // ============================================

  // Seller 1 Products (Pottery)
  const product1 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Traditional Clay Water Pot',
      description: 'Handmade clay water pot.  Keeps water naturally cool.  Perfect for traditional homes.',
      price: 1200.00,
      category: 'Pottery',
      subCategory: 'Kitchen',
      stockQuantity: 25,
      images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400'],
      status: 'ACTIVE',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Decorative Clay Planter',
      description: 'Beautiful handcrafted clay planter with traditional designs. Available in various sizes.',
      price: 850.00,
      category: 'Pottery',
      subCategory: 'Home Décor',
      stockQuantity:  40,
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'],
      status: 'ACTIVE',
    },
  });

  // Seller 2 Products (Masks)
  const product3 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      name: 'Kolam Mask - Traditional Design',
      description: 'Authentic Kolam mask handcarved from Kaduru wood. Traditional Ambalangoda craftsmanship.',
      price: 4500.00,
      category: 'Masks',
      subCategory: 'Kolam Masks',
      stockQuantity:  15,
      images: ['https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400'],
      status: 'ACTIVE',
    },
  });

  const product4 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      name: 'Raksha Demon Mask',
      description: 'Fierce Raksha demon mask with vibrant colors. Museum-quality craftsmanship.',
      price: 6800.00,
      category: 'Masks',
      subCategory: 'Raksha Masks',
      stockQuantity: 8,
      images: ['https://images.unsplash.com/photo-1566164463184-df08ccdffe23?w=400'],
      status: 'ACTIVE',
    },
  });

  // Seller 3 Products (Textiles)
  const product5 = await prisma.product. create({
    data: {
      sellerId: seller3.id,
      name: 'Handloom Cotton Saree',
      description:  'Premium handloom cotton saree with traditional motifs. Comfortable and elegant.',
      price: 8500.00,
      category: 'Textiles',
      subCategory: 'Sarees',
      stockQuantity: 12,
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
      status: 'ACTIVE',
    },
  });

  const product6 = await prisma. product.create({
    data: {
      sellerId: seller3.id,
      name: 'Handwoven Table Runner',
      description: 'Beautiful handwoven table runner with ethnic patterns.',
      price: 2200.00,
      category: 'Textiles',
      subCategory: 'Home Décor',
      stockQuantity: 30,
      images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400'],
      status: 'ACTIVE',
    },
  });

  console.log('✅ 6 Products created');

  // ============================================
  // CREATE ORDERS
  // ============================================

  const order1 = await prisma. order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-001`,
      customerId: customers[0].id,
      sellerId: seller1.id,
      subtotal: 2050.00,
      deliveryFee: 300.00,
      total: 2350.00,
      deliveryAddress: 'No.  45, Galle Road, Colombo 03',
      deliveryPhone: '0771234567',
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED',
      status: 'DELIVERED',
      packedAt: new Date('2024-12-15'),
      shippedAt: new Date('2024-12-16'),
      deliveredAt: new Date('2024-12-20'),
      items: {
        create: [
          {
            productId:  product1.id,
            quantity: 1,
            price:  1200.00,
            subtotal: 1200.00,
          },
          {
            productId: product2.id,
            quantity: 1,
            price: 850.00,
            subtotal: 850.00,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-002`,
      customerId: customers[1].id,
      sellerId: seller2.id,
      subtotal: 4500.00,
      deliveryFee: 400.00,
      total: 4900.00,
      deliveryAddress: 'No. 12, Kandy Road, Peradeniya',
      deliveryPhone: '0772345678',
      paymentMethod: 'COD',
      paymentStatus:  'PENDING',
      status: 'SHIPPED',
      packedAt: new Date('2024-12-21'),
      shippedAt: new Date('2024-12-22'),
      items: {
        create: [
          {
            productId: product3.id,
            quantity: 1,
            price: 4500.00,
            subtotal: 4500.00,
          },
        ],
      },
    },
  });

  console.log('✅ 2 Orders created');

  // ============================================
  // CREATE REVIEWS
  // ============================================

  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: customers[0].id,
      rating: 5,
      comment:  'Excellent quality!  Water stays cool all day.  Highly recommend!',
      verified: true,
      helpful: 12,
    },
  });

  await prisma.review.create({
    data: {
      productId:  product3.id,
      userId: customers[1].id,
      rating: 5,
      comment: 'Beautiful craftsmanship! The details are incredible.  Worth every rupee.',
      verified: true,
      helpful: 18,
    },
  });

  console.log('✅ 2 Reviews created');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Admin user');
  console.log('   - 3 Sellers');
  console.log('   - 10 Customers');
  console.log('   - 6 Products');
  console.log('   - 2 Orders');
  console.log('   - 2 Reviews');
  console.log('');
  console.log('🔐 Test Credentials:  ');
  console.log('   Admin: admin@hivelanka.com');
  console.log('   Seller:  ravi.pottery@gmail.com');
  console.log('   Customer: customer1@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed: ');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });