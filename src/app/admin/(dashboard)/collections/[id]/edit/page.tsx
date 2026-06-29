import { Metadata } from "next";
import { getCollectionByName } from "@/actions/collections";
import { CollectionForm } from "../../components/collection-form";

export const metadata: Metadata = {
  title: "Edit Collection | Sangli Ceramica Admin",
};

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getCollectionByName(id);

  if (!res.success || !res.data) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load collection details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CollectionForm initialData={res.data} />
    </div>
  );
}
