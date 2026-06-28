import Link from "next/link";
import { Globe, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";

export async function Footer() {
  const [settings, catalogues, primaryBranch] = await Promise.all([
    prisma.contactInformation.findFirst(),
    prisma.catalogue.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    prisma.branch.findFirst({ where: { isPrimary: true } })
  ]);
  const mainCatalogue = catalogues[0];
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Sangli Ceramica
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium showroom specializing in luxury tiles, elegant sanitaryware, and premium doors. Transform your spaces with our exclusive collections.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/catalog" },
                { name: "Gallery", href: "/gallery" },
                { name: "About Us", href: "/about" },
                { name: "Download Catalogue", href: "/#catalogues" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group w-fit">
                    <span className="h-px w-0 bg-primary group-hover:w-4 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex gap-4 text-sm text-slate-400 items-start">
                <div className="mt-1 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="whitespace-pre-line leading-relaxed">{primaryBranch?.address || "Please configure a primary branch in admin."}</span>
              </li>
              <li className="flex gap-4 text-sm text-slate-400 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>{primaryBranch?.phones?.[0] || "+91 98765 43210"}</span>
              </li>
              <li className="flex gap-4 text-sm text-slate-400 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>{primaryBranch?.email || settings?.email || "info@sangliceramica.com"}</span>
              </li>
            </ul>
          </div>

          {/* Action / CTA */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Visit Our Showroom</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Experience our premium collections in person. Get expert advice for your project.
            </p>
            <div className="space-y-3">
              <Link href="/showrooms" className={buttonVariants({ className: "w-full justify-start gap-3 h-12 shadow-lg shadow-primary/20", variant: "default" })}>
                <MapPin className="w-4 h-4" />
                Get Directions
              </Link>
              {mainCatalogue && (
                <a href={mainCatalogue.fileUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "w-full justify-start gap-3 h-12 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80" })}>
                  Download Catalogue
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Sangli Ceramica. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
