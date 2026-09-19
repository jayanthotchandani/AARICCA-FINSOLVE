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
    amount: "Up to ₹50 Lakhs",
    rateFloor: 8.75,
    rateCeil: 15.99,
    tenure: "1–5 Years",
    approvalTime: "24–48 Hrs",
    minScore: 650,
    benefits: [
      "10-minute digital in-principle sanction",
      "Zero collateral or guarantor required",
    ],
    eligibility: [
      { label: "Age", value: "21–60 years (salaried) · up to 65 years (self-employed)" },
      { label: "Nationality", value: "Resident Indian citizen" },
      { label: "Minimum Income", value: "₹25,000/month (salaried) · ₹3 Lakhs annual profit (self-employed)" },
      { label: "Work Experience", value: "1+ year in current job · 2+ years in business" },
      { label: "Credit Score", value: "650 and above" },
    ],
    documents: {
      common: ["PAN Card", "Aadhaar Card", "Recent passport-size photograph"],
      salaried: ["Last 3 months' salary slips", "Last 6 months' bank statement", "Latest Form 16 or ITR"],
      selfEmployed: [
        "Last 2 years' ITR with computation",
        "Last 6 months' bank statement (business + personal)",
        "Business proof (GST / Udyam / Shop Act registration)",
      ],
    },
  },
  {
    id: "business",
    title: "Business Loan",
    icon: Briefcase,
    tagline: "Fuel working capital, purchase machinery, and scale your daily operations.",
    amount: "Up to ₹50 Lakhs",
    rateFloor: 8.15,
    rateCeil: 17.5,
    tenure: "1–7 Years",
    approvalTime: "48–72 Hrs",
    minScore: 680,
    benefits: [
      "Collateral-free credit lines available",
      "Overdraft & customized term facilities",
    ],
    eligibility: [
      { label: "Age", value: "25–65 years (at loan maturity)" },
      { label: "Nationality", value: "Resident Indian citizen" },
      { label: "Minimum Turnover", value: "₹40 Lakhs annual (₹15 Lakhs for professionals)" },
      { label: "Business Vintage", value: "3+ years in current business · 5 years total experience" },
      { label: "Credit Score", value: "680 and above" },
    ],
    documents: {
      common: ["PAN Card", "Aadhaar Card / Passport / Voter ID", "Recent passport-size photograph"],
      business: [
        "GST registration certificate",
        "Udyam / Shop Act / business registration",
        "Proof of business address (utility bill, rent agreement)",
      ],
      financial: [
        "Last 2 years' ITR with computation of income",
        "Balance Sheet & P&L for last 2 years",
        "Last 6 months' bank statement (current account)",
      ],
    },
  },
  {
    id: "home",
    title: "Home Loan",
    icon: HomeIcon,
    tagline: "Lowest rates for purchasing, constructing, or transferring your home loan.",
    amount: "Up to ₹5 Crores",
    rateFloor: 7.0,
    rateCeil: 9.75,
    tenure: "Up to 30 Years",
    approvalTime: "3–5 Working Days",
    minScore: 700,
    benefits: [
      "Repo-rate linked lowest floating interest",
      "Tax deductions under Sec 80C & 24B",
    ],
    eligibility: [
      { label: "Age", value: "21–65 years (salaried) · up to 70 years (self-employed)" },
      { label: "Nationality", value: "Resident Indian citizen / NRI" },
      { label: "Minimum Income", value: "₹25,000/month (salaried) · ₹3 Lakhs annual profit (self-employed)" },
      { label: "Work Experience", value: "2+ years in current job · 3+ years in business" },
      { label: "Credit Score", value: "700 and above" },
    ],
    documents: {
      common: ["PAN Card, Aadhaar Card", "Recent passport-size photographs", "Address proof"],
      salaried: ["Last 3 months' salary slips", "Form 16 / last 2 years' ITR", "Last 6 months' bank statement"],
      selfEmployed: [
        "Last 3 years' ITR with computation",
        "Balance Sheet & P&L for last 2 years",
        "Last 6 months' bank statement (business + personal)",
      ],
      property: [
        "Sale agreement / allotment letter",
        "Approved building plan",
        "NOC from builder/society & title documents",
      ],
    },
  },
  {
    id: "lap",
    title: "Loan Against Property",
    icon: Building2,
    tagline: "Unlock high-value liquidity against your residential or commercial property.",
    amount: "Up to ₹10 Crores",
    rateFloor: 8.25,
    rateCeil: 12.5,
    tenure: "Up to 15 Years",
    approvalTime: "5–7 Working Days",
    minScore: 675,
    benefits: [
      "High LTV: up to 70% of property market value",
      "Longer tenures keep monthly EMIs low",
    ],
    eligibility: [
      { label: "Age", value: "21–65 years (salaried) · 25–70 years (self-employed)" },
      { label: "Nationality", value: "Resident Indian citizen" },
      { label: "Minimum Income", value: "₹30,000/month (salaried) · ₹4 Lakhs annual profit (self-employed)" },
      { label: "Work Experience", value: "2+ years in current job · 3+ years in business" },
      { label: "Credit Score", value: "675 and above" },
    ],
    documents: {
      common: ["PAN Card, Aadhaar Card", "Recent passport-size photographs"],
      income: [
        "Salary slips / Form 16 (salaried) or ITR + P&L (self-employed)",
        "Last 6 months' bank statements",
      ],
      property: [
        "Sale deed / title deed",
        "Encumbrance certificate (13–30 years)",
        "Property tax receipts",
        "Approved floor plan & occupancy certificate",
      ],
    },
  },
  {
    id: "education",
    title: "Education Loan",
    icon: GraduationCap,
    tagline: "Fund premier domestic and international higher studies with moratorium support.",
    amount: "Up to ₹1.5 Crores",
    rateFloor: 6.85,
    rateCeil: 13.0,
    tenure: "Up to 15 Years",
    approvalTime: "3–5 Working Days",
    minScore: 650,
    benefits: [
      "100% tuition, travel & living expense coverage",
      "Moratorium period — repay after course completion",
    ],
    eligibility: [
      { label: "Age", value: "16–35 years (student applicant)" },
      { label: "Nationality", value: "Resident Indian citizen" },
      { label: "Admission Status", value: "Confirmed admission in recognized institute/course" },
      { label: "Co-Applicant", value: "Mandatory — parent, guardian, or spouse" },
      { label: "Credit Score", value: "650 and above (co-applicant)" },
    ],
    documents: {
      common: ["PAN & Aadhaar of student and co-applicant", "Passport-size photographs (both)"],
      academic: [
        "Admission letter / offer letter",
        "Mark sheets — 10th, 12th, graduation (if applicable)",
        "Entrance exam scorecard (if any)",
      ],
      coApplicantIncome: ["Last 3 months' salary slips or 2 years' ITR", "Last 6 months' bank statement"],
      collateral: [
        "Property/FD documents pledged as security (loans above ₹45 Lakhs)",
        "Valuation report of collateral",
      ],
    },
  },
  {
    id: "msme",
    title: "MSME & Machinery Loan",
    icon: Landmark,
    tagline: "Specialized credit lines for manufacturing units, plant setup, and traders.",
    amount: "Up to ₹2 Crores",
    rateFloor: 7.9,
    rateCeil: 15.0,
    tenure: "Up to 7 Years",
    approvalTime: "48–96 Hrs",
    minScore: 660,
    benefits: [
      "Government CGTMSE-backed credit options",
      "Machinery financing up to 85% of invoice value",
    ],
    eligibility: [
      { label: "Age", value: "21–65 years (at loan maturity)" },
      { label: "Nationality", value: "Resident Indian citizen" },
      { label: "Minimum Turnover", value: "₹10 Lakhs annual (Udyam Micro category)" },
      { label: "Business Vintage", value: "3+ years in current business" },
      { label: "Credit Score", value: "660 and above" },
    ],
    documents: {
      common: ["PAN & Aadhaar of proprietor/directors", "Recent passport-size photographs"],
      registration: ["Udyam Registration Certificate", "GST registration certificate", "Shop Act / trade license"],
      financial: [
        "Last 2 years' ITR with P&L and balance sheet",
        "Last 6–12 months' bank statements",
        "GST returns (last 12 months)",
      ],
      machinery: ["Performa invoice / quotation from machinery vendor", "Machinery specification sheet"],
    },
  },
];

