import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { revenue, orders, products, topItem } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const systemPrompt = `
      You are a business analyst helping a rural Sri Lankan artisan.
      Based on this sales data:
      - Total Revenue: LKR ${revenue}
      - Total Orders: ${orders}
      - Products Listed: ${products}
      - Top Item: ${topItem}

      Give me exactly 2 sentences of strategic advice for this seller. 
      Keep it encouraging and practical. 
      Also provide a 1 sentence translation of that advice in Sinhala.
    `;

    // Using 'fetch' and 'gemini-1.5-flash' (faster/cheaper than pro)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      return NextResponse.json({ insight: "Great job! Keep adding more products to grow your business." }); // Fallback
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Keep up the good work!";
    return NextResponse.json({ insight: text });

  } catch (error: any) {
    console.error('AI Insight Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}