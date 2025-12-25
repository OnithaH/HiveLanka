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
    console.log('Items:', items?. length);
    console.log('Subtotal:', subtotal);
    console.log('Shipping:', shipping);
    console.log('Discount:', discount);
    console.log('Total:', totalAmount);
    console.log('Points Used:', pointsUsed);

    // Validate required fields
    if (!clerkId || !items || !shippingAddress || ! totalAmount) {
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

    console.log('✅ User found:', user.email);

    // Get seller ID from first item (use productId if available, otherwise id)
    const productId = items[0]. productId || items[0].id;
    const firstProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });

    if (!firstProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('✅ Seller found:', firstProduct.sellerId);

    // Use provided values or calculate
    const orderSubtotal = subtotal || items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    const orderDeliveryFee = shipping || 300;
    const orderDiscount = discount || 0;
    const orderTotal = totalAmount || (orderSubtotal + orderDeliveryFee - orderDiscount);

    // Format delivery address
    const deliveryAddressText = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.district || ''} ${shippingAddress.postalCode}`;

    // Convert payment method to enum (fix typo:  PaymentMethod not paymentMethod)
    let paymentMethodEnum:  'COD' | 'CARD' | 'BANK_TRANSFER' = 'COD';
    if (paymentMethod === 'BANK' || paymentMethod === 'BANK_TRANSFER') {
      paymentMethodEnum = 'BANK_TRANSFER';
    } else if (paymentMethod === 'CARD') {
      paymentMethodEnum = 'CARD';
    }

    // Create order
    const order = await prisma.order.create({
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
        deliveryPostalCode:  shippingAddress.postalCode,
        deliveryPhone: shippingAddress.phone,
        paymentMethod: paymentMethodEnum,
        paymentStatus: 'PENDING',
        status: 'PLACED',
        items: {
          create: items. map((item: any) => ({
            productId: item.productId || item.id,
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

    console.log('✅ Order created:', order.orderNumber);

    // 🔥 DEDUCT LOYALTY POINTS IF USED
    if (pointsUsed && pointsUsed > 0) {
      console.log('💳 Deducting points:', pointsUsed);

      try {
        // Check if user has loyalty points record
        const existingLoyalty = await prisma.loyaltyPoints.findUnique({
          where: { userId: user.id },
        });

        if (existingLoyalty && existingLoyalty.balance >= pointsUsed) {
          await prisma.loyaltyPoints. update({
            where: { userId: user.id },
            data: {
              balance: { decrement: pointsUsed },
              totalRedeemed: { increment: pointsUsed },
              // Also update legacy fields
              points: { decrement: pointsUsed },
            },
          });

          // Record transaction (fix:  PointTransaction not loyaltyTransaction)
          await prisma.pointTransaction.create({
            data: {
              userId:  user.id,
              points: -pointsUsed,
              type: 'REDEEMED',
              description: `Redeemed ${pointsUsed} points for Order #${order.orderNumber}`,
              orderId: order.id,
            },
          });

          console.log('✅ Points deducted successfully');
        } else {
          console.log('⚠️ Insufficient points or no loyalty record');
        }
      } catch (deductError:  any) {
        console.error('❌ Error deducting points:', deductError. message);
        // Don't fail the order if points deduction fails
      }
    }

    // 🎁 AWARD LOYALTY POINTS FOR PURCHASE (1% of total)
    const pointsEarned = Math.floor(orderTotal * 0.01);

    console.log('🎁 ===== AWARDING LOYALTY POINTS =====');
    console.log('User ID:', user.id);
    console.log('Order Total:', orderTotal);
    console.log('Points to award (1%):', pointsEarned);
    console.log('Order ID:', order.id);
    console.log('Order Number:', order. orderNumber);

    if (pointsEarned > 0) {
      try {
        // Upsert loyalty points
        const loyalty = await prisma.loyaltyPoints.upsert({
          where: { userId: user.id },
          update: {
            balance: { increment: pointsEarned },
            totalEarned: { increment: pointsEarned },
            // Also update legacy fields
            points: { increment: pointsEarned },
            lifetime: { increment: pointsEarned },
          },
          create: {
            userId: user.id,
            balance: pointsEarned,
            totalEarned: pointsEarned,
            totalRedeemed: 0,
            // Legacy fields
            points: pointsEarned,
            lifetime: pointsEarned,
          },
        });

        console.log('✅ Loyalty points updated:', {
          balance: loyalty.balance,
          totalEarned: loyalty.totalEarned,
        });

        // Record transaction
        const transaction = await prisma.pointTransaction. create({
          data: {
            userId: user.id,
            type: 'EARNED',
            points: pointsEarned,
            description: `Earned ${pointsEarned} points from Order #${order.orderNumber}`,
            orderId: order.id,
          },
        });

        console.log('✅ Transaction recorded:', transaction.id);

      } catch (loyaltyError: any) {
        console.error('❌ Loyalty error:', loyaltyError);
        console.error('Error message:', loyaltyError.message);
        console.error('Stack:', loyaltyError.stack);
        // Don't fail the order if loyalty points fail
      }
    } else {
      console.log('⚠️ No points to award (total too low or 0)');
    }

    console.log('🎁 ===== END LOYALTY POINTS =====');
    console.log('📦 ===== ORDER CREATE SUCCESS =====');

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber,
      pointsEarned,
      pointsUsed:  pointsUsed || 0,
      message: 'Order placed successfully!' 
    });

  } catch (error:  any) {
    console.error('❌ ===== ORDER CREATE ERROR =====');
    console.error('Error:', error);
    console.error('Message:', error?. message);
    console.error('Stack:', error?.stack);
    
    return NextResponse.json(
      { error: error?. message || 'Failed to create order' },
      { status: 500 }
    );
  }
}