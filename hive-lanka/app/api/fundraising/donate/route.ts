import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { campaignId, amount } = await req.json();

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Use a transaction to update both tables at once
    const result = await prisma.$transaction([
      prisma.donation.create({
        data: {
          campaignId,
          donorId: dbUser.id,
          amount: parseFloat(amount),
          anonymous: false
        }
      }),
      prisma.fundraisingCampaign.update({
        where: { id: campaignId },
        data: { raised: { increment: parseFloat(amount) } }
      })
    ]);

    return NextResponse.json({ success: true, donation: result[0] });
  } catch (error: any) {
    console.error("Donation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}