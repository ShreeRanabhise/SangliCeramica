import { prisma } from "@/lib/prisma";
import { CatalogueDownloadForm } from "@/components/public/catalogue-download-form";
import { FileText, Download } from "lucide-react";

export const metadata = {
  title: "Download Catalogues | Sangli Ceramica",
  description: "Download our premium PDF catalogues to explore our complete range of tiles, sanitaryware, and doors.",
};

export default async function CataloguesPage() {
  const catalogues = await prisma.catalogue.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <FileText className="h-4 w-4" /> Premium Catalogues
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Download Our Catalogues
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            Browse our complete range of products, specifications, and design inspirations offline by downloading our high-quality PDF catalogues. 
            Please provide your details to begin the download.
          </p>
        </div>

        {/* Catalogues Grid */}
        {catalogues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {catalogues.map((catalogue: any) => (
              <CatalogueDownloadForm key={catalogue.id} catalogue={catalogue} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 border border-dashed rounded-2xl p-12 text-center max-w-2xl">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No catalogues available</h3>
            <p className="text-muted-foreground">Check back later for our updated product catalogues.</p>
          </div>
        )}

      </div>
    </div>
  );
}
