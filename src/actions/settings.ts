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
  whatsapp?: string;
  email: string;
  socialLinks?: any;
}) {
  try {
    const existing = await prisma.contactInformation.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.contactInformation.update({
        where: { id: existing.id },
        data: {
          whatsapp: data.whatsapp || existing.whatsapp,
          email: data.email || existing.email,
          socialLinks: data.socialLinks !== undefined ? data.socialLinks : existing.socialLinks,
        }
      });
    } else {
      settings = await prisma.contactInformation.create({
        data: {
          whatsapp: data.whatsapp || "",
          email: data.email || "",
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
