import { Metadata } from "next";
import { getBrands } from "@/actions/brands";
import { BrandClient } from "./components/brand-client";

export const metadata: Metadata = {
  title: "Brands | Sangli Ceramica Admin",
};

export default async function BrandsPage() {
  const { data: brands, success, error } = await getBrands();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load brands: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BrandClient data={brands || []} />
    </div>
  );
}
