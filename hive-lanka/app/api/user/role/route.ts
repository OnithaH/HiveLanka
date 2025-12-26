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
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        role: 'CUSTOMER',
        found: false 
      });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      userId: user.id,
      name: user.name,
      found: true,
    });

  } catch (error:  any) {
    console.error('Get user role error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}