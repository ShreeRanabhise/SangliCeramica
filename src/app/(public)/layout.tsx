import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getSettings } from "@/actions/settings";
import { WhatsAppWidget } from "@/components/public/whatsapp-widget";
import { MobileNav } from "@/components/public/mobile-nav";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsRes, primaryBranch] = await Promise.all([
    getSettings(),
    prisma.branch.findFirst({ where: { isPrimary: true } })
  ]);
  const whatsappNumber = primaryBranch?.whatsapp || (settingsRes.success ? settingsRes.data?.whatsapp : null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
      {whatsappNumber && <WhatsAppWidget phoneNumber={whatsappNumber} />}
    </div>
  );
}
