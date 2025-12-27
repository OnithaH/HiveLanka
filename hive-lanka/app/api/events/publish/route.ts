import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = await prisma.$transaction([
      // 1. Create live official event
      prisma.event.create({
        data: {
          title: data.eventName,
          date: new Date(data.date),
          description: data.description,
          location: data.location,
          venue: data.venue,
          time: data.time,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          posterImage: data.posterImage, // The Admin's Canva design
          organizerId: data.submittedBy,
          type: data.eventType
        }
      }),
      // 2. Mark submission as approved
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