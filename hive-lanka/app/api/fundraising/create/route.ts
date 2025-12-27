import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Find the local DB user ID using the clerkId from the frontend
    const user = await prisma.user.findUnique({
      where: { clerkId: data.clerkId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Create the campaign with ALL mandatory schema fields
    const campaign = await prisma.fundraisingCampaign.create({
      data: {
        title: data.title,
        story: data.story,
        goal: parseFloat(data.goal),
        raised: 0, // Explicitly set starting amount
        gramaNiladariDoc: data.gramaNiladariDoc || "https://hivelanka.blob.core.windows.net/docs/pending.pdf", // Required field
        sellerId: user.id, // Links to the User relation
        status: "ACTIVE" // Set to ACTIVE for immediate display
      }
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    // Return a JSON error message instead of an empty 500
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}