// Researched starting rates, current as of Sept 2026 — sourced from public
// bank rate pages and aggregators (BankBazaar, Wishfin, CreditMantri, etc.),
// favoring whichever 10 lenders (5+ for Education, where fewer mainstream
// retail lenders publish a rate) currently publish the lowest starting rate
// per category, PSU and private alike. Update this list whenever rates
// change — it drives both the homepage "Live Bank Rate Benchmark" panel and
// each product page's bank selector.
export const RATE_BENCHMARK_UPDATED_AT = "2026-09-19";

export const BANKS_BY_LOAN = {
  personal: [
    { name: "Axis Bank", rate: 8.75 },
    { name: "Bank of Maharashtra", rate: 8.75 },
    { name: "HDFC Bank", rate: 9.99 },
    { name: "ICICI Bank", rate: 9.99 },
    { name: "IDFC FIRST Bank", rate: 9.99 },
    { name: "State Bank of India", rate: 10.0 },
    { name: "Bank of Baroda", rate: 10.15 },
    { name: "Punjab National Bank", rate: 10.25 },
    { name: "Bank of India", rate: 10.85 },
    { name: "Yes Bank", rate: 10.85 },
  ],
  home: [
    { name: "Bank of Maharashtra", rate: 7.0 },
    { name: "Central Bank of India", rate: 7.0 },
    { name: "Bank of India", rate: 7.1 },
    { name: "Canara Bank", rate: 7.15 },
    { name: "Bank of Baroda", rate: 7.2 },
    { name: "State Bank of India", rate: 7.25 },
    { name: "Punjab National Bank", rate: 7.4 },
    { name: "UCO Bank", rate: 7.5 },
    { name: "ICICI Bank", rate: 7.55 },
    { name: "Kotak Mahindra Bank", rate: 7.6 },
  ],
  business: [
    { name: "Bank of Baroda", rate: 8.15 },
    { name: "Indian Bank", rate: 8.15 },
    { name: "Punjab National Bank", rate: 8.25 },
    { name: "State Bank of India", rate: 9.1 },
    { name: "Canara Bank", rate: 9.25 },
    { name: "Bank of India", rate: 9.35 },
    { name: "Union Bank of India", rate: 9.4 },
    { name: "Kotak Mahindra Bank", rate: 9.5 },
    { name: "Shriram Finance", rate: 10.0 },
    { name: "South Indian Bank", rate: 10.65 },
  ],
  lap: [
    { name: "Canara Bank", rate: 8.25 },
    { name: "State Bank of India", rate: 8.95 },
    { name: "HDFC Bank", rate: 9.0 },
    { name: "IDFC FIRST Bank", rate: 9.0 },
    { name: "Punjab National Bank", rate: 9.05 },
    { name: "Axis Bank", rate: 9.25 },
    { name: "Kotak Mahindra Bank", rate: 9.25 },
    { name: "Bank of Baroda", rate: 9.35 },
    { name: "Tata Capital", rate: 10.1 },
    { name: "ICICI Bank", rate: 10.6 },
  ],
  education: [
    { name: "Bank of Maharashtra", rate: 6.85 },
    { name: "UCO Bank", rate: 6.9 },
    { name: "IDBI Bank", rate: 6.95 },
    { name: "Bank of India", rate: 7.0 },
    { name: "Canara Bank", rate: 7.25 },
    { name: "Punjab National Bank", rate: 7.5 },
    { name: "Axis Bank", rate: 8.0 },
    { name: "Bank of Baroda", rate: 8.15 },
    { name: "ICICI Bank", rate: 8.5 },
    { name: "State Bank of India", rate: 9.4 },
  ],
  msme: [
    { name: "Bank of Baroda", rate: 7.9 },
    { name: "State Bank of India", rate: 8.0 },
    { name: "Punjab National Bank", rate: 8.25 },
    { name: "Canara Bank", rate: 8.45 },
    { name: "Bank of India", rate: 8.6 },
    { name: "Union Bank of India", rate: 8.75 },
    { name: "Indian Bank", rate: 8.9 },
    { name: "Kotak Mahindra Bank", rate: 9.5 },
    { name: "HDFC Bank", rate: 10.25 },
    { name: "ICICI Bank", rate: 10.78 },
  ],
};

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
    quote: "Aaricca Finsales secured our working capital expansion loan within 48 hours when our traditional branch delayed approvals. Flawless doorstep documentation in Gurugram.",
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
    a: "Aaricca Finsales is a multi-bank loan distribution partner headquartered at our Delhi-NCR (Gurugram, Haryana) head office. Loans sanctioned by RBI-regulated banks & NBFCs — we partner with 140+ leading banks and NBFCs across India to negotiate the lowest interest rates and fastest sanctions for retail and commercial borrowers.",
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
    a: "Your credit score, monthly income, debt-to-income ratio, employment stability, and loan category all factor in. We match your profile to the lowest available rate across our network of 140+ partner banks and NBFCs.",
  },
];

