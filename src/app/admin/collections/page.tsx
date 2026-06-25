import { Metadata } from "next";
import { getCollections } from "@/actions/collections";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, FolderOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections Management | Sangli Ceramica Admin",
};

export default async function CollectionsPage() {
  const res = await getCollections();
  
  if (!res.success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load collections: {res.error}</p>
      </div>
    );
  }

  const collections = res.data || [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
          <p className="text-sm text-muted-foreground">
            Manage your top-level showroom collections (Tiles, Sanitaryware, Doors)
          </p>
        </div>
      </div>
      <hr className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col: any) => (
          <div key={col.id} className="group relative rounded-xl overflow-hidden border bg-card shadow-sm h-80 flex flex-col justify-end">
            {/* Background Video or Image fallback */}
            <div className="absolute inset-0 z-0 bg-muted">
              {col.videoUrl ? (
                <video 
                  src={col.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <span className="text-muted-foreground text-sm">No Video Uploaded</span>
                </div>
              )}
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            </div>

            {/* Content overlay */}
            <div className="relative z-20 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{col.title}</h3>
              <p className="text-sm text-gray-200 mb-6 line-clamp-2">{col.tagline}</p>
              
              <div className="flex items-center gap-3">
                <Link href={`/admin/collections/${col.collection.toLowerCase()}/categories`} className="flex-1">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0" variant="outline">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Explore
                  </Button>
                </Link>
                <Link href={`/admin/collections/${col.collection.toLowerCase()}/edit`}>
                  <Button size="icon" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
