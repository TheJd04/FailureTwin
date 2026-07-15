import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4 pt-12 pb-24">
      <div className="space-y-6 max-w-3xl ft-glass p-8 relative">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>
        
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl ft-wordmark mb-2">
          FAILURETWIN
        </h1>
        <div className="ft-eyebrow" style={{ marginTop: '2px' }}>Failure Mode &amp; Effects Simulator</div>
        <p className="text-xl text-[var(--ft-text-dim)] mt-6">
          A multi-agent failure-mode simulator for startup ideas. Stop guessing why your startup might fail. Let AI simulate the harsh reality of the market.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link href="/register">
            <button className="ft-btn-primary w-full sm:w-auto text-lg px-8 py-3">Get Started</button>
          </Link>
          <Link href="/login">
            <button className="ft-btn-ghost w-full sm:w-auto text-lg px-8 py-3">Login</button>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left relative z-10">
        <div className="ft-panel p-6">
          <div className="ft-corner ft-corner-tl"></div>
          <div className="ft-corner ft-corner-tr"></div>
          <div className="ft-corner ft-corner-bl"></div>
          <div className="ft-corner ft-corner-br"></div>
          <h3 className="ft-eyebrow mb-2">Simulate Reality</h3>
          <p className="text-[var(--ft-text-dim)] text-sm">Our AI agents act as harsh critics, competitors, and indifferent customers to stress-test your idea.</p>
        </div>
        <div className="ft-panel p-6">
          <div className="ft-corner ft-corner-tl"></div>
          <div className="ft-corner ft-corner-tr"></div>
          <div className="ft-corner ft-corner-bl"></div>
          <div className="ft-corner ft-corner-br"></div>
          <h3 className="ft-eyebrow mb-2">Identify Blind Spots</h3>
          <p className="text-[var(--ft-text-dim)] text-sm">Discover critical flaws in your business model, pricing, or go-to-market strategy before you write a single line of code.</p>
        </div>
        <div className="ft-panel p-6">
          <div className="ft-corner ft-corner-tl"></div>
          <div className="ft-corner ft-corner-tr"></div>
          <div className="ft-corner ft-corner-bl"></div>
          <div className="ft-corner ft-corner-br"></div>
          <h3 className="ft-eyebrow mb-2">Iterate Faster</h3>
          <p className="text-[var(--ft-text-dim)] text-sm">Get actionable feedback instantly. Refine your pitch, pivot your idea, and increase your chances of success.</p>
        </div>
      </div>
    </div>
  );
}
