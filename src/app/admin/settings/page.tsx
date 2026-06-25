import { Metadata } from "next";
import { getSettings } from "@/actions/settings";
import { SettingsForm } from "./components/settings-form";

export const metadata: Metadata = {
  title: "Settings | Sangli Ceramica Admin",
};

export default async function SettingsPage() {
  const { data: settings, success, error } = await getSettings();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load settings: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Showroom Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your showroom's contact information, location, and global settings.
          </p>
        </div>
      </div>
      <hr className="my-4" />

      <div className="p-6 border rounded-lg bg-card">
        <SettingsForm initialData={settings || {}} />
      </div>
    </div>
  );
}
