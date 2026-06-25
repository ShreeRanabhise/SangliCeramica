import { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact Us | Sangli Ceramica",
  description: "Get in touch with Sangli Ceramica. Visit our showroom, call us, or send an inquiry.",
};

export default async function ContactPage() {
  const [settings, branches] = await Promise.all([
    prisma.contactInformation.findFirst(),
    prisma.branch.findMany({ orderBy: { order: "asc" } })
  ]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you are planning a new build or a renovation, our experts are here to help you select the perfect materials for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info (Branches) */}
          <div className="space-y-12">
            {branches.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border rounded-2xl bg-muted/20">
                No branches configured yet.
              </div>
            ) : (
              branches.map((branch, idx) => (
                <div key={branch.id} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{branch.name}</h2>
                    {branch.isPrimary && <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">Primary Location</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3 p-5 bg-muted/50 rounded-2xl border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Visit Us</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {branch.address}
                      </p>
                    </div>

                    <div className="space-y-3 p-5 bg-muted/50 rounded-2xl border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Call Us</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {branch.phones?.length ? branch.phones.join('\n') : "N/A"}
                      </p>
                    </div>

                    <div className="space-y-3 p-5 bg-muted/50 rounded-2xl border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Email Us</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {branch.email || settings?.email || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-3 p-5 bg-muted/50 rounded-2xl border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Working Hours</h3>
                      <p className="text-muted-foreground whitespace-pre-line text-sm">
                        {branch.hours || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Map */}
                  {branch.mapUrl && (
                    <div className="w-full h-[300px] bg-slate-200 rounded-2xl overflow-hidden relative">
                      <iframe 
                        src={branch.mapUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  )}

                  {idx !== branches.length - 1 && <hr className="my-12 border-slate-200" />}
                </div>
              ))
            )}
          </div>

          {/* Right: Contact Form */}
          <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm h-fit">
            <h2 className="text-2xl font-bold mb-2">Send an Inquiry</h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and our sales team will get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
