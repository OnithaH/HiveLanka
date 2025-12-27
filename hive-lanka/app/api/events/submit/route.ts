import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const submission = await prisma.eventSubmission.create({
      data: {
        eventName: data.eventName,
        date: new Date(data.date),
        description: data.description,
        venue: data.venue,
        location: data.location,
        time: data.time,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        eventType: data.eventType,
        submittedBy: data.submittedBy, // Link to local User ID
        status: "PENDING"
      }
    });
    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}