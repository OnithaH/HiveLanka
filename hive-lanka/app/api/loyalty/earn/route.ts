import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, points, orderId, description } = body;

    console.log('💎 ===== LOYALTY EARN API CALLED =====');
    console.log('Received data:', { userId, points, orderId, description });

    if (!userId || !points) {
      console.error('❌ Missing required fields! ');
      return NextResponse.json({ error: 'Missing userId or points' }, { status: 400 });
    }

    // Upsert loyalty account (create or update)
    const loyalty = await prisma.loyaltyPoints. upsert({
      where:  { userId },
      update: {
        points:  { increment: points },
        lifetime: { increment: points },
      },
      create: {
        userId,
        points,
        lifetime: points,
      },
    });

    console.log('✅ Loyalty account updated:', loyalty);

    // Record transaction
    const transaction = await prisma.pointTransaction.create({
      data: {
        userId,
        type:  'EARNED',
        points,
        description:  description || 'Points earned',
        orderId: orderId || null,
      },
    });

    console.log('✅ Transaction recorded:', transaction);
    console.log('💎 ===== LOYALTY API SUCCESS =====');

    return NextResponse.json({
      success: true,
      points: loyalty.points,
      earned: points,
      message: 'Points awarded successfully! ',
    });

  } catch (error:  any) {
    console.error('❌ ===== LOYALTY API ERROR =====');
    console.error('Error details:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}