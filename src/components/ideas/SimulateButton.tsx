"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

export function SimulateButton({ ideaId, ideaTitle, ideaDescription }: { ideaId: string, ideaTitle: string, ideaDescription: string }) {
  const [persona, setPersona] = useState("Default");
  const [customPrompt, setCustomPrompt] = useState("");

  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/simulate',
    body: {
      ideaId,
      title: ideaTitle,
      description: ideaDescription,
      persona: persona === "Custom" ? customPrompt : persona
    },
    onFinish: () => {
      // Reload page to show the saved simulation at the bottom
      window.location.reload();
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="persona-select" className="ft-eyebrow text-[var(--ft-text-dim)]">Select Persona or Custom Prompt</label>
          <select 
            id="persona-select"
            value={persona} 
            onChange={(e) => setPersona(e.target.value)}
            disabled={isLoading}
            className="ft-input p-2 rounded bg-black/50 border border-[var(--ft-line)] text-white w-full sm:max-w-md"
          >
            <option value="Default">The Realist (Default)</option>
            <option value="The Ruthless VC">The Ruthless VC</option>
            <option value="The Apathetic Customer">The Apathetic Customer</option>
            <option value="The Regulatory Auditor">The Regulatory Auditor</option>
            <option value="Custom">Custom Prompt...</option>
          </select>
        </div>
        
        {persona === "Custom" && (
          <div className="flex flex-col gap-1 text-sm w-full">
            <label htmlFor="custom-prompt" className="ft-eyebrow text-[var(--ft-text-dim)]">Enter Custom Prompt</label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. You are a cynical security researcher looking for data privacy flaws..."
              className="ft-input p-2 min-h-[100px] w-full"
            />
          </div>
        )}

        <div className="flex justify-end w-full">
          <button 
            onClick={() => complete(ideaTitle)} 
            disabled={isLoading || (persona === "Custom" && !customPrompt.trim())}
            className="ft-btn-primary"
          >
            {isLoading ? "Simulating..." : "Run New Simulation"}
          </button>
        </div>
      </div>
      
      {error && <div className="text-red-500 text-sm">{error.message}</div>}

      {completion && (
        <div className="ft-panel p-6 mt-4 border border-[var(--ft-accent)]">
          <div className="ft-corner ft-corner-tl"></div>
          <div className="ft-corner ft-corner-tr"></div>
          <div className="ft-corner ft-corner-bl"></div>
          <div className="ft-corner ft-corner-br"></div>
          <div className="text-sm ft-eyebrow mb-4 text-[var(--ft-accent)] flex justify-between">
            <span>Streaming Simulation...</span>
            <span className="animate-pulse">●</span>
          </div>
          <div className="text-[var(--ft-text)] max-w-none whitespace-pre-wrap leading-relaxed prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
            <ReactMarkdown>{completion}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
