import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = await prisma.$transaction([
      prisma.event.create({
        data: {
          title: data.eventName,
          date: new Date(data.date),
          description: data.description,
          location: data.location || "Sri Lanka",
          venue: data.venue,
          time: data.time || "TBD",
          contactPhone: data.contactPhone || "N/A",
          contactEmail: data.contactEmail,
          posterImage: data.posterImage,
          organizerId: data.submittedBy,
          type: data.eventType || "EXHIBITION"
        }
      }),
      prisma.eventSubmission.update({
        where: { id: data.submissionId },
        data: { status: "APPROVED" }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}