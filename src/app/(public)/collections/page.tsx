import { getCollections } from "@/actions/collections";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Collections | Sangli Ceramica",
  description: "Browse our meticulously curated collections designed to inspire your next architectural project.",
};

export default async function CollectionsPage() {
  const colRes = await getCollections();
  const collections = colRes.success ? colRes.data : [];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Our Collections</h1>
        <p className="text-muted-foreground text-lg">Browse our meticulously curated collections designed to inspire your next architectural project.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections?.map((col: any) => (
          <Link 
            key={col.id} 
            href={`/collections/${col.collection.toLowerCase()}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            {col.imageUrl ? (
              <Image 
                src={col.imageUrl} 
                alt={col.title}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-slate-800" />
            )}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{col.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{col.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
