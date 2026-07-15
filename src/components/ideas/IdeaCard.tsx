"use client";

import { Idea } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteIdea } from "@/app/actions/ideas";
import { useState } from "react";
import Link from "next/link";

export function IdeaCard({ idea }: { idea: Idea }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", idea.id);
    await deleteIdea(formData);
    setIsDeleting(false);
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{idea.title}</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Created {new Date(idea.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-3">
          {idea.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2 border-t pt-4">
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Link href={`/dashboard/ideas/${idea.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full">
            Simulate Failure Mode
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
