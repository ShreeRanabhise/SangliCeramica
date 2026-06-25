"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitInquiry } from "@/actions/inquiries";
import { toast } from "sonner";
import { Download, Loader2, CheckCircle2, LockOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CatalogueDownloadFormProps {
  catalogues: any[];
}

export function CatalogueDownloadForm({ catalogues }: CatalogueDownloadFormProps) {
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      // We append a hidden message to identify this as a catalogue lead
      formData.append("message", "Requested to download catalogues from homepage.");

      const res = await submitInquiry(formData);
      
      if (res.success) {
        toast.success("Details verified. You can now download the catalogues.");
        setIsUnlocked(true);
      } else {
        toast.error(res.error || "Failed to verify details. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!catalogues || catalogues.length === 0) return null;

  return (
    <div className="w-full md:w-auto relative">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-background rounded-2xl p-6 shadow-lg border w-full max-w-sm"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <LockOpen className="h-5 w-5 text-primary" /> Unlock Catalogues
              </h3>
              <p className="text-sm text-muted-foreground">Please provide your details to access our premium PDF catalogues.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" required disabled={loading} placeholder="E.g. Jane Doe" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="mobileNumber" name="mobileNumber" required disabled={loading} placeholder="+91 98765 43210" className="bg-muted/50" />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Access Downloads"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="downloads"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 w-full"
          >
            <div className="flex items-center gap-2 text-green-600 mb-2 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <span>Catalogues Unlocked Successfully!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catalogues.map((cat: any) => (
                <a 
                  key={cat.id} 
                  href={cat.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-medium"
                >
                  <Download className="h-5 w-5" />
                  <span>{cat.title}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
