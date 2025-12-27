import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ ADDED: GET Method to fetch pending submissions for the Admin Page
export async function GET() {
  try {
    const submissions = await prisma.eventSubmission.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      // Optional: Include submitter details if you want to show names instead of IDs
      include: {
        submitter: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    console.error("Fetch Submissions Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// EXISTING: POST Method for Sellers to create submissions
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
        eventType: data.eventType || "EXHIBITION", // Ensure this matches your Enum in schema
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