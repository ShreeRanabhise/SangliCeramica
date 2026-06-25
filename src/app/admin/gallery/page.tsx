import { Metadata } from "next";
import { getAlbums } from "@/actions/gallery";
import { AlbumClient } from "./components/album-client";

export const metadata: Metadata = {
  title: "Gallery Management | Sangli Ceramica Admin",
};

export default async function GalleryPage() {
  const { data: albums, success, error } = await getAlbums();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load albums: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AlbumClient data={albums || []} />
    </div>
  );
}
