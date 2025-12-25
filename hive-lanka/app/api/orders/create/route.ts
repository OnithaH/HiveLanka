import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, items, shippingAddress, paymentMethod, notes, totalAmount } = body;

    // Validate required fields
    if (! clerkId || !items || ! shippingAddress || !totalAmount) {
      return NextResponse. json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get seller ID from first item
    const firstProduct = await prisma.product.findUnique({
      where: { id: items[0]. id },
      select: { sellerId: true },
    });

    if (!firstProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate totals
    const subtotal = items. reduce((sum: number, item:  any) => 
      sum + (item.price * item.quantity), 0
    );
    const deliveryFee = 300;
    const total = subtotal + deliveryFee;

    // Format delivery address
    const deliveryAddressText = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.district} ${shippingAddress.postalCode}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: user. id,
        sellerId: firstProduct.sellerId,
        subtotal:  subtotal,
        deliveryFee: deliveryFee,
        discount: 0,
        total: total,
        deliveryAddress: deliveryAddressText,
        deliveryPhone: shippingAddress.phone,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : paymentMethod === 'BANK' ? 'BANK_TRANSFER' : 'CARD',
        paymentStatus: 'PENDING',
        status: 'PLACED',
        items: {
          create:  items. map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item. price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 🎁 AWARD LOYALTY POINTS
    const pointsEarned = Math.floor(total / 100);

    console.log('🎁 ===== AWARDING LOYALTY POINTS =====');
    console.log('User ID:', user.id);
    console.log('Points to award:', pointsEarned);
    console.log('Order ID:', order.id);
    console.log('Order Number:', order.orderNumber);

    if (pointsEarned > 0) {
      try {
        // Use Prisma directly (more reliable than fetch)
        const loyalty = await prisma.loyaltyPoints. upsert({
          where:  { userId: user.id },
          update: {
            points:  { increment: pointsEarned },
            lifetime: { increment:  pointsEarned },
          },
          create: {
            userId: user.id,
            points: pointsEarned,
            lifetime: pointsEarned,
          },
        });

        console.log('✅ Loyalty points updated:', loyalty);

        // Record transaction
        const transaction = await prisma.pointTransaction.create({
          data: {
            userId:  user.id,
            type: 'EARNED',
            points: pointsEarned,
            description: `Earned from order ${order.orderNumber}`,
            orderId: order.id,
          },
        });

        console.log('✅ Transaction recorded:', transaction);

      } catch (loyaltyError:  any) {
        console.error('❌ Loyalty error:', loyaltyError);
        console.error('Error message:', loyaltyError.message);
      }
    } else {
      console.log('⚠️ No points to award (order total too low)');
    }

    console.log('🎁 ===== END LOYALTY POINTS =====');

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber,
      pointsEarned,
      message: 'Order placed successfully!' 
    });

  } catch (error:  any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}