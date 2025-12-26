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

    // Get balance or create if it doesn't exist
    let loyalty = await prisma.loyaltyPoints.findUnique({
      where: { userId: user.id },
    });

    if (!loyalty) {
      loyalty = await prisma.loyaltyPoints.create({
        data: {
          userId: user.id,
          balance: 0,
          totalEarned: 0,
          totalRedeemed: 0,
        },
      });
    }

    return NextResponse.json({ 
      balance: loyalty.balance,
      totalEarned: loyalty.totalEarned 
    });

  } catch (error: any) {
    console.error('Loyalty balance error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}