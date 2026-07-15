import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, ideaText } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${systemPrompt}\n\n${ideaText}\n\nIMPORTANT: Return ONLY a valid JSON object with a "scenarios" array containing 6 objects. Do not wrap it in markdown block quotes. Make sure it is strictly valid JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown wrapping if present
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    return NextResponse.json({
      content: [
        {
          type: "text",
          text: text,
        }
      ]
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to run analysis" }, { status: 500, headers: corsHeaders });
  }
}
