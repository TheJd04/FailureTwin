"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="ft-glass sticky top-0 z-50 border-b border-[var(--ft-line)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="ft-wordmark" style={{ fontSize: '1.25rem' }}>
          FAILURETWIN
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm hidden sm:inline-block text-[var(--ft-text-dim)] ft-mono uppercase tracking-widest">
                {session.user?.name || session.user?.email?.split('@')[0]}
              </span>
              <Link href="/dashboard">
                <button className="ft-btn-ghost">Dashboard</button>
              </Link>
              <button className="ft-btn-ghost text-[var(--ft-critical)] border-[var(--ft-critical)]/30 hover:border-[var(--ft-critical)]" onClick={() => signOut({ callbackUrl: "/" })}>
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="ft-btn-ghost">LOG IN</button>
              </Link>
              <Link href="/register">
                <button className="ft-btn-primary">SIGN UP</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
