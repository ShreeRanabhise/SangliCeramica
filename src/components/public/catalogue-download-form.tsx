"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitInquiry } from "@/actions/inquiries";
import { toast } from "sonner";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CatalogueDownloadFormProps {
  catalogue: any;
}

export function CatalogueDownloadForm({ catalogue }: CatalogueDownloadFormProps) {
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");

  // Validate that name is not empty and phone has +91 followed by exactly 10 digits
  const isValid = name.trim().length > 0 && /^\+91 \d{10}$/.test(phone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Ensure it always starts with "+91 "
    if (!val.startsWith("+91 ")) {
      val = "+91 ";
    }
    // Only allow digits after +91 
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 10);
    setPhone("+91 " + digits);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobileNumber", phone);
      formData.append("message", `Requested to download catalogue: ${catalogue.title}`);

      const res = await submitInquiry(formData);
      
      if (res.success) {
        toast.success("Details verified! Your download is starting.");
        setIsUnlocked(true);
        // Automatically trigger the download
        window.open(catalogue.fileUrl, "_blank");
      } else {
        toast.error(res.error || "Failed to verify details. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!catalogue) return null;

  return (
    <div className="w-full relative h-full">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow w-full h-full flex flex-col justify-between"
          >
            <div className="mb-6">
              {catalogue.coverImage && (
                <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-sm">
                  <img src={catalogue.coverImage} alt={catalogue.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary shrink-0" /> <span className="truncate">{catalogue.title}</span>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">Please provide your details to download this premium PDF catalogue.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${catalogue.id}`}>Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  id={`name-${catalogue.id}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  disabled={loading} 
                  placeholder="E.g. Jane Doe" 
                  className="bg-muted/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${catalogue.id}`}>Phone Number <span className="text-destructive">*</span></Label>
                <Input 
                  id={`phone-${catalogue.id}`}
                  value={phone}
                  onChange={handlePhoneChange}
                  required 
                  disabled={loading} 
                  className="bg-muted/50" 
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading || !isValid}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Download Now"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="downloads"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-primary/5 rounded-2xl p-6 shadow-sm border border-primary/20 w-full h-full flex flex-col items-center justify-center text-center gap-4 min-h-[300px]"
          >
            <div className="flex flex-col items-center justify-center gap-3 text-green-600 mb-2">
              <CheckCircle2 className="h-12 w-12" />
              <span className="font-medium text-lg text-foreground">Thank you!</span>
              <p className="text-sm text-muted-foreground text-center">Your catalogue download has started. If it didn't, you can click below.</p>
            </div>
            <a 
              href={catalogue.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-medium w-full"
            >
              <Download className="h-5 w-5" />
              <span>Download Again</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
