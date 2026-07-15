"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function simulateFailureMode(ideaId: string, title: string, description: string) {
  const session = await getServerSession(authOptions);
  // Check if idea exists and belongs to the user if user is logged in
  const existingIdea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!existingIdea) {
    return { error: "Idea not found" };
  }
  if (existingIdea.userId && existingIdea.userId !== session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { error: "Gemini API Key is not configured." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a group of specialized AI agents acting as a "Failure Twin" for startup ideas. 
Your goal is to relentlessly analyze the given startup idea and predict the most likely ways it will fail in the real world. 
Be constructive but brutally honest. 

Startup Idea Title: ${title}
Startup Idea Description: ${description}

Please provide a comprehensive failure mode analysis. Use Markdown formatting. Include sections for:
1. **The Core Flaw**: The most fundamental reason this idea might not work.
2. **Market Indifference**: Why customers might not care enough to pay for this.
3. **Competitive Crushing**: How existing players or new entrants will destroy this.
4. **Operational Collapse**: The hidden complexities that will bankrupt the company or burn out the founders.
5. **The Pivot (Silver Lining)**: One small glimmer of hope or a direction the founders should pivot to instead.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    await prisma.simulation.create({
      data: {
        result: text,
        ideaId: ideaId,
      },
    });

    revalidatePath(`/dashboard/ideas/${ideaId}`);
    return { success: true };
  } catch (error) {
    console.error("AI Simulation Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to run simulation." };
  }
}
