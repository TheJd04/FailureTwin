import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SimulateButton } from "@/components/ideas/SimulateButton";

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

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

  if (idea.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl ft-content">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-[var(--ft-text-dim)] hover:text-[var(--ft-text)] flex items-center gap-1 ft-link w-max">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="ft-panel p-8 mb-8">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>
        
        <div className="ft-eyebrow mb-2">System Under Test</div>
        <h1 className="text-3xl ft-wordmark mb-4">{idea.title}</h1>
        <div className="text-[var(--ft-text)] max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed">{idea.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl ft-wordmark text-[var(--ft-text)]">Failure Simulations</h2>
        <SimulateButton ideaId={idea.id} ideaTitle={idea.title} ideaDescription={idea.description} />
      </div>

      <div className="space-y-6">
        {idea.simulations.length === 0 ? (
          <div className="text-center py-12 ft-panel bg-transparent border-dashed">
            <p className="text-[var(--ft-text-dim)]">No simulations run yet. Click the button above to simulate a failure mode.</p>
          </div>
        ) : (
          idea.simulations.map((sim: { id: string, createdAt: Date, result: string }) => (
            <div key={sim.id} className="ft-panel p-6">
              <div className="ft-corner ft-corner-tl"></div>
              <div className="ft-corner ft-corner-tr"></div>
              <div className="ft-corner ft-corner-bl"></div>
              <div className="ft-corner ft-corner-br"></div>
              <div className="text-sm ft-eyebrow mb-4 text-[var(--ft-accent)]">
                Simulated on {new Date(sim.createdAt).toLocaleString()}
              </div>
              <div className="text-[var(--ft-text)] max-w-none whitespace-pre-wrap leading-relaxed">
                {sim.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
