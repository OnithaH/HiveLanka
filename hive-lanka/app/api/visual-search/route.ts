import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { keywords, category, topPrediction } = await request.json();

    console.log('🔍 Searching with keywords:', keywords);
    console.log('📁 Category:', category);

    // Build search OR conditions
    const searchOR:  any[] = [];

    // Add keyword searches
    keywords.forEach((keyword: string) => {
      searchOR.push({ name: { contains: keyword, mode: 'insensitive' as const } });
      searchOR.push({ description: { contains: keyword, mode: 'insensitive' as const } });
      searchOR.push({ category: { contains: keyword, mode:  'insensitive' as const } });
    });

    // Add category search
    if (category && category !== 'Other') {
      searchOR.push({ category: { contains: category, mode: 'insensitive' as const } });
    }

    // Search products
    const products = await prisma. product.findMany({
      where: {
        status: 'ACTIVE',
        OR: searchOR,
      },
      include: {
        seller: {
          select: {
            businessName: true,
            verified: true,
          },
        },
      },
      take: 20,
    });

    console.log(`📦 Found ${products.length} products`);

    // Calculate similarity scores
    const results = products.map((product) => {
      let similarity = 0;
      const productText = `${product.name} ${product. description} ${product.category}`.toLowerCase();

      // Category exact match (30%)
      if (category && product.category. toLowerCase().includes(category.toLowerCase())) {
        similarity += 0.3;
      }

      // Keyword matches (50%)
      const matchCount = keywords.filter((keyword: string) =>
        productText.includes(keyword.toLowerCase())
      ).length;
      similarity += (matchCount / keywords. length) * 0.5;

      // Top prediction match (20%)
      if (topPrediction && productText.includes(topPrediction.toLowerCase())) {
        similarity += 0.2;
      }

      return {
        ... product,
        similarity: Math. min(similarity, 1.0),
        price: Number(product.price),
      };
    });

    // Sort by similarity
    results.sort((a, b) => b.similarity - a. similarity);

    // Take top 12
    const topResults = results.slice(0, 12);

    console.log(`✅ Returning ${topResults.length} results`);

    return NextResponse.json({
      success: true,
      results: topResults,
    });

  } catch (error:  any) {
    console.error('❌ Search error:', error);
    return NextResponse.json(
      { error: error. message },
      { status: 500 }
    );
  }
}