import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId, action } = await req.json();

  const isVerified = action === 'APPROVED';

  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: action,
      verified: isVerified 
    }
  });

  return NextResponse.json({ success: true });
}