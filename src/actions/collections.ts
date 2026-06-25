"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CollectionName } from "@prisma/client";

export async function getCollections() {
  try {
    let collections = await prisma.collectionMeta.findMany({
      orderBy: { collection: "asc" },
    });
    
    // Ensure all 3 collections exist in DB
    const expectedCollections: CollectionName[] = ["TILES", "SANITARYWARE", "DOORS"];
    let missingFound = false;
    
    for (const col of expectedCollections) {
      if (!collections.find(c => c.collection === col)) {
        await prisma.collectionMeta.create({
          data: {
            collection: col,
            title: col.charAt(0) + col.slice(1).toLowerCase(),
            tagline: `Explore our premium ${col.toLowerCase()} collection`,
          }
        });
        missingFound = true;
      }
    }
    
    if (missingFound) {
      collections = await prisma.collectionMeta.findMany({
        orderBy: { collection: "asc" },
      });
    }

    return { success: true, data: collections };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCollectionByName(name: string) {
  try {
    const colName = name.toUpperCase() as CollectionName;
    const collection = await prisma.collectionMeta.findUnique({
      where: { collection: colName },
    });
    return { success: true, data: collection };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCollection(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const tagline = formData.get("tagline") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title) return { success: false, error: "Title is required" };

    const collection = await prisma.collectionMeta.update({
      where: { id },
      data: {
        title,
        tagline,
        imageUrl,
      },
    });

    revalidatePath("/admin/collections");
    return { success: true, data: collection };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
