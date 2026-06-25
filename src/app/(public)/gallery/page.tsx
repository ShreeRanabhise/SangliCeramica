import { Metadata } from "next";
import { getAlbums } from "@/actions/gallery";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery | Sangli Ceramica",
  description: "Browse our showroom gallery and recent projects.",
};

export default async function PublicGalleryPage() {
  const { data: albums, success } = await getAlbums();

  const validAlbums = (albums || []).filter((album: any) => album.media && album.media.length > 0);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Gallery</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Explore our beautifully crafted showroom displays and past projects. 
            Get inspired for your next renovation.
          </p>
        </div>

        {!success || validAlbums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">Check back soon!</h3>
            <p className="text-muted-foreground">We are currently updating our gallery with fresh inspiration.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {validAlbums.map((album: any) => (
              <div key={album.id} className="space-y-8">
                <div className="border-b pb-4">
                  <h2 className="text-3xl font-bold tracking-tight">{album.name}</h2>
                  {album.description && (
                    <p className="text-muted-foreground mt-2">{album.description}</p>
                  )}
                </div>
                
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {album.media.map((item: any) => (
                    <div key={item.id} className="break-inside-avoid relative rounded-xl overflow-hidden group border shadow-sm">
                      <Image 
                        src={item.url} 
                        alt={album.name}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
