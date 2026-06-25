"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getAlbums() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        media: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    });
    return { success: true, data: albums };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAlbum(id: string) {
  try {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { order: "asc" }
        }
      }
    });
    return { success: true, data: album };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAlbum(data: { name: string; slug: string; description?: string }) {
  try {
    const album = await prisma.galleryAlbum.create({
      data
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
    return { success: true, data: album };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAlbum(id: string, data: { name?: string; slug?: string; description?: string }) {
  try {
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
    return { success: true, data: album };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAlbum(id: string) {
  try {
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: { media: true }
    });

    if (!album) {
      return { success: false, error: "Album not found" };
    }

    // Delete media from Supabase Storage
    const publicIds = album.media.map(m => m.publicId);
    if (publicIds.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("sangli-ceramica")
        .remove(publicIds);
      if (storageError) {
        console.error("Error deleting from Supabase Storage:", storageError);
      }
    }

    await prisma.galleryAlbum.delete({
      where: { id },
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Media Operations
export async function addMediaToAlbum(albumId: string, mediaFiles: { url: string; publicId: string; type: string }[]) {
  try {
    await prisma.$transaction(
      mediaFiles.map((file, index) =>
        prisma.galleryMedia.create({
          data: {
            url: file.url,
            publicId: file.publicId,
            type: file.type,
            albumId,
            order: index
          }
        })
      )
    );
    
    // Set the first image as cover image if the album doesn't have one
    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
    if (album && !album.coverImage && mediaFiles.length > 0) {
      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data: { coverImage: mediaFiles[0].url }
      });
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMedia(id: string) {
  try {
    const media = await prisma.galleryMedia.findUnique({ where: { id } });
    if (!media) return { success: false, error: "Media not found" };

    const { error: storageError } = await supabase.storage
      .from("sangli-ceramica")
      .remove([media.publicId]);
      
    if (storageError) console.error("Error deleting from Storage:", storageError);

    await prisma.galleryMedia.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
