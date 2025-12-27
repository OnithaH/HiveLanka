import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Only fetch events that have been fully created and published
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({ success: true, events: events || [] });
  } catch (error: any) {
    console.error("Fetch Published Events Error:", error);
    return NextResponse.json({ success: false, events: [] }, { status: 500 });
  }
}