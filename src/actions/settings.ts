"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const settings = await prisma.contactInformation.findFirst();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(data: {
  address: string;
  mapUrl?: string;
  phones: string[];
  whatsapp: string;
  email: string;
  hours: string;
  catalogueUrl?: string;
  socialLinks?: any;
}) {
  try {
    const existing = await prisma.contactInformation.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.contactInformation.update({
        where: { id: existing.id },
        data
      });
    } else {
      settings = await prisma.contactInformation.create({
        data
      });
    }

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
