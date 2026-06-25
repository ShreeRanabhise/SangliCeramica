"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getContent(section: string) {
  try {
    const content = await prisma.homepageContent.findUnique({
      where: { section },
    });
    return { success: true, data: content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllContent() {
  try {
    const contents = await prisma.homepageContent.findMany();
    return { success: true, data: contents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateContent(section: string, contentJson: any) {
  try {
    const content = await prisma.homepageContent.upsert({
      where: { section },
      update: { content: contentJson },
      create: { section, content: contentJson },
    });
    
    revalidatePath("/");
    revalidatePath("/admin/content");
    
    return { success: true, data: content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
