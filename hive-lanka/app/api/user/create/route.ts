import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, name, role, phone, location, district, businessName, businessType } = body;

    const existingUser = await prisma. user.findUnique({ where: { clerkId } });
    if (existingUser) {
      return NextResponse.json({ error: 'User exists' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        role,
        phone,
        location,
        district,
        ...(role === 'SELLER' && { businessName, businessType, verified: true }),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}