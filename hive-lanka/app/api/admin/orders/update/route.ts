import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { orderId, status } = await request.json();

  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status,
      ...(status === 'PACKED' && { packedAt: new Date() }),
      ...(status === 'SHIPPED' && { shippedAt: new Date() }),
      ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
    },
  });

  return NextResponse.json({ success: true });
}