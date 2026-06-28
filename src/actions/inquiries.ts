"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !mobileNumber || !message) {
      return { success: false, error: "Name, Mobile Number, and Message are required." };
    }

    await prisma.inquiry.create({
      data: {
        name,
        mobileNumber,
        email: email || null,
        message,
        status: "NEW",
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}

export async function getInquiries() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: inquiries };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInquiryStatus(id: string, status: string, notes?: string) {
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status, notes },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await prisma.inquiry.delete({
      where: { id },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
