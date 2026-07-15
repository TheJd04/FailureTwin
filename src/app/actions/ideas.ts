"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createIdea(formData: FormData) {
  const session = await getServerSession(authOptions);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description) {
    return { error: "Title and description are required" };
  }

  await prisma.idea.create({
    data: {
      title,
      description,
      userId: session?.user?.id || null,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateIdea(formData: FormData) {
  const session = await getServerSession(authOptions);
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!id || !title || !description) {
    return { error: "Missing required fields" };
  }

  // Ensure the idea belongs to the user, or allow editing if it's an anonymous idea
  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    return { error: "Idea not found" };
  }
  if (existingIdea.userId && existingIdea.userId !== session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.idea.update({
    where: { id },
    data: { title, description },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteIdea(formData: FormData) {
  const session = await getServerSession(authOptions);
  const id = formData.get("id") as string;

  if (!id) {
    return { error: "ID is required" };
  }

  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    return { error: "Idea not found" };
  }
  if (existingIdea.userId && existingIdea.userId !== session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.idea.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleShare(id: string, isPublic: boolean) {
  const session = await getServerSession(authOptions);
  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    return { error: "Idea not found" };
  }
  if (existingIdea.userId && existingIdea.userId !== session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.idea.update({
    where: { id },
    data: { isPublic },
  });

  revalidatePath(`/dashboard/ideas/${id}`);
  return { success: true };
}
