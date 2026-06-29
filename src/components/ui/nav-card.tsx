"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

interface NavCardProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  bareSpinner?: boolean;
}

function NavCardInner({ children, className, activeClassName, bareSpinner, onClick, href, ...props }: NavCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset navigation state if the path or search params change (in case they navigate back or it's a soft navigation)
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Determine if this is a standard navigation click
    const isModifiedEvent = !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
    const isPrimaryClick = e.button === 0;
    
    // Check if target is external or same page hash link
    const hrefStr = href.toString();
    const isExternal = hrefStr.startsWith("http") || hrefStr.startsWith("mailto:") || hrefStr.startsWith("tel:");
    const isSamePage = hrefStr.startsWith("#") || (hrefStr.startsWith(pathname) && hrefStr.includes("#"));

    if (
      !e.defaultPrevented &&
      isPrimaryClick &&
      !isModifiedEvent &&
      !isExternal &&
      !isSamePage
    ) {
      // Small timeout to allow the browser to register the click visually before freezing UI
      setTimeout(() => {
        setIsNavigating(true);
      }, 50);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link 
      href={href}
      {...props} 
      onClick={handleClick}
      className={cn(
        "relative block overflow-hidden",
        className,
        isNavigating && activeClassName
      )}
    >
      <div className={cn("transition-all duration-300 w-full h-full", isNavigating && "blur-sm opacity-70")}>
        {children}
      </div>
      
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
          {bareSpinner ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <div className="bg-background/90 p-3 rounded-full shadow-xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

export function NavCard(props: NavCardProps) {
  return (
    <Suspense fallback={
      <Link {...props}>
        {props.children}
      </Link>
    }>
      <NavCardInner {...props} />
    </Suspense>
  );
}
