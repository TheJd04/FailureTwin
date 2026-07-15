"use client";

import { useState } from "react";
import { simulateFailureMode } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";

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
      <Button 
        onClick={handleSimulate} 
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {loading ? "Simulating Failure Mode..." : "Run New Simulation"}
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
