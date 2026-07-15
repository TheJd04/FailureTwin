"use client";

import { useState } from "react";
import { updateIdea, toggleShare } from "@/app/actions/ideas";
// Removed Button import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export function IdeaActions({ idea }: { idea: { id: string, title: string, description: string, isPublic: boolean } }) {
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(idea.isPublic);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${idea.id}` : "";

  async function handleEdit(formData: FormData) {
    formData.append("id", idea.id);
    const res = await updateIdea(formData);
    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
    } else {
      setEditOpen(false);
      setError("");
      toast.success("Idea pivoted successfully");
    }
  }

  async function handleToggleShare() {
    setIsSharing(true);
    const res = await toggleShare(idea.id, !isPublic);
    if (res?.success) {
      setIsPublic(!isPublic);
      if (!isPublic) {
        toast.success("Idea is now public");
      } else {
        toast.info("Idea is now private");
      }
    } else {
      toast.error("Failed to update share settings");
    }
    setIsSharing(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="flex gap-4 items-center">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger className="ft-btn-ghost text-sm py-1 px-3">
          Pivot Idea (Edit)
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="ft-wordmark text-2xl tracking-tight">PIVOT STARTUP IDEA</DialogTitle>
          </DialogHeader>
          <form action={handleEdit} className="flex flex-col gap-6 mt-4">
            {error && <div className="text-[var(--ft-critical)] text-sm bg-[var(--ft-critical)]/10 p-3 border border-[var(--ft-critical)]/30">{error}</div>}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="ft-eyebrow">Project Title</Label>
              <input id="title" name="title" defaultValue={idea.title} required className="ft-input bg-black/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="ft-eyebrow">Core Directive / Description</Label>
              <textarea 
                id="description" 
                name="description" 
                defaultValue={idea.description}
                required 
                className="ft-input bg-black/50 min-h-[150px]"
              />
            </div>
            <button type="submit" className="ft-btn-primary w-full justify-center mt-2 text-center text-sm py-3">SAVE CHANGES</button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleToggleShare}
          disabled={isSharing}
          className={`text-sm py-1 px-3 ${isPublic ? 'ft-btn-primary bg-green-900/50 text-green-400 border-green-500' : 'ft-btn-ghost'}`}
        >
          {isSharing ? "..." : isPublic ? "Shared Publicly" : "Make Public"}
        </button>

        {isPublic && (
          <button 
            onClick={copyToClipboard}
            className="ft-btn-ghost py-1 px-2 flex items-center gap-1"
            title="Copy Public Link"
          >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
