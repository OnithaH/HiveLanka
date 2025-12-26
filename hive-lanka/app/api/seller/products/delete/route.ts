import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    await prisma.product.update({
      where: { id: productId },
      data: { status: 'DELETED' },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}