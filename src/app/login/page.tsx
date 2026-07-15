"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] ft-content px-4 py-12">
      <div className="ft-panel ft-glass p-10 w-full max-w-md relative">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>

        <h1 className="text-3xl ft-wordmark mb-8 text-center">SYSTEM ACCESS</h1>
        
        {error && <div className="text-[var(--ft-critical)] mb-6 text-sm text-center bg-[var(--ft-critical)]/10 p-3 border border-[var(--ft-critical)]/30">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="ft-eyebrow block">Operator Email</label>
            <input name="email" type="email" required className="ft-input bg-black/50" placeholder="admin@failuretwin.dev" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="ft-eyebrow block">Passphrase</label>
            <input name="password" type="password" required className="ft-input bg-black/50" placeholder="••••••••" />
          </div>
          <button type="submit" className="ft-btn-primary w-full justify-center mt-4 text-center py-3">INITIALIZE LOGIN</button>
        </form>
        
        <div className="mt-8 text-center text-sm text-[var(--ft-text-dim)]">
          Unregistered operator?{" "}<Link href="/register" className="text-[var(--ft-accent)] hover:text-[var(--ft-accent-bright)] hover:underline underline-offset-4">Request Access</Link>
        </div>
      </div>
    </div>
  );
}
