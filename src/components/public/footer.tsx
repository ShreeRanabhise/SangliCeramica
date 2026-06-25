import Link from "next/link";
import { Globe, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";

export async function Footer() {
  const [settings, catalogues] = await Promise.all([
    prisma.contactInformation.findFirst(),
    prisma.catalogue.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } })
  ]);
  const mainCatalogue = catalogues[0];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Sangli Ceramica
              </span>
            </Link>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Premium showroom specializing in luxury tiles, elegant sanitaryware, and premium doors. Transform your spaces with our exclusive collections.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Catalog", "Gallery", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            {mainCatalogue && (
              <div className="mt-6">
                <a href={mainCatalogue.fileUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" })}>
                  Download Catalogue
                </a>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-slate-400">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="whitespace-pre-line">{settings?.address || "123 Showroom Ave, Sangli,\nMaharashtra 416416, India"}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{settings?.phones?.[0] || "+91 98765 43210"}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{settings?.email || "info@sangliceramica.com"}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Visit Our Showroom</h3>
            <p className="text-sm text-slate-400 mb-4">
              Experience our premium collections in person. Get expert advice for your project.
            </p>
            <Link href="/contact" className={buttonVariants({ className: "w-full", variant: "default" })}>
              Get Directions
            </Link>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Sangli Ceramica. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
