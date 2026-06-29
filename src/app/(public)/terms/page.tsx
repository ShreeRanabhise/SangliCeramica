import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Sangli Ceramica",
  description: "Terms of Service for Sangli Ceramica",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Sangli Ceramica's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on Sangli Ceramica's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Sangli Ceramica's website are provided on an 'as is' basis. Sangli Ceramica makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Sangli Ceramica or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sangli Ceramica's website, even if Sangli Ceramica or a Sangli Ceramica authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials appearing on Sangli Ceramica's website could include technical, typographical, or photographic errors. Sangli Ceramica does not warrant that any of the materials on its website are accurate, complete, or current. Sangli Ceramica may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
