import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Count Total Products
    const totalProducts = await prisma.product.count({
      where: { 
        sellerId: user.id,
        status: { not: 'DELETED' }
      }
    });

    // 2. Count Total Orders
    const totalOrders = await prisma.order.count({
      where: { sellerId: user.id }
    });

    // 3. Calculate Total Revenue
    const revenueResult = await prisma.order.aggregate({
      where: { sellerId: user.id },
      _sum: {
        total: true
      }
    });
    const totalRevenue = revenueResult._sum.total || 0;

    // 4. Get Top Selling Product (Simple logic: just one recent order item for demo)
    // In a real app, you would group by productId and count
    const lastOrder = await prisma.order.findFirst({
      where: { sellerId: user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const topProduct = lastOrder?.items[0]?.product?.name || "None yet";

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue),
      topProduct
    });

  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}