// Broad time-of-day bands offered on every lead form's "when should our
// advisor call you?" field — deliberately coarse (not an exact time picker)
// since the promise is a call sometime within 24 hours around this window,
// not an appointment slot.
// startHour/endHour (24-hr, local time) let the "Today" option gray out
// bands that have already gone by — e.g. it's pointless to offer a
// "Morning" callback for today once it's already 2 PM.
export const CALL_TIME_BANDS = [
  { key: "morning", label: "Morning", hint: "9 AM – 12 PM", startHour: 9, endHour: 12 },
  { key: "afternoon", label: "Afternoon", hint: "12 – 4 PM", startHour: 12, endHour: 16 },
  { key: "evening", label: "Evening", hint: "4 – 7 PM", startHour: 16, endHour: 19 },
];

// Single-office reassurance copy shown on every lead form: a short version
// near the submit button (sets expectations before they commit) and a
// fuller version on the post-submission confirmation screen.
export const OFFICE_NOTE_SHORT =
  "We work from a single Delhi-NCR head office — no branches, so there's no runaround.";
export const OFFICE_NOTE_FULL =
  "We operate from one dedicated Delhi-NCR head office, not a branch network — so your application gets full attention from a single expert team, start to finish.";
export const WORKING_HOURS_NOTE = "Advisor working hours: 9 AM – 7 PM, every day.";

export const SCORE_TIERS = [
  { range: "750–900", label: "Excellent", note: "Prime rates & instant sanctions across all 140+ partner banks.", tone: "excellent" },
  { range: "700–749", label: "Good", note: "High approval probability with standard paperwork.", tone: "good" },
  { range: "650–699", label: "Fair", note: "May require additional income proof or collateral.", tone: "fair" },
  { range: "300–649", label: "Needs Work", note: "Our advisory team assists with structured credit rebuilding.", tone: "poor" },
];
