import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.eventSubmission.findUnique({
      where: { id },
      include: {
        submitter: {
          select: { name: true, email: true }
        }
      }
    });

    if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}