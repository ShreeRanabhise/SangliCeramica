"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: brands };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBrand(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as string;

    if (!name) return { success: false, error: "Name is required" };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo,
      },
    });

    revalidatePath("/admin/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Brand name already exists" };
    }
    return { success: false, error: error.message };
  }
}

export async function updateBrand(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as string;

    if (!name) return { success: false, error: "Name is required" };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        logo,
      },
    });

    revalidatePath("/admin/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id },
    });
    revalidatePath("/admin/brands");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
