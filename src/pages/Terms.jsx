import React from "react";
import { BackLink, PageHero } from "../components/ui";
import Seo from "../components/Seo";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <Seo
        title="Terms & Conditions"
        description="Terms and conditions for using the Aaricca Finsales website and loan distribution services."
        path="/terms"
        noindex
      />
      <BackLink />
      <PageHero title="Terms & Conditions" />

      <div className="bg-gold/10 border border-gold/40 rounded-xl p-4 mb-8 text-xs text-ink/70 leading-relaxed">
        <strong className="text-teal-dark">Draft content — pending legal review.</strong> This page is a
        placeholder built to give "Terms & Conditions" a real destination instead of redirecting to the FAQ page.
        Replace this text with the client's reviewed terms before this is treated as final.
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 space-y-6 text-sm text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">1. Who we are</h2>
          <p>
            Aaricca Finsales ("Aaricca", "we", "us") operates as a corporate DSA (Direct Selling Agent) in
            partnership with First Advisor, connecting borrowers with RBI-regulated banks and NBFCs. We do not
            ourselves sanction or disburse loans — all loan approvals, rates, and terms are decided solely by
            the partner bank or NBFC underwriting your application.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">2. Using this website</h2>
          <p>
            By submitting a form on this site, you consent to Aaricca and its partner banks/NBFCs contacting
            you by phone, SMS, WhatsApp, or email regarding your enquiry. Information you submit is used only
            to process your loan enquiry and is shared with partner lenders solely for that purpose.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">3. No guarantee of approval</h2>
          <p>
            Submitting an enquiry or application through Aaricca does not guarantee loan approval. Final
            sanction, interest rate, and terms are at the sole discretion of the lending bank or NBFC, subject
            to their underwriting policies.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">4. Fees</h2>
          <p>
            Aaricca does not charge borrowers any upfront advisory or processing fee for loan comparison or
            application assistance. Any bank processing fees, stamp duty, or legal charges are those of the
            partner lender and will be disclosed in your official sanction letter.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">5. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of this site after an update
            constitutes acceptance of the revised terms.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">6. Contact</h2>
          <p>For questions about these terms, reach us at sales@aaricca.com.</p>
        </section>
      </div>
    </div>
  );
}
