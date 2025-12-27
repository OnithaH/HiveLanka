import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json({ success: true, events: events || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, events: [] }, { status: 500 });
  }
}