import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // 1. Fetch available products (FIXED: Uses 'status: ACTIVE' instead of 'isVisible')
    const products = await prisma.product.findMany({
      where: { 
        status: 'ACTIVE',  
        stockQuantity: { gt: 0 } // Optional: Only show items in stock
      },
      take: 20,
      select: { id: true, name: true, price: true, category: true }
    });

    // 2. Create the "System Prompt" with your inventory
    const context = `
      You are 'HiveBot', the friendly AI assistant for HiveLanka (an artisan marketplace).
      
      Here is our current inventory data:
      ${JSON.stringify(products)}

      Rules:
      1. If the user asks for a product we have, recommend it by name and price.
      2. If we don't have it, suggest a similar category we do have.
      3. Keep answers short (under 50 words) and friendly.
      4. Do not make up products not in the list.
      
      User Message: ${message}
    `;

    // 3. Ask Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(context);
    const response = result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ reply: "I'm having trouble connecting to the hive right now. Try again!" });
  }
}