import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SimulateButton } from "@/components/ideas/SimulateButton";
import { IdeaActions } from "@/components/ideas/IdeaActions";
import ReactMarkdown from "react-markdown";

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const idea = await prisma.idea.findUnique({
    where: { id: params.id },
    include: {
      simulations: {
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!idea) {
    notFound();
  }

  if (idea.userId && idea.userId !== session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl ft-content">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-sm text-[var(--ft-text-dim)] hover:text-[var(--ft-text)] flex items-center gap-1 ft-link w-max">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <IdeaActions idea={{ id: idea.id, title: idea.title, description: idea.description, isPublic: idea.isPublic }} />
      </div>

      <div className="ft-panel p-8 mb-8">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>
        
        <div className="ft-eyebrow mb-2 flex items-center gap-2">
          System Under Test 
          {idea.isPublic && <span className="bg-green-900/50 text-green-400 border border-green-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Public</span>}
        </div>
        <h1 className="text-3xl ft-wordmark mb-4">{idea.title}</h1>
        <div className="text-[var(--ft-text)] max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed">{idea.description}</p>
        </div>
      </div>

      <div className="flex flex-col mb-8 p-6 ft-glass border border-[var(--ft-line)]">
        <h2 className="text-2xl ft-wordmark text-[var(--ft-text)] mb-4">Run Simulation</h2>
        <SimulateButton ideaId={idea.id} ideaTitle={idea.title} ideaDescription={idea.description} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl ft-wordmark text-[var(--ft-text-dim)] border-b border-[var(--ft-line)] pb-2 mb-4">Simulation History</h2>
        {idea.simulations.length === 0 ? (
          <div className="ft-panel p-12 text-center flex flex-col items-center justify-center min-h-[250px] border-dashed border-[var(--ft-line-bright)]">
            <div className="w-16 h-16 rounded-full bg-[var(--ft-surface-raised)] flex items-center justify-center mb-4 border border-[var(--ft-line)]">
              <svg className="w-8 h-8 text-[var(--ft-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl ft-wordmark mb-2">NO DATA</h3>
            <p className="text-[var(--ft-text-dim)] text-sm max-w-sm">No simulations have been run on this directive yet. Initialize a simulation sequence above.</p>
          </div>
        ) : (
          idea.simulations.map((sim: { id: string, createdAt: Date, result: string, persona?: string }) => (
            <div key={sim.id} className="ft-panel p-6">
              <div className="ft-corner ft-corner-tl"></div>
              <div className="ft-corner ft-corner-tr"></div>
              <div className="ft-corner ft-corner-bl"></div>
              <div className="ft-corner ft-corner-br"></div>
              <div className="text-sm ft-eyebrow mb-4 text-[var(--ft-accent)] flex justify-between">
                <span>Simulated on {new Date(sim.createdAt).toLocaleString()}</span>
                {sim.persona && <span className="text-[var(--ft-text-dim)]">Persona: {sim.persona}</span>}
              </div>
              <div className="text-[var(--ft-text)] max-w-none whitespace-pre-wrap leading-relaxed prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
                <ReactMarkdown>{sim.result}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
