import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateIdeaForm } from "@/components/ideas/CreateIdeaForm";
import { IdeaList } from "@/components/ideas/IdeaList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl ft-content">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl ft-wordmark">Your Startup Ideas</h1>
          <p className="text-[var(--ft-text-dim)] mt-2">Manage and simulate failure modes for your ideas.</p>
        </div>
        <CreateIdeaForm />
      </div>

      <IdeaList userId={session.user.id} />
    </div>
  );
}
