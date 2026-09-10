import React from "react";
import { Zap, Percent, ShieldCheck, Headphones, FileText, Landmark } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { BackLink, PrimaryButton, PageHero } from "../components/ui";
import IndiaMap from "../components/IndiaMap";
import Reveal from "../components/Reveal";

// Logo files live in public/logos/banks — only partners we have an actual
// logo asset for appear in the marquee (rather than mixing in text-name
// placeholders for the rest of BANK_PARTNERS, which would look inconsistent
// next to real logos).
const PARTNER_LOGOS = [
  { name: "HDFC Bank", src: "/logos/banks/hdfc-bank.png" },
  { name: "ICICI Bank", src: "/logos/banks/icici-bank.png" },
  { name: "State Bank of India", src: "/logos/banks/state-bank-of-india.png" },
  { name: "Axis Bank", src: "/logos/banks/axis-bank.png" },
  { name: "Kotak Mahindra Bank", src: "/logos/banks/kotak-mahindra.png" },
  { name: "Bank of Baroda", src: "/logos/banks/bank-of-baroda.png" },
  { name: "Punjab National Bank", src: "/logos/banks/punjab-national-bank.png" },
  { name: "Tata Capital", src: "/logos/banks/tata-capital.jpg" },
  { name: "Bajaj Finserv", src: "/logos/banks/bajaj-finserv.png" },
  { name: "Aditya Birla Capital", src: "/logos/banks/aditya-birla-capital.png" },
  { name: "IDFC FIRST Bank", src: "/logos/banks/idfc-first-bank.png" },
  { name: "Yes Bank", src: "/logos/banks/yes-bank.png" },
];

const PILLARS = [
  { icon: Zap, title: "Speed & Express Sanction", desc: "Digital verification pipelines enable pre-approvals in minutes and bank disbursals in 24 hours." },
  { icon: Percent, title: "Lowest Rate Guarantee", desc: "Simultaneous rate bidding across 40+ scheduled banks ensures your optimum borrowing cost." },
  { icon: ShieldCheck, title: "Zero Hidden Charges", desc: "No upfront fees. Complete disclosure on bank processing fees, legal charges, and stamp duties." },
  { icon: Headphones, title: "Dedicated Loan Specialist", desc: "A personal credit advisor manages your paperwork, doorstep collection, and bank coordination." },
  { icon: FileText, title: "Paperless Documentation", desc: "Seamless DigiLocker and account-aggregator integrations for instant financial verification." },
  { icon: Landmark, title: "40+ Institutional Partners", desc: "Empaneled with tier-1 private lenders, public sector undertakings, and leading retail NBFCs." },
];

export default function WhyAaricca() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <PageHero title="Why choose Aaricca Finsolve" subtitle="Connecting Indian borrowers with institutional capital at fair, transparent, and legally vetted terms." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} index={i}>
            <div className="bg-white rounded-2xl border border-teal/12 p-6 hover:border-teal/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal/8 text-teal flex items-center justify-center mb-3">
                <p.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-semibold text-ink text-sm">{p.title}</h3>
              <p className="text-xs text-ink/60 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-display font-bold text-h3 text-teal-dark">Pan-India borderless credit</h2>
          <p className="mt-2 text-sm text-ink/65">Select any node below to see the Aaricca digital advantage in that region.</p>
        </div>
        <IndiaMap />
      </div>

      <div className="mb-16">
        <div className="text-center mb-6">
          <h2 className="font-display font-bold text-h3 text-teal-dark">Our lending partners</h2>
        </div>
        <div className="relative overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-cream to-transparent z-10" />
          <div className="flex w-max animate-ticker">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((bank, i) => (
              <div key={i} className="flex items-center justify-center shrink-0 px-8 sm:px-10" style={{ width: "220px", height: "104px" }}>
                <img src={bank.src} alt={bank.name} title={bank.name} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-14">
        <h2 className="font-display font-bold text-h3 text-teal-dark text-center mb-8">What our borrowers say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} index={i}>
              <figure className="bg-white rounded-2xl border border-teal/12 p-6">
                <blockquote className="text-sm text-ink/75 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 pt-4 border-t border-teal/10">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink/55">{t.role} · {t.loan} · {t.amount}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="text-center">
        <PrimaryButton to="/apply">Start Your Application</PrimaryButton>
      </div>
    </div>
  );
}
