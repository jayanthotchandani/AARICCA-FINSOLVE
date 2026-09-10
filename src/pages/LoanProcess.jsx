import React from "react";
import { UserCheck, Scale, FileEdit, Landmark, Percent, ShieldCheck, Headphones } from "lucide-react";
import { BackLink, PrimaryButton, PageHero } from "../components/ui";
import ProcessPath from "../components/ProcessPath";

const STEPS = [
  { n: "01", icon: UserCheck, title: "Eligibility", desc: "Tell us your requirement. Two minutes to fill basic details." },
  { n: "02", icon: Scale, title: "Compare", desc: "Our engine matches 140+ premier banks and NBFCs with a 90%+ success rate." },
  { n: "03", icon: FileEdit, title: "Apply", desc: "Paperless e-KYC and digital application completed in minutes." },
  { n: "04", icon: Landmark, title: "Disbursement", desc: "Get quick sanction and funds credited directly, not in weeks." },
];

const ADVANTAGES = [
  { icon: Percent, title: "Automated Rate Bidding", desc: "Your profile is matched across 140+ lending institutions simultaneously to capture the lowest available interest bracket." },
  { icon: ShieldCheck, title: "Zero Hard Inquiry Risk", desc: "Soft underwriting checks protect your credit score from the multiple hard hits typically incurred applying at separate banks." },
  { icon: Headphones, title: "Doorstep & Digital Concierge", desc: "A dedicated credit manager coordinates property legal vetting, CA certificates, and bank approvals start to finish." },
];

export default function LoanProcess() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <PageHero title={<>Easy. Convenient. <span className="text-gold-dark">Quick.</span></>} subtitle="The simple, four-step route to your loan." />

      <ProcessPath steps={STEPS} />

      <div className="text-center mt-6 mb-14">
        <PrimaryButton to="/apply">Get Started Online</PrimaryButton>
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-display font-bold text-h3 text-teal-dark">Why Aaricca outperforms a direct bank branch visit</h2>
          <p className="mt-2 text-sm text-ink/65">
            Traditional bank visits mean rigid single-lender policies, slow physical underwriting, and
            score-damaging inquiries. Aaricca brings transparent institutional competition directly to you.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {ADVANTAGES.map((a) => (
            <div key={a.title} className="p-5 rounded-xl bg-surface border border-teal/10">
              <a.icon className="w-5 h-5 text-teal mb-2.5" />
              <h4 className="font-display font-semibold text-sm text-ink">{a.title}</h4>
              <p className="text-xs text-ink/60 mt-1.5 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-teal/10 text-center">
          {[["₹500Cr+", "Capital Disbursed"], ["140+ Banks", "Lending Partners"], ["94.8%", "Sanction Success"], ["24 Hours", "Express Approvals"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-display font-bold text-teal-dark">{v}</p>
              <p className="text-[11px] text-ink/55">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
