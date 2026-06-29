"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitInquiry } from "@/actions/inquiries";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("+91 ");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+91 ")) {
      val = "+91 ";
    }
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 10);
    setPhone("+91 " + digits);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!/^\+91 \d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.set("mobileNumber", phone); // Ensure formatted phone is submitted
      
      const res = await submitInquiry(formData);
      
      if (res.success) {
        toast.success("Message sent successfully! We will get back to you soon.");
        (e.target as HTMLFormElement).reset();
        setPhone("+91 ");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" required disabled={loading} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Phone Number <span className="text-destructive">*</span></Label>
          <Input 
            id="mobileNumber" 
            name="mobileNumber" 
            required 
            disabled={loading} 
            placeholder="+91 98765 43210" 
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" disabled={loading} placeholder="john@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
        <Textarea 
          id="message" 
          name="message" 
          required 
          disabled={loading} 
          placeholder="How can we help you?" 
          rows={5} 
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
        Send Message
      </Button>
    </form>
  );
}
