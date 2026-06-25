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
    const { name, code, productId, price, quantity, size, color, finish, description, categoryId, features, specifications, isFeatured, images } = data;

    if (!name || !code || !categoryId) {
      return { success: false, error: "Name, Code, and Category are required." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        code,
        productId,
        price: price ? parseFloat(price) : null,
        quantity: quantity ? parseInt(quantity) : null,
        size,
        color,
        finish,
        description: description || "",
        categoryId,
        features: features || [],
        specifications: specifications || {},
        isFeatured: isFeatured || false,
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
      return { success: false, error: "Product with this Code or Name already exists." };
    }
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const { name, code, productId, price, quantity, size, color, finish, description, categoryId, features, specifications, isFeatured, images } = data;

    if (!name || !code || !categoryId) {
      return { success: false, error: "Name, Code, and Category are required." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // We delete old images and recreate them to simplify reordering/updating
    // In a huge prod app, we might diff them, but for this scale, recreation is safest
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        code,
        productId,
        price: price ? parseFloat(price) : null,
        quantity: quantity ? parseInt(quantity) : null,
        size,
        color,
        finish,
        description: description || "",
        categoryId,
        features: features || [],
        specifications: specifications || {},
        isFeatured: isFeatured || false,
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
