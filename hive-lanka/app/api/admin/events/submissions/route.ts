import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.submittedBy || !data.eventName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = await prisma.eventSubmission.create({
      data: {
        eventName: data.eventName,
        date: new Date(data.date),
        description: data.description,
        venue: data.venue || "TBD",
        location: data.location || "Sri Lanka",
        time: "TBD",
        contactPhone: "N/A",
        contactEmail: data.contactEmail,
        eventType: "EXHIBITION",
        submittedBy: data.submittedBy, // Must be the internal User ID
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}