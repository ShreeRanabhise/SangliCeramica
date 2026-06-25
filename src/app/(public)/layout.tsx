import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getSettings } from "@/actions/settings";
import { WhatsAppWidget } from "@/components/public/whatsapp-widget";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsRes = await getSettings();
  const whatsappNumber = settingsRes.success ? settingsRes.data?.whatsapp : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {whatsappNumber && <WhatsAppWidget phoneNumber={whatsappNumber} />}
    </div>
  );
}
