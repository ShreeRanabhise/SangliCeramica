import { Metadata } from "next";
import { getAllContent } from "@/actions/content";
import { ContentForm } from "./components/content-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Content | Sangli Ceramica Admin",
};

export default async function ContentPage() {
  const { data: contents, success, error } = await getAllContent();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load content: {error}</p>
      </div>
    );
  }

  const getSectionData = (section: string) => {
    return contents?.find(c => c.section === section) || { section, content: {} };
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-sm text-muted-foreground">
            Update the text and imagery on your public website pages.
          </p>
        </div>
      </div>
      <hr className="my-4" />

      <Tabs defaultValue="HERO" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="HERO">Homepage Hero</TabsTrigger>
          <TabsTrigger value="ABOUT">Homepage About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="HERO" className="p-4 border rounded-lg bg-card">
          <h3 className="text-lg font-medium mb-6">Hero Section</h3>
          <ContentForm section="HERO" initialData={getSectionData("HERO")} />
        </TabsContent>
        
        <TabsContent value="ABOUT" className="p-4 border rounded-lg bg-card">
          <h3 className="text-lg font-medium mb-6">About Section</h3>
          <ContentForm section="ABOUT" initialData={getSectionData("ABOUT")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
