import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function Loader({ className, text = "Loading...", fullScreen = false }: LoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "w-full h-full min-h-[400px]",
      className
    )}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl animate-pulse" />
        
        {/* Brand Logo Box */}
        <div className="relative w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce">
          <span className="text-primary-foreground font-bold text-3xl">S</span>
        </div>
        
        {/* Spinning indicator around it */}
        <Loader2 className="absolute -inset-4 w-22 h-22 text-primary/40 animate-spin" strokeWidth={1} />
      </div>
      <p className="text-muted-foreground font-medium animate-pulse tracking-widest uppercase text-sm mt-4">
        {text}
      </p>
    </div>
  );
}
