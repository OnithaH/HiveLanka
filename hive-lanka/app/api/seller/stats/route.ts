import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse. json({ error: 'Missing clerkId' }, { status:  400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get product count
    const productsCount = await prisma.product.count({
      where: { sellerId: user.id },
    });

    // Get orders count (orders for this seller's products)
    const ordersCount = await prisma.order.count({
      where: { sellerId: user.id },
    });

    // Calculate revenue
    const orders = await prisma.order.findMany({
      where: {
        sellerId: user.id,
        paymentStatus: 'COMPLETED',
      },
      select: { total: true },
    });

    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Reviews count (if you have reviews)
    const reviewsCount = 0; // TODO: Implement when you add reviews

    return NextResponse.json({
      success: true,
      stats: {
        products: productsCount,
        orders: ordersCount,
        revenue: revenue,
        reviews: reviewsCount,
      },
    });

  } catch (error:  any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: error.message}, { status: 500 });
  }
}