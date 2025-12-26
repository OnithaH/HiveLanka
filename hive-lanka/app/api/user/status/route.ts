import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ status: 'NONE' });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { verificationStatus: true }
  });

  return NextResponse.json({ status: user?.verificationStatus || 'NONE' });
}