import { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact Us | Sangli Ceramica",
  description: "Get in touch with Sangli Ceramica. Visit our showroom, call us, or send an inquiry.",
};

export default async function ContactPage() {
  const settings = await prisma.contactInformation.findFirst();

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
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4 p-6 bg-muted/50 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Visit Us</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {settings?.address || "123 Showroom Avenue,\nSangli, Maharashtra 416416,\nIndia"}
                </p>
              </div>

              <div className="space-y-4 p-6 bg-muted/50 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {settings?.phones?.length ? settings.phones.join('\n') : "+91 98765 43210\n+91 98765 01234"}
                </p>
              </div>

              <div className="space-y-4 p-6 bg-muted/50 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {settings?.email || "info@sangliceramica.com\nsales@sangliceramica.com"}
                </p>
              </div>

              <div className="space-y-4 p-6 bg-muted/50 rounded-2xl border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Working Hours</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {settings?.hours || "Monday - Saturday\n10:00 AM - 8:00 PM\nSunday: Closed"}
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-slate-200 rounded-2xl overflow-hidden relative">
              <iframe 
                src={settings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122283.79383679803!2d74.49842490800727!3d16.84074211189495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc122ebdbce0eb9%3A0xc35dfd974df3b482!2sSangli%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
