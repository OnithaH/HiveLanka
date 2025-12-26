import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "Configuration Error: API Key missing." });
    }

    // 1. Fetch available products
    const products = await prisma.product.findMany({
      where: { 
        status: 'ACTIVE',
        stockQuantity: { gt: 0 }
      },
      take: 20,
      select: { id: true, name: true, price: true, category: true }
    });

    // 2. Create System Prompt
    const systemPrompt = `
      You are 'HiveBot', the friendly AI assistant for HiveLanka.
      
      Current Inventory:
      ${JSON.stringify(products)}
      
      User Message: ${message}
      
      Rules:
      1. Recommend products from our inventory if they match.
      2. If not found, suggest similar categories we have.
      3. Keep answers friendly and under 50 words.
    `;

    // 3. Call Google API - 🔥 CHANGED TO 'gemini-flash-latest'
    // This alias is safer than specific version numbers
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", data);
      
      // Handle Quota Limits (429) specifically
      if (data.error?.code === 429) {
          return NextResponse.json({ reply: "I'm receiving too many messages right now. Please wait a minute and try again!" });
      }

      return NextResponse.json({ reply: "I'm having trouble connecting to the brain. Please check the API Key." });
    }

    // Success!
    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Chat Error:', error.message);
    return NextResponse.json({ reply: "I'm having trouble connecting right now. Try again!" });
  }
}