import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const { ideaId, title, description, persona = "Default" } = await req.json();

    // Ensure idea belongs to user, or allow if it's an anonymous idea
    const existingIdea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!existingIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    if (existingIdea.userId && existingIdea.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
    }

    let personaContext = "";
    if (persona === "The Ruthless VC") {
      personaContext = "You are a ruthless Venture Capitalist. Focus heavily on market size, margins, customer acquisition costs, and why the unit economics will fail.";
    } else if (persona === "The Apathetic Customer") {
      personaContext = "You are a lazy, apathetic customer. Focus on why you wouldn't bother switching from your current solution and why this new product is too much friction to use.";
    } else if (persona === "The Regulatory Auditor") {
      personaContext = "You are a strict regulatory auditor. Focus entirely on legal loopholes, compliance nightmares, privacy issues, and liability risks that will shut the company down.";
    } else {
      personaContext = "You are a group of specialized AI agents acting as a 'Failure Twin' for startup ideas.";
    }

    const systemPrompt = `${personaContext}
Your goal is to relentlessly analyze the given startup idea and predict the most likely ways it will fail in the real world. 
Be constructive but brutally honest. 

Please provide a comprehensive failure mode analysis. Use Markdown formatting. Include sections for:
1. **The Core Flaw**: The most fundamental reason this idea might not work.
2. **Market Indifference**: Why customers might not care enough to pay for this.
3. **Competitive Crushing**: How existing players or new entrants will destroy this.
4. **Operational Collapse**: The hidden complexities that will bankrupt the company or burn out the founders.
5. **The Pivot (Silver Lining)**: One small glimmer of hope or a direction the founders should pivot to instead.`;

    const prompt = `Startup Idea Title: ${title}\nStartup Idea Description: ${description}`;
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: prompt,
      async onFinish({ text }) {
        // Save the simulation result after stream finishes
        await prisma.simulation.create({
          data: {
            result: text,
            ideaId: ideaId,
            persona: persona
          },
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Simulation Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to run simulation." }, { status: 500 });
  }
}
