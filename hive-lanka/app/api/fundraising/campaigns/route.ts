import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all active campaigns from the database
    const campaigns = await prisma.fundraisingCampaign.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    // Ensure we always return an object with a campaigns array
    return NextResponse.json({ 
      success: true, 
      campaigns: campaigns || [] 
    });
  } catch (error: any) {
    console.error("Fetch Campaigns Error:", error);
    return NextResponse.json({ success: false, campaigns: [] }, { status: 500 });
  }
}