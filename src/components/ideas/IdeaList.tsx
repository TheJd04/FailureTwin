import { prisma } from "@/lib/prisma";
import { IdeaCard } from "./IdeaCard";

export async function IdeaList({ userId }: { userId: string }) {
  const ideas = await prisma.idea.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
        <h3 className="text-lg font-medium text-slate-900">No ideas yet</h3>
        <p className="text-slate-500 mt-1">Create your first startup idea to start simulating failure modes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
