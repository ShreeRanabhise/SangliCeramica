import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Showrooms | Sangli Ceramica",
  description: "Visit our showrooms to experience premium luxury tiles, sanitaryware, and doors.",
};

export default async function ShowroomsPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Showrooms</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Experience our premium collections in person. Visit one of our showrooms for a personalized consultation.
          </p>
        </div>

        {branches.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground border rounded-2xl bg-muted/20">
            No showrooms found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch) => (
              <div key={branch.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden border shadow-sm transition-all hover:shadow-md">
                
                {/* Image Section */}
                <div className="relative aspect-[3/2] bg-muted overflow-hidden">
                  {branch.imageUrl ? (
                    <Image 
                      src={branch.imageUrl} 
                      alt={`${branch.name} Showroom`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <MapPin className="w-12 h-12 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  {branch.isPrimary && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Primary Location
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">{branch.name}</h2>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="space-y-4 mb-6 flex-1 text-sm">
                    <div className="flex gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      <span className="leading-relaxed">{branch.address}</span>
                    </div>
                    {branch.phones && branch.phones.length > 0 && branch.phones[0] !== "" && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="w-5 h-5 text-primary shrink-0" />
                        <span>{branch.phones.join(', ')}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-5 h-5 text-primary shrink-0" />
                        <span>{branch.email}</span>
                      </div>
                    )}
                    {branch.hours && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <span>{branch.hours}</span>
                      </div>
                    )}
                  </div>

                  {branch.mapUrl ? (
                    <a 
                      href={branch.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  ) : (
                    <div className="w-full text-center py-2.5 px-4 text-sm text-muted-foreground bg-muted/50 rounded-xl">
                      Directions unavailable
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
