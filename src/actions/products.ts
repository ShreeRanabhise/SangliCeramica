"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProduct(data: any) {
  try {
    const { name, size, categoryId, brandId, images } = data;

    if (!name || !categoryId) {
      return { success: false, error: "Name and Category are required." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        size,
        categoryId,
        brandId: brandId || null,
        images: {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: index === 0,
            order: index,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { success: true, data: product };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Product with this Name already exists." };
    }
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const { name, size, categoryId, brandId, images } = data;

    if (!name || !categoryId) {
      return { success: false, error: "Name and Category are required." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        size,
        categoryId,
        brandId: brandId || null,
        images: {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: index === 0,
            order: index,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function softDeleteProduct(id: string) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
    revalidatePath("/admin/products");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
