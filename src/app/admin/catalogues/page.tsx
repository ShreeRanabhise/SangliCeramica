import { Metadata } from "next";
import { getCatalogues } from "@/actions/catalogues";
import { CatalogueClient } from "./components/catalogue-client";

export const metadata: Metadata = {
  title: "Catalogues | Sangli Ceramica Admin",
};

export default async function CataloguesPage() {
  const { data: catalogues, success, error } = await getCatalogues();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load catalogues: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CatalogueClient data={catalogues || []} />
    </div>
  );
}
