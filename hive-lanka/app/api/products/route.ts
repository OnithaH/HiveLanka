import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rawProducts = await prisma.product. findMany({
      where: { status: 'ACTIVE' },
      include: {
        seller: {
          select: {
            businessName: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const products = rawProducts.map(p => ({
      id: p. id,
      name: p. name,
      description: p.description,
      price: Number(p. price),
      images: p.images,
      category: p. category,
      seller: {
        businessName: p.seller. businessName,
        verified: p.seller.verified,
      },
    }));

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error:  any) {
    console.error('Failed to fetch products:', error);
    return NextResponse. json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}