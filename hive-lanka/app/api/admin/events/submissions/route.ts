import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handles: GET /api/submissions (Used by Admin to see list)
export async function GET() {
  try {
    const submissions = await prisma.eventSubmission.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handles: POST /api/submissions (Used by Sellers to submit form)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Logic to create submission in DB
    const newSubmission = await prisma.eventSubmission.create({
      data: {
        eventName: data.eventName,
        date: new Date(data.date),
        description: data.description,
        venue: data.venue,
        location: data.location,
        time: data.time || "TBD",
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        eventType: data.eventType,
        submittedBy: data.submittedBy,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}