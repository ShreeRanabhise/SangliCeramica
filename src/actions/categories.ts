"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { subcategories: true, products: true },
        },
      },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;

    if (!name) return { success: false, error: "Name is required" };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Category name already exists" };
    }
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;

    if (!name) return { success: false, error: "Name is required" };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
