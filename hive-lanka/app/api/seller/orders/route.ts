import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    // 1. Find the Seller
    const seller = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // 2. Fetch Orders for this Seller
    const orders = await prisma.order.findMany({
      where: { sellerId: seller.id }, // Filter by sellerId
      include: {
        customer: {
          select: { name: true, email: true, phone: true, location: true }
        },
        items: {
          include: {
            product: { select: { name: true, images: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error('Seller orders error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}