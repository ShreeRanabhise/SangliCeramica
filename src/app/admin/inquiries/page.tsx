import { Metadata } from "next";
import { getInquiries } from "@/actions/inquiries";
import { InquiryClient } from "./components/inquiry-client";

export const metadata: Metadata = {
  title: "Inquiries | Sangli Ceramica Admin",
};

export default async function InquiriesPage() {
  const { data: inquiries, success, error } = await getInquiries();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load inquiries: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <InquiryClient data={inquiries || []} />
    </div>
  );
}
