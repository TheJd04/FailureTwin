import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-slate-900">
          FailureTwin
        </h1>
        <p className="text-xl text-slate-600">
          A multi-agent failure-mode simulator for startup ideas. Stop guessing why your startup might fail. Let AI simulate the harsh reality of the market.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">Login</Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Simulate Reality</h3>
          <p className="text-slate-600">Our AI agents act as harsh critics, competitors, and indifferent customers to stress-test your idea.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Identify Blind Spots</h3>
          <p className="text-slate-600">Discover critical flaws in your business model, pricing, or go-to-market strategy before you write a single line of code.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Iterate Faster</h3>
          <p className="text-slate-600">Get actionable feedback instantly. Refine your pitch, pivot your idea, and increase your chances of success.</p>
        </div>
      </div>
    </div>
  );
}
