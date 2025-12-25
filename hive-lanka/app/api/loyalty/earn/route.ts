import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, points, orderId, description } = await request.json();

    // Get or create loyalty account
    let loyaltyAccount = await prisma.loyaltyPoints.findUnique({
      where: { userId },
    });

    if (!loyaltyAccount) {
      loyaltyAccount = await prisma.loyaltyPoints.create({
        data: {
          userId,
          points: 0,
          lifetime: 0,
        },
      });
    }

    // Add points
    const updated = await prisma.loyaltyPoints.update({
      where: { userId },
      data: {
        points: loyaltyAccount.points + points,
        lifetime: loyaltyAccount.lifetime + points,
      },
    });

    // Record transaction
    await prisma.pointTransaction.create({
      data: {
        userId,
        type: 'EARNED',
        points,
        description,
        orderId,
      },
    });

    return NextResponse.json({
      success: true,
      points: updated.points,
      earned: points,
    });
  } catch (error:  any) {
    console.error('Loyalty error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}