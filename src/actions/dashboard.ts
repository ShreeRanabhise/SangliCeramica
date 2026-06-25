"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics() {
  try {
    const [productsCount, inquiriesCount, brandsCount, galleryCount] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.brand.count(),
      prisma.galleryMedia.count(),
    ]);

    return {
      success: true,
      data: {
        productsCount,
        inquiriesCount,
        brandsCount,
        galleryCount,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
