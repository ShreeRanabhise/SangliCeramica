import { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Sangli Ceramica",
  description: "Learn about Sangli Ceramica, the premium showroom for luxury tiles, sanitaryware, and doors.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Sangli Ceramica</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            For over a decade, we have been the premier destination for architects, interior designers, and homeowners seeking the finest quality ceramics and bath fittings in Maharashtra.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          <div className="relative h-[400px] rounded-3xl overflow-hidden bg-muted">
            <Image 
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop" 
              alt="Showroom Interior" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-6">
            <div className="relative rounded-3xl overflow-hidden bg-muted">
              <Image 
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop" 
                alt="Luxury Bathroom" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-muted">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop" 
                alt="Premium Tiles" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Legacy of Excellence</h2>
            <div className="prose prose-slate dark:prose-invert">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                What started as a small trading business has grown into one of the largest and most luxurious showrooms in the region. We believe that every space has a story to tell, and the materials you choose form the foundation of that narrative.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We partner with world-renowned brands and manufacturers to bring you an exclusive, curated selection that you won't find anywhere else. From timeless classics to the latest avant-garde designs, our collection is meticulously chosen to meet the highest standards of aesthetics and durability.
              </p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border">
            <h3 className="text-2xl font-bold mb-8">Why Choose Us</h3>
            <ul className="space-y-6">
              {[
                "Unmatched Premium Selection",
                "Expert Architectural Consultation",
                "Transparent & Competitive Pricing",
                "Dedicated After-Sales Support",
                "Secure & Timely Delivery"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
