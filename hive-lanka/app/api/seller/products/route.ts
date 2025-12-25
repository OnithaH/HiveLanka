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

    const products = await prisma.product.findMany({
      where: { 
        sellerId: user.id,
        status: { not: 'DELETED' }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}