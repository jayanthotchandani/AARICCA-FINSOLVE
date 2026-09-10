import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  PhoneCall,
  Landmark,
  MapPin,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mail,
} from "lucide-react";
import { LOAN_TYPES } from "../data";
import { AccordionPanel } from "./ui";

const TICKER_ITEMS = [
  { icon: PhoneCall, text: "Toll-Free 24×7 Support: 1800-AARICCA" },
  { icon: Landmark, text: "Multi-Bank Distribution Partner: 40+ Scheduled Commercial Banks & NBFCs" },
  { icon: MapPin, text: "Pan-India Operations: Express Doorstep & Digital Advisory in 120+ Cities" },
  { icon: ShieldCheck, text: "Enterprise Security: ISO 27001:2025 Certified & 256-Bit SSL Encrypted" },
];

function UtilityBar() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-teal-dark text-cream/90 text-xs overflow-hidden select-none border-b border-white/10">
      <div className="flex w-max animate-ticker py-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 whitespace-nowrap">
            <item.icon className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={2} />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

const NAV_LINK_CLASS = ({ isActive }) =>
  `relative py-2 text-sm font-medium transition-colors hover:text-teal ${
    isActive ? "text-teal font-semibold" : "text-ink/80"
  }`;

const HOVER_OPEN_DELAY = 200;

