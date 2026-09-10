import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { FAQS } from "../data";
import { BackLink, PrimaryButton, PageHero, AccordionPanel } from "../components/ui";

const CATEGORIES = ["All", "General", "Loan Process", "Eligibility", "Rates & Charges"];

export default function Faqs() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openIdx, setOpenIdx] = useState(0);

  const filtered = useMemo(() => {
    return FAQS.filter((f) => {
      const matchCat = category === "All" || f.category === category;
      const matchQuery =
        !query ||
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [query, category]);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <PageHero title="Frequently asked questions" subtitle="Instant answers on interest rates, eligibility criteria, and regulatory practices." />

      <div className="relative mb-5">
        <Search className="w-4 h-4 text-ink/35 absolute start-4 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions (e.g. prepayment, credit score, charges)…"
          className="w-full ps-11 pe-4 py-3 rounded-xl border border-teal/20 bg-white text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-shadow"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === c ? "bg-teal text-white border-teal" : "bg-white text-ink/65 border-teal/15 hover:border-teal/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2.5 mb-10">
        {filtered.length === 0 && (
          <p className="text-sm text-ink/55 text-center py-8">No questions match your search.</p>
        )}
        {filtered.map((item, i) => (
          <div key={item.q} className="bg-white rounded-xl border border-teal/12 overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink pe-4">{item.q}</span>
              <ChevronDown className={`w-4 h-4 text-teal shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
            </button>
            <AccordionPanel open={openIdx === i}>
              <p className="accordion-panel-content px-5 pb-4 text-sm text-ink/65 leading-relaxed">{item.a}</p>
            </AccordionPanel>
          </div>
        ))}
      </div>

      <div className="bg-teal-dark rounded-2xl p-8 text-center text-white">
        <h2 className="font-display font-semibold text-lg">Still have questions?</h2>
        <p className="text-sm text-cream/70 mt-1 mb-4">Our senior loan officers in Gurugram are available for phone or doorstep consultations.</p>
        <PrimaryButton to="/apply" className="!bg-gold !text-teal-dark hover:!bg-gold-dark hover:!text-white">
          Request Free Callback
        </PrimaryButton>
      </div>
    </div>
  );
}
