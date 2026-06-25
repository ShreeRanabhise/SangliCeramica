"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCatalogues() {
  try {
    const catalogues = await prisma.catalogue.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: catalogues };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCatalogue(id: string) {
  try {
    const catalogue = await prisma.catalogue.findUnique({
      where: { id }
    });
    return { success: true, data: catalogue };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCatalogue(data: { title: string; fileUrl: string; coverImage?: string; isActive?: boolean }) {
  try {
    const catalogue = await prisma.catalogue.create({
      data
    });
    revalidatePath("/admin/catalogues");
    revalidatePath("/", "layout");
    return { success: true, data: catalogue };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCatalogue(id: string, data: { title?: string; fileUrl?: string; coverImage?: string; isActive?: boolean }) {
  try {
    const catalogue = await prisma.catalogue.update({
      where: { id },
      data
    });
    revalidatePath("/admin/catalogues");
    revalidatePath("/", "layout");
    return { success: true, data: catalogue };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCatalogue(id: string) {
  try {
    await prisma.catalogue.delete({
      where: { id }
    });
    revalidatePath("/admin/catalogues");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