function Dropdown({ label, items, isOpenPath }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const openTimer = useRef(null);
  const location = useLocation();
  const active = isOpenPath(location.pathname);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => () => clearTimeout(openTimer.current), []);

  function scheduleOpen() {
    clearTimeout(openTimer.current);
    // A brief hover-intent delay — without it, the menu pops open the
    // instant the cursor merely passes over the trigger on its way
    // somewhere else, which reads as premature rather than responsive.
    openTimer.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY);
  }

  function cancelScheduledOpen() {
    clearTimeout(openTimer.current);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={cancelScheduledOpen}
    >
      <button
        onClick={() => {
          clearTimeout(openTimer.current);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-teal ${
          active ? "text-teal font-semibold" : "text-ink/80"
        }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {/* This shell is only for positioning and is exactly as tall as the
          menu content even while closed, so its pointer-events must track
          `open` exactly: `none` while closed (otherwise it's a live
          hoverable box reaching into the content below the nav, firing
          onMouseEnter regardless of state), but `auto` while open — a
          blanket `none` would also swallow the small gap between the
          trigger and the menu, closing the menu the instant the cursor
          crosses that gap on its way to click an item. */}
      <div
        className="absolute start-0 top-full pt-2 z-40"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div
          data-open={open}
          className="menu-pop w-64 bg-white rounded-xl border border-teal/12 shadow-raised py-2"
          style={{ "--menu-origin": "top left" }}
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex flex-col px-4 py-2.5 hover:bg-teal/5 transition-colors"
            >
              <span className="text-sm font-semibold text-ink">{item.label}</span>
              {item.sub && <span className="text-xs text-ink/55 mt-0.5">{item.sub}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [location.pathname]);

  const productItems = LOAN_TYPES.map((l) => ({
    to: `/loans/${l.id}`,
    label: l.title,
    sub: l.amount,
  }));
  const scoreItems = [
    { to: "/credit-score/check", label: "Check Your Score", sub: "Free bureau soft-pull, no impact" },
    { to: "/credit-score/improve", label: "Improve Your Score", sub: "A ranked, week-by-week plan" },
  ];

  return (
    <>
      <UtilityBar />
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-teal/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Aaricca Finsales home">
            <img src="/logo.png" alt="" className="h-14 w-auto" />
            <span className="sr-only">Aaricca Finsales</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            <Dropdown label="Products" items={productItems} isOpenPath={(p) => p.startsWith("/loans")} />
            <Dropdown label="Credit Score" items={scoreItems} isOpenPath={(p) => p.startsWith("/credit-score")} />
            <NavLink to="/debt-consolidation" className={NAV_LINK_CLASS}>
              Debt Consolidation
            </NavLink>
            <NavLink to="/calculators" className={NAV_LINK_CLASS}>
              Calculators
            </NavLink>
            <NavLink to="/loan-process" className={NAV_LINK_CLASS}>
              Loan Process
            </NavLink>
            <NavLink to="/why-aaricca" className={NAV_LINK_CLASS}>
              Why Aaricca
            </NavLink>
            <NavLink to="/faqs" className={NAV_LINK_CLASS}>
              FAQs
            </NavLink>
          </nav>

          <div className="hidden lg:block shrink-0">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors shadow-card"
            >
              Get Instant Approval
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 -me-2 rounded-lg text-teal"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AccordionPanel
          as="nav"
          open={mobileOpen}
          className="lg:hidden border-t border-teal/12 bg-cream"
          aria-label="Mobile"
          aria-hidden={!mobileOpen}
        >
          <div className="px-5 py-5 space-y-1">
            <MobileSection title="Products">
              {productItems.map((item) => (
                <Link key={item.to} to={item.to} className="block py-1.5 text-sm text-ink/80">
                  {item.label}
                </Link>
              ))}
            </MobileSection>
            <MobileSection title="Credit Score">
              {scoreItems.map((item) => (
                <Link key={item.to} to={item.to} className="block py-1.5 text-sm text-ink/80">
                  {item.label}
                </Link>
              ))}
            </MobileSection>
            <Link to="/debt-consolidation" className="block py-2.5 text-sm font-medium border-t border-teal/10">
              Debt Consolidation
            </Link>
            <Link to="/calculators" className="block py-2.5 text-sm font-medium border-t border-teal/10">
              Calculators
            </Link>
            <Link to="/loan-process" className="block py-2.5 text-sm font-medium border-t border-teal/10">
              Loan Process
            </Link>
            <Link to="/why-aaricca" className="block py-2.5 text-sm font-medium border-t border-teal/10">
              Why Aaricca
            </Link>
            <Link to="/faqs" className="block py-2.5 text-sm font-medium border-t border-teal/10">
              FAQs
            </Link>
            <Link
              to="/apply"
              className="mt-3 flex items-center justify-center gap-2 py-3 rounded-full bg-teal text-white text-sm font-semibold"
            >
              Get Instant Approval
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AccordionPanel>
      </header>
    </>
  );
}

function MobileSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-teal/10 py-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-sm font-medium text-ink"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="ps-3 pb-2 space-y-0.5">{children}</div>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-teal-dark text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid md:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-2 space-y-4">
            <img src="/logo.png" alt="Aaricca Finsales" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed text-cream/70 max-w-sm">
              Next-generation financial distribution and retail banking advisory. Comparing 40+ premier
              institutional lenders to deliver unmatched interest rates and doorstep service.
            </p>
            <ul className="space-y-1.5 text-sm text-cream/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> Jaipur, Rajasthan, India
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" /> support@aariccafinsales.com
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-gold" /> 1800-AARICCA (Toll Free)
              </li>
            </ul>
          </div>

          <FooterCol
            title="Navigation"
            links={[
              ["Home", "/"],
              ["Check Credit Score", "/credit-score/check"],
              ["Financial Calculators", "/calculators"],
              ["Loan Process", "/loan-process"],
              ["Why Aaricca", "/why-aaricca"],
            ]}
          />
          <FooterCol
            title="Loan Products"
            links={LOAN_TYPES.map((l) => [l.title, `/loans/${l.id}`])}
          />
          <FooterCol
            title="Compliance"
            links={[
              ["FAQs & Help", "/faqs"],
              ["RBI Fair Practice Code", "/faqs"],
              ["Privacy Policy", "/faqs"],
              ["Terms & Conditions", "/faqs"],
            ]}
          />
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/55">
          <p>© 2026 Aaricca Finsales. All rights reserved. Regulated multi-bank distribution entity.</p>
          <p>Loan sanctions and interest rates are subject to the underwriting guidelines of partner banks and NBFCs.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h5 className="font-display font-semibold text-gold text-xs uppercase tracking-wide mb-3.5">{title}</h5>
      <ul className="space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-cream/70 hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-body">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
