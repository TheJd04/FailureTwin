"use client";

import { useState } from "react";
import { simulateFailureMode } from "@/app/actions/ai";
// using native buttons for theme

export function SimulateButton({ ideaId, ideaTitle, ideaDescription }: { ideaId: string, ideaTitle: string, ideaDescription: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSimulate() {
    setLoading(true);
    setError("");
    const res = await simulateFailureMode(ideaId, ideaTitle, ideaDescription);
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button 
        onClick={handleSimulate} 
        disabled={loading}
        className="ft-btn-primary"
      >
        {loading ? "Simulating Failure Mode..." : "Run New Simulation"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
