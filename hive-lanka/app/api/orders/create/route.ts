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
    const { 
      clerkId, 
      items, 
      shippingAddress, 
      paymentMethod, 
      notes, 
      subtotal,
      shipping,
      discount,
      totalAmount,
      pointsUsed 
    } = body;

    console.log('📦 ===== ORDER CREATE REQUEST =====');
    console.log('ClerkId:', clerkId);
    console.log('Items:', items?.length);
    console.log('Points Used:', pointsUsed);

    // 1. Validate required fields
    if (!clerkId || !items || !shippingAddress || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Get seller ID from first item
    const productId = items[0].productId || items[0].id;
    const firstProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });

    if (!firstProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 4. Calculate Values
    const orderSubtotal = subtotal || items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    const orderDeliveryFee = shipping || 300;
    const orderDiscount = discount || 0;
    const orderTotal = totalAmount || (orderSubtotal + orderDeliveryFee - orderDiscount);

    const deliveryAddressText = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.district || ''} ${shippingAddress.postalCode}`;

    let paymentMethodEnum: 'COD' | 'CARD' | 'BANK_TRANSFER' = 'COD';
    if (paymentMethod === 'BANK' || paymentMethod === 'BANK_TRANSFER') {
      paymentMethodEnum = 'BANK_TRANSFER';
    } else if (paymentMethod === 'CARD') {
      paymentMethodEnum = 'CARD';
    }

    // 5. 🔥 START TRANSACTION (Order + Stock + Loyalty)
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: user.id,
          sellerId: firstProduct.sellerId,
          subtotal: orderSubtotal,
          deliveryFee: orderDeliveryFee,
          discount: orderDiscount,
          total: orderTotal,
          deliveryAddress: deliveryAddressText,
          deliveryCity: shippingAddress.city,
          deliveryPostalCode: shippingAddress.postalCode,
          deliveryPhone: shippingAddress.phone,
          paymentMethod: paymentMethodEnum,
          paymentStatus: 'PENDING',
          status: 'PLACED',
          items: {
            create: items.map((item: any) => ({
              productId: item.productId || item.id,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // B. 📦 DEDUCT STOCK (Critical for Viva!)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId || item.id },
          data: {
            stockQuantity: { decrement: item.quantity },
            sold: { increment: item.quantity }
          }
        });
      }

      // C. 💳 DEDUCT LOYALTY POINTS (If used)
      if (pointsUsed && pointsUsed > 0) {
        // Double check balance inside transaction for safety
        const currentLoyalty = await tx.loyaltyPoints.findUnique({
           where: { userId: user.id } 
        });

        if (!currentLoyalty || currentLoyalty.balance < pointsUsed) {
           throw new Error("Insufficient loyalty points"); 
        }

        await tx.loyaltyPoints.update({
          where: { userId: user.id },
          data: {
            balance: { decrement: pointsUsed },
            totalRedeemed: { increment: pointsUsed },
            points: { decrement: pointsUsed }, // Legacy support
          },
        });

        await tx.pointTransaction.create({
          data: {
            userId: user.id,
            points: -pointsUsed,
            type: 'REDEEMED',
            description: `Redeemed ${pointsUsed} points for Order #${newOrder.orderNumber}`,
            orderId: newOrder.id,
          },
        });
      }

      // D. 🎁 AWARD NEW LOYALTY POINTS (1% of Total)
      const pointsEarned = Math.floor(orderTotal * 0.01);
      
      if (pointsEarned > 0) {
        await tx.loyaltyPoints.upsert({
          where: { userId: user.id },
          update: {
            balance: { increment: pointsEarned },
            totalEarned: { increment: pointsEarned },
            points: { increment: pointsEarned }, // Legacy
            lifetime: { increment: pointsEarned }, // Legacy
          },
          create: {
            userId: user.id,
            balance: pointsEarned,
            totalEarned: pointsEarned,
            totalRedeemed: 0,
            points: pointsEarned,
            lifetime: pointsEarned,
          },
        });

        await tx.pointTransaction.create({
          data: {
            userId: user.id,
            type: 'EARNED',
            points: pointsEarned,
            description: `Earned ${pointsEarned} points from Order #${newOrder.orderNumber}`,
            orderId: newOrder.id,
          },
        });
      }

      return { newOrder, pointsEarned };
    });

    console.log('✅ Transaction Complete. Order:', result.newOrder.orderNumber);

    return NextResponse.json({ 
      success: true, 
      orderId: result.newOrder.id,
      orderNumber: result.newOrder.orderNumber,
      pointsEarned: result.pointsEarned,
      pointsUsed: pointsUsed || 0,
      message: 'Order placed successfully!' 
    });

  } catch (error: any) {
    console.error('❌ ===== ORDER CREATE ERROR =====');
    console.error('Error:', error);
    
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}