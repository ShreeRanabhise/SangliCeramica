"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Showrooms", href: "/showrooms" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and clear pending path on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPendingPath(null);
  }, [pathname]);

  const isHome = pathname === "/";
  const lightText = !isScrolled && isHome;

  return (
    <div className={cn("fixed top-0 left-0 w-full z-50 transition-all duration-500 px-2 md:px-4", isScrolled ? "pt-2 md:pt-4" : "pt-4 md:pt-6")}>
      <header
        className={cn(
          "mx-auto transition-all duration-500",
          isScrolled
            ? "bg-background/85 backdrop-blur-xl border rounded-full shadow-lg max-w-5xl"
            : isHome
              ? "bg-[#2596be]/90 backdrop-blur-md border border-white/20 rounded-full w-full max-w-7xl shadow-lg"
              : "bg-background/60 backdrop-blur-md border border-border rounded-full w-full max-w-7xl shadow-sm"
        )}
      >
        <div className="px-4 md:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className={cn(
                "font-black text-2xl tracking-tighter transition-colors",
                lightText ? "text-white" : "text-foreground"
              )}>
                SANGLI <span className="font-light text-primary">CERAMICA</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isPending = pendingPath === link.href;
                const showIndicator = isActive || isPending;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setPendingPath(link.href)}
                    className={cn(
                      "text-sm font-medium transition-colors relative",
                      showIndicator 
                        ? "text-primary" 
                        : (lightText ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary")
                    )}
                  >
                    {link.name}
                    {showIndicator && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className={cn(
                          "absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full overflow-hidden",
                          isPending ? "bg-primary/20" : "bg-primary"
                        )}
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {isPending && (
                          <motion.div
                            className="absolute top-0 h-full w-1/3 bg-primary rounded-full"
                            initial={{ left: "-50%" }}
                            animate={{ left: "150%" }}
                            transition={{ 
                              duration: 0.8, 
                              ease: "easeInOut", 
                              repeat: Infinity,
                              repeatDelay: 0.1 
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Link href="/contact" className={buttonVariants({ variant: lightText ? "secondary" : "default", className: "rounded-full px-6" })}>
                  Inquire Now
                </Link>
              </div>
              
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className={cn("h-6 w-6", lightText && "text-white")} />
                ) : (
                  <Menu className={cn("h-6 w-6", lightText && "text-white")} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium p-3 rounded-xl transition-colors",
                      pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  <Link
                    href="/contact"
                    className={buttonVariants({ variant: "default", className: "w-full justify-center h-14 text-base rounded-xl" })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inquire Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
