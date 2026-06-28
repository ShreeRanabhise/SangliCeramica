"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { order: "asc" }
    });
    return { success: true, data: branches };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPrimaryBranch() {
  try {
    const branch = await prisma.branch.findFirst({
      where: { isPrimary: true }
    });
    return { success: true, data: branch };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBranch(data: any) {
  try {
    // If this is the first branch or marked as primary, make others not primary
    if (data.isPrimary) {
      await prisma.branch.updateMany({ data: { isPrimary: false } });
    }

    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        isPrimary: data.isPrimary || false,
        address: data.address,
        mapUrl: data.mapUrl,
        imageUrl: data.imageUrl,
        phones: data.phones,
        whatsapp: data.whatsapp,
        email: data.email,
        hours: data.hours,
        order: data.order || 0
      }
    });

    revalidatePath("/", "layout");
    return { success: true, data: branch };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBranch(id: string, data: any) {
  try {
    if (data.isPrimary) {
      await prisma.branch.updateMany({
        where: { id: { not: id } },
        data: { isPrimary: false }
      });
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        isPrimary: data.isPrimary,
        address: data.address,
        mapUrl: data.mapUrl,
        imageUrl: data.imageUrl,
        phones: data.phones,
        whatsapp: data.whatsapp,
        email: data.email,
        hours: data.hours,
        order: data.order
      }
    });

    revalidatePath("/", "layout");
    return { success: true, data: branch };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setPrimaryBranch(id: string) {
  try {
    await prisma.$transaction([
      prisma.branch.updateMany({ data: { isPrimary: false } }),
      prisma.branch.update({ where: { id }, data: { isPrimary: true } })
    ]);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
