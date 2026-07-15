"use client";

import { Idea } from "@prisma/client";
import { deleteIdea } from "@/app/actions/ideas";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function IdeaCard({ idea, index }: { idea: Idea, index: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", idea.id);
      await deleteIdea(formData);
      toast.success("Idea deleted successfully");
    } catch {
      toast.error("Failed to delete idea");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="ft-panel p-6 flex flex-col h-full relative"
    >
      <div className="ft-corner ft-corner-tl"></div>
      <div className="ft-corner ft-corner-tr"></div>
      <div className="ft-corner ft-corner-bl"></div>
      <div className="ft-corner ft-corner-br"></div>
      
      <div className="flex-1">
        <h3 className="ft-wordmark text-xl mb-1">{idea.title}</h3>
        <p className="ft-eyebrow text-xs mb-4">
          Created {new Date(idea.createdAt).toLocaleDateString()}
        </p>
        <p className="text-[var(--ft-text)] whitespace-pre-wrap line-clamp-3 text-sm">
          {idea.description}
        </p>
      </div>
      
      <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-[var(--ft-line)]">
        <button 
          className="ft-btn-ghost text-red-400 hover:text-red-300 hover:border-red-400" 
          onClick={handleDelete} 
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <Link href={`/dashboard/ideas/${idea.id}`} className="flex-1">
          <button className="ft-btn-primary w-full justify-center">
            Simulate
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
