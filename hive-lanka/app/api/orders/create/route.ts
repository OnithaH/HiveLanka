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
      return NextResponse.json(
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
    const subtotal = items.reduce((sum: number, item: any) => 
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
        customerId: user.id,
        sellerId: firstProduct.sellerId,
        subtotal:  subtotal,
        deliveryFee: deliveryFee,
        discount: 0,
        total:  total,
        deliveryAddress: deliveryAddressText,
        deliveryPhone: shippingAddress.phone,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : paymentMethod === 'BANK' ? 'BANK_TRANSFER' : 'CARD',
        paymentStatus: 'PENDING',
        status: 'PLACED',
        items: {
          create: items. map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 🎁 AWARD LOYALTY POINTS
    const pointsEarned = Math.floor(total / 100); // 1 point per Rs. 100

    try {
      // Call loyalty API to award points
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/loyalty/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          points: pointsEarned,
          orderId: order.id,
          description: `Earned from order ${order.orderNumber}`,
        }),
      });
    } catch (loyaltyError) {
      // Don't fail the order if loyalty fails
      console. error('Loyalty points error (non-critical):', loyaltyError);
    }

    return NextResponse. json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order. orderNumber,
      pointsEarned, // 🎁 Tell customer they earned points
      message: 'Order placed successfully!' 
    });

  } catch (error:  any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error?. message || 'Failed to create order' },
      { status: 500 }
    );
  }
}