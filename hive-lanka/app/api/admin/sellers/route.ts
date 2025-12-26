import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sellers = await prisma.user.findMany({
    where: { 
      verificationStatus: { not: 'NONE' } // Show anyone who tried to verify
    },
    orderBy: { createdAt: 'desc' },
    select: {
        id: true,
        name: true,
        email: true,
        verificationStatus: true,
        nicDocument: true,
        businessDoc: true
    }
  });

  return NextResponse.json({ sellers });
}