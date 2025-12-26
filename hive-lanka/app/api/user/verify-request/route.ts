import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  // 🔥 FIX: Added 'await' here
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { documentUrl, type } = body;

  // Decide which field to update based on selection
  const updateData: any = {
    verificationStatus: 'PENDING',
  };

  if (type === 'NIC') {
    updateData.nicDocument = documentUrl;
  } else {
    updateData.businessDoc = documentUrl;
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: updateData
  });

  return NextResponse.json({ success: true });
}