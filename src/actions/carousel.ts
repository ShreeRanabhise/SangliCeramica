"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCarouselImages() {
  try {
    const images = await prisma.carouselImage.findMany({
      orderBy: { order: "asc" }
    });
    return { success: true, data: images };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCarouselImage(id: string) {
  try {
    const image = await prisma.carouselImage.findUnique({
      where: { id }
    });
    return { success: true, data: image };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCarouselImage(data: { imageUrl: string; title?: string; subtitle?: string; order?: number; isActive?: boolean }) {
  try {
    const image = await prisma.carouselImage.create({
      data
    });
    revalidatePath("/admin/carousel");
    revalidatePath("/");
    return { success: true, data: image };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCarouselImage(id: string, data: { imageUrl?: string; title?: string; subtitle?: string; order?: number; isActive?: boolean }) {
  try {
    const image = await prisma.carouselImage.update({
      where: { id },
      data
    });
    revalidatePath("/admin/carousel");
    revalidatePath("/");
    return { success: true, data: image };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCarouselImage(id: string) {
  try {
    await prisma.carouselImage.delete({
      where: { id }
    });
    revalidatePath("/admin/carousel");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
