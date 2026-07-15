"use client";

import { useState } from "react";
import { updateIdea, toggleShare } from "@/app/actions/ideas";
// Removed Button import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    } else {
      setEditOpen(false);
      setError("");
    }
  }

  async function handleToggleShare() {
    setIsSharing(true);
    const res = await toggleShare(idea.id, !isPublic);
    if (res?.success) {
      setIsPublic(!isPublic);
    }
    setIsSharing(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
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
            <DialogTitle>Pivot Startup Idea</DialogTitle>
          </DialogHeader>
          <form action={handleEdit} className="flex flex-col gap-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={idea.title} required className="ft-input bg-black/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={idea.description}
                required 
                className="min-h-[150px] ft-input bg-black/50"
              />
            </div>
            <button type="submit" className="ft-btn-primary mt-2">Save Changes</button>
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
