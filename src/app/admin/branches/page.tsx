import { Metadata } from "next";
import { getBranches } from "@/actions/branches";
import { BranchClient } from "./components/branch-client";

export const metadata: Metadata = {
  title: "Branch Management | Sangli Ceramica Admin",
};

export default async function BranchesPage() {
  const { data: branches, success, error } = await getBranches();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load branches: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BranchClient data={branches || []} />
    </div>
  );
}
