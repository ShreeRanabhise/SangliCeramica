"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Eye } from "lucide-react";
import { deleteInquiry, updateInquiryStatus } from "@/actions/inquiries";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InquiryClientProps {
  data: any[];
}

export const InquiryClient: React.FC<InquiryClientProps> = ({ data }) => {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      setLoading(true);
      const res = await deleteInquiry(id);
      if (res.success) {
        toast.success("Inquiry deleted successfully.");
        if (selectedInquiry?.id === id) setIsViewOpen(false);
      } else {
        toast.error(res.error || "Failed to delete inquiry.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const res = await updateInquiryStatus(id, status);
      if (res.success) {
        toast.success("Status updated.");
      } else {
        toast.error(res.error || "Failed to update status.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const openView = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsViewOpen(true);
    // Auto mark as read if it's NEW
    if (inquiry.status === "NEW") {
      handleUpdateStatus(inquiry.id, "READ");
    }
  };

  return (
    <>
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Received on {new Date(selectedInquiry?.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{selectedInquiry.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-lg font-medium">{selectedInquiry.mobileNumber}</p>
              </div>
              {selectedInquiry.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedInquiry.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-base bg-muted/50 p-4 rounded-lg mt-1">{selectedInquiry.message}</p>
              </div>
              <div className="pt-4 border-t flex gap-2">
                <Button className="w-full" variant="outline" onClick={() => handleUpdateStatus(selectedInquiry.id, "ARCHIVED")}>
                  Archive
                </Button>
                <a href={`https://wa.me/${selectedInquiry.mobileNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "w-full bg-green-600 hover:bg-green-700 text-white" })}>
                  Reply on WhatsApp
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer messages and leads
          </p>
        </div>
      </div>
      <hr className="my-4" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((inquiry) => (
                <TableRow key={inquiry.id} className={inquiry.status === "NEW" ? "bg-primary/5 font-medium" : ""}>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === "NEW" ? "bg-blue-100 text-blue-800" :
                      inquiry.status === "READ" ? "bg-slate-100 text-slate-800" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {inquiry.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.mobileNumber}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openView(inquiry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(inquiry.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
