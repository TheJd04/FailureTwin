"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const res = await registerUser(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] ft-content px-4 py-12">
      <div className="ft-panel ft-glass p-10 w-full max-w-md relative">
        <div className="ft-corner ft-corner-tl"></div>
        <div className="ft-corner ft-corner-tr"></div>
        <div className="ft-corner ft-corner-bl"></div>
        <div className="ft-corner ft-corner-br"></div>

        <h1 className="text-3xl ft-wordmark mb-8 text-center">ACCESS REQUEST</h1>
        
        {error && <div className="text-[var(--ft-critical)] mb-6 text-sm text-center bg-[var(--ft-critical)]/10 p-3 border border-[var(--ft-critical)]/30">{error}</div>}
        
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="ft-eyebrow block">Operator Name</label>
            <input name="name" type="text" required className="ft-input bg-black/50" placeholder="Jane Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="ft-eyebrow block">Operator Email</label>
            <input name="email" type="email" required className="ft-input bg-black/50" placeholder="admin@failuretwin.dev" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="ft-eyebrow block">Passphrase</label>
            <input name="password" type="password" required className="ft-input bg-black/50" placeholder="••••••••" />
          </div>
          <button type="submit" className="ft-btn-primary w-full justify-center mt-4 text-center py-3">REGISTER ACCESS</button>
        </form>
        
        <div className="mt-8 text-center text-sm text-[var(--ft-text-dim)]">
          Already registered? <Link href="/login" className="text-[var(--ft-accent)] hover:text-[var(--ft-accent-bright)] hover:underline underline-offset-4">Initialize Login</Link>
        </div>
      </div>
    </div>
  );
}
