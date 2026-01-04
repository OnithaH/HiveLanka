import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, cart, deliveryInfo, subtotal, deliveryFee, discount, total, pointsUsed } = body;

    if (!clerkId || !cart || cart.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const firstProduct = await prisma.product.findUnique({
      where: { id: cart[0].productId }, 
      select: { sellerId: true }
    });

    if (!firstProduct) {
       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const orderNumber = `ORD-${Date.now()}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: user.id,
          sellerId: firstProduct.sellerId,
          subtotal: parseFloat(subtotal),
          deliveryFee: parseFloat(deliveryFee),
          discount: parseFloat(discount),
          total: parseFloat(total),
          deliveryAddress: deliveryInfo.address,
          deliveryCity: deliveryInfo.city,
          deliveryPostalCode: deliveryInfo.postalCode,
          deliveryPhone: deliveryInfo.phone,
          paymentMethod: deliveryInfo.paymentMethod,
          status: 'PLACED',
          items: {
            create: cart.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity, 
            })),
          },
        },
      });

      // 🔥 FIX: Loop through cart and reduce stock in database
      for (const item of cart) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            sold: { increment: item.quantity }
          }
        });
      }

      // 2. Deduct Points
      if (pointsUsed > 0) {
        await tx.loyaltyPoints.update({
          where: { userId: user.id },
          data: {
            balance: { decrement: pointsUsed },
            totalRedeemed: { increment: pointsUsed },
          },
        });

        await tx.pointTransaction.create({
          data: {
            userId: user.id,
            points: -pointsUsed,
            type: 'REDEEMED',
            description: `Redeemed ${pointsUsed} points for Order #${orderNumber}`,
            orderId: order.id,
          },
        });
      }

      // 3. Award Points
      const pointsEarned = Math.floor(total * 0.01);
      if (pointsEarned > 0) {
        await tx.loyaltyPoints.upsert({
          where: { userId: user.id },
          update: {
            balance: { increment: pointsEarned },
            totalEarned: { increment: pointsEarned },
          },
          create: {
            userId: user.id,
            balance: pointsEarned,
            totalEarned: pointsEarned,
            totalRedeemed: 0,
          },
        });

        await tx.pointTransaction.create({
          data: {
            userId: user.id,
            points: pointsEarned,
            type: 'EARNED',
            description: `Earned ${pointsEarned} points from Order #${orderNumber}`,
            orderId: order.id,
          },
        });
      }

      return { order, pointsEarned };
    });

    return NextResponse.json({
      success: true,
      order: result.order,
      pointsEarned: result.pointsEarned,
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}