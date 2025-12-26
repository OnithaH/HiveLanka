import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { productId, status } = await request.json();

    await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Toggle product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}