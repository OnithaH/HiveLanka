import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request. url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status:  400 });
    }

    // Get user
    const user = await prisma. user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get loyalty account
    const loyalty = await prisma.loyaltyPoints.findUnique({
      where: { userId: user.id },
    });

    // Get transactions
    const transactions = await prisma.pointTransaction.findMany({
      where: { userId:  user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      points: loyalty?. points || 0,
      lifetime: loyalty?.lifetime || 0,
      transactions,
    });
  } catch (error: any) {
    console.error('Get loyalty error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}