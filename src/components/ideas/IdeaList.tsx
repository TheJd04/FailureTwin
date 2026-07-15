import { prisma } from "@/lib/prisma";
import { IdeaCard } from "./IdeaCard";

export async function IdeaList({ userId }: { userId: string | null }) {
  const ideas = await prisma.idea.findMany({
    where: userId ? { userId } : { userId: null },
    orderBy: { createdAt: "desc" },
  });

  if (ideas.length === 0) {
    return (
      <div className="ft-panel p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>
        
        <div className="w-16 h-16 rounded-full bg-[var(--ft-surface-raised)] flex items-center justify-center mb-4 border border-[var(--ft-line)]">
          <svg className="w-8 h-8 text-[var(--ft-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl ft-wordmark mb-2">AWAITING INPUT</h3>
        <p className="text-[var(--ft-text-dim)] text-sm max-w-sm">No architectures detected in the mainframe. Initialize a new startup idea to begin the simulation.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea, index) => (
        <IdeaCard key={idea.id} idea={idea} index={index} />
      ))}
    </div>
  );
}
