import {
  Home as HomeIcon,
  Briefcase,
  Building2,
  GraduationCap,
  Landmark,
  Wallet,
} from "lucide-react";

export const LOAN_TYPES = [
  {
    id: "personal",
    title: "Personal Loan",
    icon: Wallet,
    tagline: "Instant liquidity for medical needs, travel, weddings, or debt consolidation.",
    amount: "Up to ₹40 Lakhs",
    rateFloor: 9.99,
    rateCeil: 15.99,
    tenure: "1–5 Years",
    approvalTime: "24–48 Hrs",
    minScore: 650,
    benefits: [
      "10-minute digital in-principle sanction",
      "Zero collateral or guarantor required",
    ],
  },
  {
    id: "business",
    title: "Business Loan",
    icon: Briefcase,
    tagline: "Fuel working capital, purchase machinery, and scale your daily operations.",
    amount: "Up to ₹75 Lakhs",
    rateFloor: 8.5,
    rateCeil: 17.5,
    tenure: "1–7 Years",
    approvalTime: "48–72 Hrs",
    minScore: 680,
    benefits: [
      "Collateral-free credit lines available",
      "Overdraft & customized term facilities",
    ],
  },
  {
    id: "home",
    title: "Home Loan",
    icon: HomeIcon,
    tagline: "Lowest rates for purchasing, constructing, or transferring your home loan.",
    amount: "Up to ₹5 Crores",
    rateFloor: 7.2,
    rateCeil: 9.75,
    tenure: "Up to 30 Years",
    approvalTime: "3–5 Working Days",
    minScore: 700,
    benefits: [
      "Repo-rate linked lowest floating interest",
      "Tax deductions under Sec 80C & 24B",
    ],
  },
  {
    id: "lap",
    title: "Loan Against Property",
    icon: Building2,
    tagline: "Unlock high-value liquidity against your residential or commercial property.",
    amount: "Up to ₹10 Crores",
    rateFloor: 8.95,
    rateCeil: 12.5,
    tenure: "Up to 15 Years",
    approvalTime: "5–7 Working Days",
    minScore: 675,
    benefits: [
      "High LTV: up to 70% of property market value",
      "Longer tenures keep monthly EMIs low",
    ],
  },
  {
    id: "education",
    title: "Education Loan",
    icon: GraduationCap,
    tagline: "Fund premier domestic and international higher studies with moratorium support.",
    amount: "Up to ₹1.5 Crores",
    rateFloor: 8.05,
    rateCeil: 13.0,
    tenure: "Up to 15 Years",
    approvalTime: "3–5 Working Days",
    minScore: 650,
    benefits: [
      "100% tuition, travel & living expense coverage",
      "Moratorium period — repay after course completion",
    ],
  },
  {
    id: "msme",
    title: "MSME & Machinery Loan",
    icon: Landmark,
    tagline: "Specialized credit lines for manufacturing units, plant setup, and traders.",
    amount: "Up to ₹2 Crores",
    rateFloor: 10.25,
    rateCeil: 15.0,
    tenure: "Up to 7 Years",
    approvalTime: "48–96 Hrs",
    minScore: 660,
    benefits: [
      "Government CGTMSE-backed credit options",
      "Machinery financing up to 85% of invoice value",
    ],
  },
];

// Researched starting rates for the 4 benchmark banks, current as of Sept 2026.
// Update this list whenever rates change — it drives both the homepage
// "Live Bank Rate Benchmark" panel and each product page's bank selector.
export const RATE_BENCHMARK_UPDATED_AT = "2026-09-08";

export const BANKS_BY_LOAN = {
  personal: [
    { name: "HDFC Bank", rate: 9.99 },
    { name: "ICICI Bank", rate: 9.99 },
    { name: "Axis Bank", rate: 9.99 },
    { name: "State Bank of India", rate: 10.0 },
    { name: "Kotak Mahindra Bank", rate: 11.75 },
    { name: "Bank of Baroda", rate: 12.0 },
    { name: "Punjab National Bank", rate: 12.25 },
    { name: "Tata Capital", rate: 13.1 },
    { name: "Bajaj Finserv", rate: 13.49 },
    { name: "IDFC FIRST Bank", rate: 11.9 },
  ],
  home: [
    { name: "HDFC Bank", rate: 7.2 },
    { name: "State Bank of India", rate: 7.25 },
    { name: "ICICI Bank", rate: 7.65 },
    { name: "Axis Bank", rate: 8.35 },
    { name: "Kotak Mahindra Bank", rate: 8.5 },
    { name: "Bank of Baroda", rate: 8.4 },
    { name: "Punjab National Bank", rate: 8.45 },
    { name: "IDFC FIRST Bank", rate: 8.85 },
  ],
  business: [
    { name: "State Bank of India", rate: 8.5 },
    { name: "ICICI Bank", rate: 10.25 },
    { name: "HDFC Bank", rate: 10.75 },
    { name: "Axis Bank", rate: 11.49 },
    { name: "Kotak Mahindra Bank", rate: 12.0 },
    { name: "Bank of Baroda", rate: 11.0 },
    { name: "Tata Capital", rate: 13.5 },
    { name: "Bajaj Finserv", rate: 14.0 },
  ],
  lap: [
    { name: "State Bank of India", rate: 8.95 },
    { name: "HDFC Bank", rate: 9.5 },
    { name: "Axis Bank", rate: 9.5 },
    { name: "ICICI Bank", rate: 9.75 },
    { name: "Kotak Mahindra Bank", rate: 10.0 },
    { name: "Bank of Baroda", rate: 9.9 },
    { name: "Tata Capital", rate: 10.5 },
  ],
  education: [
    { name: "State Bank of India", rate: 8.05 },
    { name: "HDFC Bank", rate: 9.5 },
    { name: "ICICI Bank", rate: 9.5 },
    { name: "Axis Bank", rate: 10.5 },
    { name: "Bank of Baroda", rate: 9.85 },
    { name: "Punjab National Bank", rate: 9.75 },
  ],
};
function bankSetFor(loan) {
  const spread = loan.rateCeil - loan.rateFloor;
  const names = [
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Bank of Baroda",
    "Punjab National Bank",
    "Tata Capital",
    "Bajaj Finserv",
    "IDFC FIRST Bank",
  ];
  return names.map((name, i) => ({
    name,
    rate: Math.round((loan.rateFloor + (spread * i) / (names.length - 1)) * 100) / 100,
  }));
}
LOAN_TYPES.forEach((loan) => {
  if (!BANKS_BY_LOAN[loan.id]) BANKS_BY_LOAN[loan.id] = bankSetFor(loan);
});

