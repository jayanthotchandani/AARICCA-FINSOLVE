import React from "react";
import { BackLink, PageHero } from "../components/ui";
import Seo from "../components/Seo";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <Seo
        title="Privacy Policy"
        description="How Aaricca Finsales collects, uses, and protects your personal information."
        path="/privacy"
        noindex
      />
      <BackLink />
      <PageHero title="Privacy Policy" />

      <div className="bg-gold/10 border border-gold/40 rounded-xl p-4 mb-8 text-xs text-ink/70 leading-relaxed">
        <strong className="text-teal-dark">Draft content — pending legal review.</strong> This page is a
        placeholder built to give "Privacy Policy" a real destination instead of redirecting to the FAQ page.
        Replace this text with the client's reviewed policy before this is treated as final.
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 space-y-6 text-sm text-ink/75 leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">1. Information we collect</h2>
          <p>
            When you fill out a form on this site (name, mobile number, loan type, amount, income, PAN, or
            similar), we collect only what's needed to assess your loan enquiry and connect you with a
            suitable bank or NBFC partner.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">2. How we use it</h2>
          <p>
            Your information is used to: (a) have an advisor contact you about your enquiry, (b) match your
            profile against our partner banks' and NBFCs' loan criteria, and (c) share your application with
            the specific lender you choose to proceed with. We do not sell your data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">3. Credit bureau checks</h2>
          <p>
            Where you explicitly consent (for example, on our Check Your Score page), we or our bureau partner
            may run a soft credit inquiry to fetch your score. A soft inquiry does not impact your credit
            score.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">4. Data sharing</h2>
          <p>
            We share your enquiry details only with the specific bank(s) or NBFC(s) relevant to processing
            your loan request, and with First Advisor as our regulated partner. We do not share your data for
            unrelated marketing by third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">5. Your choices</h2>
          <p>
            You can ask us to stop contacting you at any time by emailing sales@aaricca.com. We retain enquiry
            data only as long as needed to service your request or as required by applicable regulation.
          </p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-teal-dark mb-2">6. Contact</h2>
          <p>For any privacy questions or requests, reach us at sales@aaricca.com.</p>
        </section>
      </div>
    </div>
  );
}
