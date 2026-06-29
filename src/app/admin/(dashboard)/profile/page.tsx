import { Metadata } from "next";
import { ProfileClient } from "./components/profile-client";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile | Sangli Ceramica Admin",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your admin account settings.
          </p>
        </div>
      </div>
      <hr className="my-4" />
      <div className="max-w-2xl">
        <ProfileClient email={user?.email || "Unknown"} />
      </div>
    </div>
  );
}
