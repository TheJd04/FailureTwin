import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function PublicIdeaPage({ params }: { params: { id: string } }) {
  const idea = await prisma.idea.findUnique({
    where: { id: params.id },
    include: {
      simulations: {
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!idea || !idea.isPublic) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl ft-content min-h-screen">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block ft-wordmark text-2xl tracking-widest text-[var(--ft-accent)] mb-8">
          FAILURETWIN
        </Link>
      </div>

      <div className="ft-panel p-8 mb-12">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>
        
        <div className="ft-eyebrow mb-2">Public Failure Report</div>
        <h1 className="text-4xl ft-wordmark mb-6">{idea.title}</h1>
        <div className="text-[var(--ft-text)] max-w-none text-lg">
          <p className="whitespace-pre-wrap leading-relaxed">{idea.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl ft-wordmark text-[var(--ft-text-dim)] border-b border-[var(--ft-line)] pb-2 mb-6">Failure Simulations</h2>
        {idea.simulations.length === 0 ? (
          <div className="text-center py-12 ft-panel bg-transparent border-dashed">
            <p className="text-[var(--ft-text-dim)]">No simulations have been run for this idea yet.</p>
          </div>
        ) : (
          idea.simulations.map((sim: { id: string, createdAt: Date, result: string, persona?: string }) => (
            <div key={sim.id} className="ft-panel p-8 bg-black/40">
              <div className="ft-corner ft-corner-tl"></div>
              <div className="ft-corner ft-corner-tr"></div>
              <div className="ft-corner ft-corner-bl"></div>
              <div className="ft-corner ft-corner-br"></div>
              <div className="text-sm ft-eyebrow mb-6 text-[var(--ft-accent)] flex justify-between border-b border-[var(--ft-line)] pb-4">
                <span>Simulated on {new Date(sim.createdAt).toLocaleDateString()}</span>
                {sim.persona && <span className="text-[var(--ft-text-dim)]">Persona: <span className="text-white">{sim.persona}</span></span>}
              </div>
              <div className="text-[var(--ft-text)] max-w-none whitespace-pre-wrap leading-relaxed prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
                <ReactMarkdown>{sim.result}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-20 text-center pb-10">
        <p className="text-[var(--ft-text-dim)] mb-4">Want to stress test your own startup idea?</p>
        <Link href="/register">
          <button className="ft-btn-primary">Create Your Free Account</button>
        </Link>
      </div>
    </div>
  );
}
