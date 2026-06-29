"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavCard } from "@/components/ui/nav-card";
import { Home, Package, Image as ImageIcon, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: Package },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="flex items-center justify-around p-2">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
          const Icon = link.icon;
          
          const Component = link.name === "Products" ? NavCard : Link;
          
          return (
            <Component
              key={link.name}
              href={link.href}
              className={cn(
                "block p-2 min-w-[4.5rem] rounded-xl transition-all",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
                <span className="text-[10px] font-medium leading-none">{link.name}</span>
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}