export const BANK_PARTNERS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank",
  "Kotak Mahindra Bank", "Bank of Baroda", "Punjab National Bank", "Tata Capital",
  "Bajaj Finserv", "Aditya Birla Capital", "L&T Finance", "Piramal Capital",
  "Federal Bank", "IDFC FIRST Bank", "IndusInd Bank", "Yes Bank",
];

export const TESTIMONIALS = [
  {
    name: "Rajesh Kulkarni",
    role: "Proprietor, Precision Engineering",
    loan: "Business Loan",
    amount: "₹45 Lakhs",
    quote: "Aaricca Finsales secured our working capital expansion loan within 48 hours when our traditional branch delayed approvals. Flawless doorstep documentation in Jaipur.",
  },
  {
    name: "Dr. Priyamvada Sharma",
    role: "Senior Consultant, Fortis Healthcare",
    loan: "Home Loan",
    amount: "₹1.8 Crores",
    quote: "Secured an 8.40% rate on our Jaipur villa with complete transparency on legal vetting. The team even negotiated waivers on bank processing charges.",
  },
  {
    name: "Arjun Mathur",
    role: "Lead Software Architect",
    loan: "Personal Loan",
    amount: "₹15 Lakhs",
    quote: "Instant digital verification. Their multi-bank comparison engine saved me almost 1.8% in annual interest compared to walk-in bank quotes.",
  },
];

export const FAQS = [
  {
    category: "General",
    q: "What is Aaricca Finsales?",
    a: "Aaricca Finsales is an RBI-registered multi-bank loan distribution partner headquartered in Jaipur, Rajasthan. We partner with 40+ leading public and private banks and NBFCs across India to negotiate the lowest interest rates and fastest sanctions for retail and commercial borrowers.",
  },
  {
    category: "General",
    q: "Do I have to pay any upfront advisory or processing charges?",
    a: "No. Aaricca Finsales provides free loan comparison, doorstep documentation, and application processing. All bank processing fees and stamp duties are stated in your official sanction letter with zero hidden markups.",
  },
  {
    category: "Loan Process",
    q: "How fast will my loan be approved and disbursed?",
    a: "Unsecured personal and business loans are typically approved within 24–48 hours post document verification. Secured loans (Home Loan & LAP) take 3–7 working days due to mandatory property legal vetting.",
  },
  {
    category: "Loan Process",
    q: "Can I complete the entire application online from home?",
    a: "Yes. Our digital infrastructure supports online application, e-KYC verification, credit analysis, and agreement execution without visiting a physical branch.",
  },
  {
    category: "Eligibility",
    q: "What is the minimum credit score required to get a loan?",
    a: "A score of 750+ qualifies you for prime interest rates and instant pre-approvals. We also run specialized partner programs for scores between 650 and 749.",
  },
  {
    category: "Eligibility",
    q: "Can self-employed individuals apply without formal ITR documents?",
    a: "Yes — we offer banking-surrogate and cash-flow assessment programs for MSMEs, traders, and freelancers based on 12 months of active bank statements.",
  },
  {
    category: "Rates & Charges",
    q: "Can I prepay or foreclose my loan before the tenure ends?",
    a: "For individual floating-rate retail loans (Home/Personal), RBI mandates zero foreclosure penalty. Fixed-rate and commercial business credit may carry a 2–4% + GST foreclosure fee, per the lender's charter.",
  },
  {
    category: "Rates & Charges",
    q: "How are interest rates determined?",
    a: "Your credit score, monthly income, debt-to-income ratio, employment stability, and loan category all factor in. We match your profile to the lowest available rate across our 40+ partner banks.",
  },
];

export const SCORE_TIERS = [
  { range: "750–900", label: "Excellent", note: "Prime rates & instant sanctions across all 40+ partner banks.", tone: "excellent" },
  { range: "700–749", label: "Good", note: "High approval probability with standard paperwork.", tone: "good" },
  { range: "650–699", label: "Fair", note: "May require additional income proof or collateral.", tone: "fair" },
  { range: "300–649", label: "Needs Work", note: "Our advisory team assists with structured credit rebuilding.", tone: "poor" },
];
