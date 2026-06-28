import { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact Us | Sangli Ceramica",
  description: "Get in touch with Sangli Ceramica. Visit our showroom, call us, or send an inquiry.",
};

export default async function ContactPage() {
  const [settings, primaryBranch] = await Promise.all([
    prisma.contactInformation.findFirst(),
    prisma.branch.findFirst({ where: { isPrimary: true } })
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
          
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    {primaryBranch?.phones?.length ? primaryBranch.phones.join('\n') : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    {primaryBranch?.email || settings?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Working Hours</h3>
                  <p className="text-muted-foreground">
                    {primaryBranch?.hours || "N/A"}
                  </p>
                </div>
              </div>
            </div>
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
