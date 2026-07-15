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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">{idea.title}</h1>
        <div className="prose prose-slate max-w-none">
          <p className="whitespace-pre-wrap">{idea.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Failure Simulations</h2>
        <SimulateButton ideaId={idea.id} ideaTitle={idea.title} ideaDescription={idea.description} />
      </div>

      <div className="space-y-6">
        {idea.simulations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-slate-500">No simulations run yet. Click the button above to simulate a failure mode.</p>
          </div>
        ) : (
          idea.simulations.map((sim: { id: string, createdAt: Date, result: string }) => (
            <div key={sim.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-sm text-slate-500 mb-4">
                Simulated on {new Date(sim.createdAt).toLocaleString()}
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                {sim.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
