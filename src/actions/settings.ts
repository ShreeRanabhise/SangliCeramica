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
  socialLinks?: any;
}) {
  try {
    const existing = await prisma.contactInformation.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.contactInformation.update({
        where: { id: existing.id },
        data: {
          address: data.address || existing.address,
          mapUrl: data.mapUrl || existing.mapUrl,
          phones: data.phones || existing.phones,
          whatsapp: data.whatsapp || existing.whatsapp,
          email: data.email || existing.email,
          hours: data.hours || existing.hours,
          socialLinks: data.socialLinks !== undefined ? data.socialLinks : existing.socialLinks,
        }
      });
    } else {
      settings = await prisma.contactInformation.create({
        data: {
          address: data.address || "",
          mapUrl: data.mapUrl || "",
          phones: data.phones || [],
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          hours: data.hours || "",
          socialLinks: data.socialLinks || {},
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");

    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
