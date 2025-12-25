import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request:  NextRequest) {
  try {
    const body = await request. json();
    const {
      clerkId,
      name,
      description,
      price,
      category,
      stockQuantity,
      images,
      isWholesale,
      deliveryAvailable,
    } = body;

    // Validate required fields
    if (!clerkId || !name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user (seller) from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is a seller
    if (user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can add products' },
        { status: 403 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: user.id,
        name,
        description,
        price: parseFloat(price),
        category,
        stockQuantity: parseInt(stockQuantity) || 0,
        images:  images || [],
        isWholesale:  isWholesale || false,
        deliveryAvailable: deliveryAvailable !== false,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully!',
    });

  } catch (error:  any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}