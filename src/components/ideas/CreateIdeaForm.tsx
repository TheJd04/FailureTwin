"use client";

import { useState } from "react";
import { createIdea } from "@/app/actions/ideas";
// import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { toast } from "sonner";

export function CreateIdeaForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await createIdea(formData);
    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
    } else {
      setOpen(false);
      setError("");
      toast.success("Idea created successfully");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="ft-btn-primary">
        + INITIALIZE NEW IDEA
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="ft-wordmark text-2xl tracking-tight">CREATE STARTUP IDEA</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-6 mt-4">
          {error && <div className="text-[var(--ft-critical)] text-sm bg-[var(--ft-critical)]/10 p-3 border border-[var(--ft-critical)]/30">{error}</div>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="ft-eyebrow">Project Title</Label>
            <input id="title" name="title" required placeholder="e.g. Uber for dogs" className="ft-input" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="ft-eyebrow">Core Directive / Description</Label>
            <textarea 
              id="description" 
              name="description" 
              required 
              placeholder="Describe what the product does and who it's for..."
              className="ft-input min-h-[140px]"
            />
          </div>
          <button type="submit" className="ft-btn-primary w-full justify-center mt-2 text-center text-sm py-3">SAVE DIRECTIVE</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
