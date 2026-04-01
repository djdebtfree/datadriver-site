/*
 * Data Driver — Single Page App
 * Design: Light theme, DM Sans headings, Inter body
 * Colors: White bg, dark sections (#0f172a), teal accent (#0d9488), yellow-green gradient CTAs
 * Layout: Single page with section nav
 * Avatar: Sandy Beach (powered by June avatar from HeyGen internally)
 * Products: Data Driver ($0.25/contact), Warm Recruiting ($1.00/contact, $0.80 with Pro)
 * Pro: $497/mo (down from $997/mo). 30-day free trial with $500+ data purchase.
 */
import { useState, useEffect, useRef } from "react";
import DDVerifyForm from "@/components/DDVerifyForm";
import DataDriverLogo from "@/components/DataDriverLogo";
import SandyLiveAvatar from "@/components/SandyLiveAvatar";
import GHLAgencyForm from "@/components/GHLAgencyForm";
import { ArrowRight, Check, ChevronDown, ChevronUp, Star, Phone, Mail, Shield, Zap, Globe, Users, BarChart3, Clock, MessageSquare, Video, Headphones, Calendar, Target, Search, FileCheck, Smartphone, X, DollarSign, TrendingUp, Database, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DD_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/datadriver-logo-transparent_2fb150a7.png";
const JUNE_OFFICE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/june-office-front_8b0bb0bb.webp";
const JUNE_UPPER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/june-upper-body_fbbaace4.webp";
const HERO_VIZ = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/hero-data-visualization_f38e0623.png";
const AI_DASH = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/ai-prospecting-dashboard_aacbbc13.png";
const RECRUITING = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/recruiting-pipeline_8509dddc.png";
const SANDY_VIDEO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/SandyGreeting-DataDriverHomepage_1080p_ec4dcb9b.mp4";

// Suppress unused variable warnings for CDN assets used in template
void JUNE_OFFICE;
void HERO_VIZ;
void AI_DASH;
void RECRUITING;

function SandyVideoWithLiveAvatar({ onSpeakToSandy }: { onSpeakToSandy: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          videoRef.current?.play().catch(() => {});
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-lg bg-white">
      <video
        ref={videoRef}
        src={SANDY_VIDEO}
        muted
        playsInline
        className="w-full aspect-video object-cover"
      />
      <div className="p-3 space-y-3">
        <button
          onClick={onSpeakToSandy}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-base bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all"
        >
          <Video className="w-5 h-5" /> Speak to Sandy Live Now
          <span className="ml-2 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">AI-Powered</span>
        </button>
        <button
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="btn-cta w-full justify-center text-base"
        >
          HIRE SANDY NOW <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const TICKER_ITEMS = [
  "VERIFIED INTENT-BASED DATA",
  "15/10 VERIFICATION STANDARD",
  "SKIP TRACING INCLUDED",
  "MOBILE NUMBERS VERIFIED",
  "50.6M CONTACTS INDEXED",
  "DIRECT CRM DELIVERY",
  "41 AUDIENCE SEGMENTS",
  "WHITE-LABEL READY",
];

const NAV_ITEMS = [
  { label: "Overview", id: "overview" },
  { label: "The Data", id: "thedata" },
  { label: "DD Pro", id: "ddpro" },
  { label: "Pricing", id: "pricing" },
  { label: "For GHL Agencies", id: "ghlagencies" },
];

const NICHES = [
  "Insurance",
  "Real Estate",
  "Home Improvement",
  "Auto Buying",
  "Loans",
  "Med Spas",
  "Legal",
  "Home Services",
  "Beauty Services",
  "SaaS & Tech",
  "GHL Agencies",
  "Remote Sales",
  "Financial Advisory",
  "Recruiting",
  "Custom / Tell Us What You Need",
];

const TESTIMONIALS = [
  { quote: "I was spending $2,000/month on leads that were 60% disconnected numbers. Data Driver's 15/10 verification changed everything. First order of 500 contacts — 487 were reachable. That's never happened before.", name: "Marcus T.", role: "P&C Agency Owner — Dallas, TX", stat: "97%", statLabel: "REACHABLE" },
  { quote: "We switched from LeadStar to Data Driver and our contact rate went from 22% to 71% overnight. Same dialers, same scripts — just better data.", name: "Jennifer L.", role: "Life Insurance Agency — Phoenix, AZ", stat: "71%", statLabel: "CONTACT RATE" },
  { quote: "Sandy called my leads the moment they were delivered. Three of them turned into appointments that same day. I've never seen AI work this fast.", name: "David R.", role: "Medicare Specialist — Tampa, FL", stat: "3", statLabel: "SAME-DAY APPTS" },
  { quote: "I white-label Data Driver for 12 sub-accounts. I buy at $0.25, sell at $0.50. Pro's $0.20 rate makes my margin even better. $8K/month recurring.", name: "Chris M.", role: "GHL Agency Owner — Atlanta, GA", stat: "$8K", statLabel: "MONTHLY RECURRING" },
  { quote: "We went from 5 hires per month to 20 using Warm Recruiting. The candidates are already pre-screened and license-verified. Game changer for our IMO.", name: "Amanda K.", role: "National IMO Recruiter — Chicago, IL", stat: "4x", statLabel: "HIRING VOLUME" },
  { quote: "Other vendors gave me 'fresh' data that was 6 months old. Data Driver's intent signals are real-time. I can tell because people actually pick up the phone.", name: "Robert S.", role: "Financial Advisor — Denver, CO", stat: "3.2x", statLabel: "PICKUP RATE" },
  { quote: "I was skeptical about the $0.25 price point — figured it was junk data. Ordered 200 contacts as a test. 189 had working mobile numbers. I'm a believer now.", name: "Sarah W.", role: "Health Insurance Agent — Nashville, TN", stat: "94%", statLabel: "VERIFIED MOBILES" },
  { quote: "The GHL integration is seamless. Contacts land in my pipeline with tags already applied. I just open my CRM and start calling. No CSV uploads, no cleanup.", name: "Mike P.", role: "Auto Insurance Agency — Houston, TX", stat: "Instant", statLabel: "CRM DELIVERY" },
  { quote: "Pro pays for itself in the first week. The 2,000 included contacts alone are worth $500. Add Sandy's AI follow-up and it's not even close.", name: "Lisa H.", role: "Annuity Specialist — Scottsdale, AZ", stat: "10x", statLabel: "ROI IN 30 DAYS" },
  { quote: "I've tried every data vendor in the insurance space. Data Driver is the only one where I don't have to scrub the list before loading it. It's clean out of the box.", name: "Tom B.", role: "Commercial Insurance — Charlotte, NC", stat: "Zero", statLabel: "SCRUBBING NEEDED" },
  { quote: "My team books 15+ appointments per week now, up from 4. The intent data means we're calling people who are actually shopping, not cold prospects.", name: "Karen D.", role: "Mortgage Loan Officer — Orlando, FL", stat: "15+", statLabel: "WEEKLY APPTS" },
  { quote: "Warm Recruiting found us licensed agents who had already applied for remote sales jobs. We didn't have to convince them — they were ready to start.", name: "James F.", role: "Final Expense Agency — Birmingham, AL", stat: "20", statLabel: "AGENTS ONBOARDED" },
  { quote: "I run a real estate team and we use Data Driver to find homeowners with intent signals. The net worth and income data helps us target the right price points.", name: "Nicole V.", role: "Real Estate Team Lead — San Diego, CA", stat: "$2.1M", statLabel: "AVG LISTING PRICE" },
];

const CASE_STUDIES = [
  { tag: "INSURANCE AGENCY", title: "500 verified contacts pushed to GHL weekly", desc: "A mid-size P&C agency uses Data Driver to pull verified intent-based contacts. Contacts are pushed directly into their GoHighLevel pipeline with tags. Result: 3x more appointments booked.", stat: "3x", statLabel: "MORE APPOINTMENTS" },
  { tag: "RECRUITING OPERATION", title: "20 agents onboarded per month", desc: "A national IMO uses Data Driver to source candidates from verified prospect data, screen them automatically against license databases, and hand warm candidates to their team. They went from 5 hires/month to 20.", stat: "4x", statLabel: "HIRING VOLUME" },
  { tag: "WHITE-LABEL RESELLER", title: "$8K/month recurring from reselling data", desc: "A GHL agency owner white-labels Data Driver under their own brand and resells verified contacts to 12 sub-accounts. They buy at $0.25/contact, sell at $0.50, and use Pro's $0.20 rate to maximize margin.", stat: "$8K", statLabel: "MONTHLY RECURRING" },
  { tag: "MEDICARE AGENCY", title: "AEP pipeline filled 6 weeks early", desc: "A Medicare-focused agency used Data Driver's intent signals to identify seniors actively researching Medicare Advantage plans. They filled their AEP pipeline 6 weeks before open enrollment.", stat: "6wks", statLabel: "AHEAD OF SCHEDULE" },
  { tag: "FINANCIAL ADVISORY", title: "$4.2M in new AUM from intent data", desc: "A financial advisor used net worth and income filters to target high-net-worth individuals showing retirement planning intent. Within 90 days, they onboarded 8 new clients.", stat: "$4.2M", statLabel: "NEW AUM" },
  { tag: "MORTGAGE TEAM", title: "22 closings in first 60 days", desc: "A mortgage loan officer team used homeowner intent data to find people actively searching for refinance options. Direct mobile numbers meant they reached decision-makers on the first call.", stat: "22", statLabel: "CLOSINGS IN 60 DAYS" },
];

function FeaturedTestimonial() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const t = TESTIMONIALS[index];
  return (
    <div className={`bg-white rounded-2xl p-8 border border-[#e2e8f0] transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#eab308] text-[#eab308]" />)}</div>
      <blockquote className="text-lg italic text-[#334155] mb-6" style={{ fontFamily: "var(--font-display)" }}>
        "{t.quote}"
      </blockquote>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{t.name}</p>
          <p className="text-sm text-[#64748b]">{t.role}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#0d9488]">{t.stat}</span>
          <p className="text-xs text-[#64748b] uppercase tracking-wider">{t.statLabel}</p>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => { setFade(false); setTimeout(() => { setIndex(i); setFade(true); }, 300); }} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-[#0d9488] w-6' : 'bg-[#cbd5e1]'}`} />
        ))}
      </div>
    </div>
  );
}

function CaseStudyCarousel() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % CASE_STUDIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const getVisible = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(CASE_STUDIES[(offset + i) % CASE_STUDIES.length]);
    }
    return items;
  };
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {getVisible().map((cs, i) => (
        <div key={`${offset}-${i}`} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] animate-in fade-in duration-500">
          <span className="text-xs font-bold tracking-wider text-[#0d9488]">{cs.tag}</span>
          <h3 className="font-bold mt-2 mb-3" style={{ fontFamily: "var(--font-display)" }}>{cs.title}</h3>
          <p className="text-sm text-[#64748b] leading-relaxed mb-4">{cs.desc}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0d9488]">{cs.stat}</span>
            <span className="text-xs text-[#64748b] uppercase tracking-wider">{cs.statLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupShown = useRef(false);
  const [showSandyLive, setShowSandyLive] = useState(false);
  const [sandyUserInfo, setSandyUserInfo] = useState<{ firstName: string; lastName: string; email: string; phone: string } | undefined>(undefined);
  const [showSandyForm, setShowSandyForm] = useState(false);
  const [showGHLForm, setShowGHLForm] = useState(false);
  const [calcSubaccounts, setCalcSubaccounts] = useState(10);
  const [calcMarkup, setCalcMarkup] = useState(0.25);
  const [calcLeads, setCalcLeads] = useState(500);

  // Show popup form 10 seconds after page load
  useEffect(() => {
    if (popupShown.current) return;
    const timer = setTimeout(() => {
      if (!popupShown.current) {
        setShowPopup(true);
        popupShown.current = true;
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = async (_product: "sales_prospects" | "remote_sales_recruits" | "dd_pro") => {
    setCheckoutLoading(_product);
    try {
      toast.info("Checkout coming soon — contact us at (732) 207-0788");
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveNav(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };



  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => scrollTo("overview")} className="flex items-center gap-2 text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            <img src={DD_LOGO} alt="DataDriver" className="h-10 w-auto object-contain" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className={`px-4 py-2 text-sm rounded-full transition-all ${activeNav === item.id ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowPopup(false); setShowSandyForm(true); }} className="text-sm font-semibold py-2 px-5 rounded-full bg-black text-white hover:bg-gray-900 transition-all border border-white/20">
              Speak To Sandy Live
            </button>
            <button onClick={() => scrollTo("order")} className="btn-cta text-sm !py-2 !px-5">
              Get Leads
            </button>
          </div>
        </div>
      </nav>

      {/* ===== TICKER ===== */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0f172a] border-b border-white/5 overflow-hidden h-8">
        <div className="ticker-animate flex items-center h-full whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-6 text-xs font-medium tracking-wider text-[#0d9488]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section id="overview" className="pt-32 pb-16 bg-[#0f172a] text-white">
        <div className="container text-center">
          <div className="flex justify-center mb-6">
            <div className="hero-logo-animate relative">
              <img src={DD_LOGO} alt="DataDriver" className="h-24 sm:h-40 md:h-52 lg:h-64 w-auto object-contain relative z-10" />
              <div className="absolute inset-0 blur-2xl opacity-40 z-0">
                <img src={DD_LOGO} alt="" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
          <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold mb-4 uppercase">AI Keyword Intent-Based Prospecting</p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6" style={{ fontFamily: "var(--font-display)" }}>
            They're Already Searching.<br />
            <span className="bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent">Reach Them First.</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
            See who's searching the moment they start. Sales or recruiting—we've got both. Call them. Email them. Or let us do it for you.
          </p>
          <div className="flex justify-center mb-8">
            <button onClick={() => scrollTo("pricing")} className="btn-cta text-base">
              GET LEADS - 25 Cents Each <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-center mb-8">
            <button onClick={() => setShowGHLForm(true)} className="text-base font-semibold py-3 px-8 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 inline-flex items-center gap-2">
              White-Label Data Driver in My GHL Agency <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0d9488]" />No contracts</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0d9488]" />Pay per contact</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#eab308]" />Instant CRM delivery</span>
          </div>
        </div>
        {/* Price callout */}
        <div className="container mt-12 max-w-3xl">
          <div className="bg-[#1e293b] rounded-2xl p-4 sm:p-8 border border-white/10 text-center">
            <p className="text-sm text-[#0d9488] font-semibold tracking-wider uppercase mb-3">What You Get For $0.25</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Full Name", icon: "👤" },
                { label: "Verified Email", icon: "📧" },
                { label: "Mobile Phone", icon: "📱" },
                { label: "Net Worth", icon: "💰" },
                { label: "Age & Gender", icon: "📊" },
                { label: "Income Range", icon: "📈" },
                { label: "Credit Rating", icon: "⭐" },
                { label: "Homeowner Status", icon: "🏠" },
                { label: "LinkedIn Profile", icon: "🔗" },
                { label: "DNC Scrubbed", icon: "🛡️" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <span className="text-xs text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NICHE SELECTOR — Tell Us What You Need ===== */}
      <section id="thedata" className="py-16 bg-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            What Kind of Clients Do You Work With?
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] mb-8">Pick your niche. If we have it, you'll get it fast. If we don't have it yet — tell us and we'll build it.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {NICHES.map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  selectedNiche === niche
                    ? "border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488] font-semibold"
                    : "border-[#e2e8f0] bg-[#f8fafc] text-[#334155] hover:border-[#0d9488]/50"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo("pricing")} className="mt-8 btn-cta text-base">
            Get Your Niche Leads Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ===== GET VERIFIED DATA IN THREE STEPS ===== */}
      <section className="py-20 bg-[#0f172a] text-white">
        <div className="container text-center">
          <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold mb-4 uppercase">Simple as 1-2-3</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Get Verified Data in <span className="bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent italic">Three Steps</span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto mb-12">No demo calls. No qualification forms. No monthly minimums. Just pick, pay, and prospect.</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Search className="w-6 h-6 text-[#0d9488]" />, num: "01", title: "Pick Your Audience", desc: "Choose from our pre-built audience segments — insurance agents, financial advisors, Medicare specialists, P&C producers, and more. Filter by state, license type, or niche." },
              { icon: <Shield className="w-6 h-6 text-[#0d9488]" />, num: "02", title: "We Verify & Deliver", desc: "Every contact is validated across 15 independent sources. At least 10 must match. The moment you pay, contacts are pushed directly into your GHL or HubSpot pipeline." },
              { icon: <Calendar className="w-6 h-6 text-[#0d9488]" />, num: "03", title: "You Connect & Close", desc: "Your CRM is loaded with verified, intent-based contacts who are actually reachable. Start calling, texting, or emailing immediately. No guesswork. No garbage data." },
            ].map((step, i) => (
              <div key={i} className="relative bg-[#1e293b] rounded-2xl p-5 sm:p-8 border border-white/10 text-left hover:border-[#0d9488]/40 hover:shadow-lg hover:shadow-teal-500/5 transition-all">
                <span className="absolute top-4 right-6 text-6xl font-bold text-white/5" style={{ fontFamily: "var(--font-display)" }}>{step.num}</span>
                <div className="w-12 h-12 rounded-xl bg-[#0d9488]/15 flex items-center justify-center mb-5">{step.icon}</div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => scrollTo("pricing")} className="mt-10 btn-cta text-base">
            Get Leads Delivered To Your CRM <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ===== DATA VALUE CALLOUT ===== */}
      <section id="compare" className="py-16 bg-[#f8fafc]">
        <div className="container max-w-4xl">
          {/* Main headline with gradient */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              <span className="bg-gradient-to-r from-[#eab308] via-[#0d9488] to-[#0d9488] bg-clip-text text-transparent">ONE Sale</span>{" "}
              from 400 Leads…{" "}
              <span className="bg-gradient-to-r from-[#0d9488] to-[#eab308] bg-clip-text text-transparent">Worth It or Not?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold mb-3 uppercase">The Math</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                400 Phone Numbers. <span className="text-[#0d9488]">$100</span>
              </h3>
              <p className="text-sm sm:text-base text-[#64748b] leading-relaxed">
                Most vendors charge $5 per contact and those numbers are mostly disconnected. We charge $0.25. That's not a discount — that's disruption.
              </p>
            </div>
            <div className="bg-[#0f172a] rounded-2xl p-6 text-white text-center">
              <p className="text-xs text-[#0d9488] font-semibold tracking-wider uppercase mb-4">Price Comparison</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-white/60">Typical data vendor</span>
                  <span className="font-bold text-red-400">$1.00–$5.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-white/60">Data Driver</span>
                  <span className="font-bold text-[#0d9488]">$0.25</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <button onClick={() => scrollTo("pricing")} className="btn-cta text-base">
              Get Leads → Find Your One Sale <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== THE 15/10 RULE ===== */}
      <section className="py-20 bg-[#0f172a] text-white">
        <div className="container text-center mb-16">
          <p className="text-xs tracking-[0.25em] text-[#eab308] font-semibold mb-4 uppercase">The 15/10 Rule</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Data Vendors Push Volume.<br />
            <span className="text-[#0d9488]">We Set Standards.</span>
          </h2>

        </div>

        <div className="container grid md:grid-cols-3 gap-8 max-w-5xl">
          <div className="text-center">
            <div className="text-4xl sm:text-6xl font-bold text-[#eab308] mb-3" style={{ fontFamily: "var(--font-display)" }}>15</div>
            <p className="text-sm font-semibold text-white mb-2">Biggest Databases Scanned</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-6xl font-bold text-[#0d9488] mb-3" style={{ fontFamily: "var(--font-display)" }}>10</div>
            <p className="text-sm font-semibold text-white mb-2">Must Agree Simultaneously</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-6xl font-bold text-[#ef4444] mb-3" style={{ fontFamily: "var(--font-display)" }}>0</div>
            <p className="text-sm font-semibold text-white mb-2">Junk Data Delivered Ever</p>
          </div>
        </div>

        {/* What the 15 sources include */}
        <div className="container max-w-3xl mt-16">
          <div className="bg-[#1e293b] rounded-2xl p-5 sm:p-8 border border-white/5">
            <h3 className="font-bold text-lg mb-4 text-center" style={{ fontFamily: "var(--font-display)" }}>What We Verify</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "State DOI Records",
                "LinkedIn Profiles",
                "Email MX Validation",
                "Phone TCPA Compliance",
                "USPS Address Verify",
                "NPN Cross-Reference",
                "License Status Check",
                "CE Credit History",
                "Appointment Records",
                "Lines of Authority",
                "Social Enrichment",
                "Skip Trace — Mobile",
              ].map((src, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-[#0d9488] shrink-0" />{src}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container text-center mt-12">
          <button onClick={() => scrollTo("order")} className="btn-cta">Get Clean Verified Data Now <ArrowRight className="w-4 h-4" /></button>
          <p className="text-white/40 text-sm mt-4">No minimums. No contracts. No junk.</p>
        </div>
      </section>



      {/* ===== DD PRO / SANDY SECTION ===== */}
      <section id="ddpro" className="py-20 bg-[#f8fafc]">
        {/* Sandy anchor for navbar button */}
        <div id="sandy" className="-mt-24 pt-24" />
        <div className="container text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Just Wanna Meet & Sell?<br /><span className="bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent italic">We Can Help.</span>
          </h2>

        </div>
        <div className="container grid lg:grid-cols-2 gap-12 items-start">
          {/* Sandy Video */}
          <div>
            <SandyVideoWithLiveAvatar onSpeakToSandy={() => { setShowPopup(false); setShowSandyForm(true); }} />
          </div>
          {/* Sandy info */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Sandy Beach Live!</h3>
            <p className="text-sm text-[#0d9488] font-semibold tracking-wider uppercase mb-4">Only available with Data Driver Pro</p>
            <p className="text-sm sm:text-base text-[#64748b] leading-relaxed mb-6">
              Sandy is your AI sales assistant. She texts new contacts instantly, qualifies them, handles objections, and books meetings directly on your calendar. She never sleeps. She never misses a follow-up. She works 24/7.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Smartphone className="w-5 h-5 text-[#0d9488]" />, text: "SMS & email follow-up instantly" },
                { icon: <Headphones className="w-5 h-5 text-[#0d9488]" />, text: "AI voice calls with 6 specialized assistants" },
                { icon: <MessageSquare className="w-5 h-5 text-[#0d9488]" />, text: "Handles objections and qualifies leads automatically" },
                { icon: <Calendar className="w-5 h-5 text-[#0d9488]" />, text: "Books appointments directly on your calendar" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d9488]/10 flex items-center justify-center shrink-0">{item.icon}</div>
                  <span className="text-[#334155]">{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[#0f172a] overflow-hidden">
        <div className="container text-center mb-12">
          <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold mb-4 uppercase">Real Results</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            What Agencies Are <span className="bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent italic">Saying</span>
          </h2>
        </div>
        {/* Featured testimonial - auto-rotating */}
        <div className="container max-w-3xl mb-12">
          <FeaturedTestimonial />
        </div>
        {/* Case study cards - auto-rotating */}
        <div className="container">
          <CaseStudyCarousel />
        </div>
      </section>

      {/* ===== PRICING — 2 PRODUCTS + PRO ===== */}
      <section id="pricing" className="py-20 bg-[#f8fafc]">
        <div className="container text-center mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Two Products. One System. Order Now.
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] mt-4">Buy à la carte. Or have Sandy convert them for you.</p>
        </div>

        <div className="container grid md:grid-cols-3 gap-6 max-w-5xl mb-12">
          {/* Data Driver */}
          <div className="rounded-2xl p-6 border bg-white border-[#e2e8f0]">
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Sales Prospects</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-[#0d9488]">$0.25</span>
              <span className="text-sm text-[#64748b]">per contact</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#0d9488]/10 text-[#0d9488] text-xs font-semibold px-2 py-1 rounded-full mb-4">
              $0.20 with Pro — 20% off
            </div>
            <button onClick={() => handleCheckout("sales_prospects")} disabled={checkoutLoading === "sales_prospects"} className="w-full py-2.5 rounded-full font-semibold text-sm mb-4 bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {checkoutLoading === "sales_prospects" ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "GET LEADS NOW →"}
            </button>
            <ul className="space-y-2">
              {["15/10 source verification", "Skip traced mobile numbers", "Instant GHL & HubSpot delivery", "41 pre-built audience segments", "Full demographic data included", "White-label ready", "No contracts or minimums"].map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-[#64748b]">
                  <Check className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Warm Recruiting */}
          <div className="rounded-2xl p-6 border bg-white border-[#e2e8f0]">
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Remote Sales Recruits</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-[#0d9488]">$1.00</span>
              <span className="text-sm text-[#64748b]">per contact</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#0d9488]/10 text-[#0d9488] text-xs font-semibold px-2 py-1 rounded-full mb-4">
              $0.80 with Pro — 20% off
            </div>
            <button onClick={() => handleCheckout("remote_sales_recruits")} disabled={checkoutLoading === "remote_sales_recruits"} className="w-full py-2.5 rounded-full font-semibold text-sm mb-4 bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {checkoutLoading === "remote_sales_recruits" ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "START RECRUITING NOW →"}
            </button>
            <ul className="space-y-2">
              {[
                { text: "Indeed, LinkedIn & ZipRecruiter applications", pro: false },
                { text: "License verification included", pro: true },
                { text: "Sandy coaches recruits", pro: true },
                { text: "L.I.E.S. training integration", pro: true },
                { text: "Onboarding progress tracking", pro: true },
                { text: "Warm handoff to your team", pro: true },
              ].map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-[#64748b]">
                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${f.pro ? 'text-[#eab308]' : 'text-[#0d9488]'}`} />
                  {f.text}
                  {f.pro && <span className="text-[10px] font-bold bg-[#eab308]/15 text-[#eab308] px-1.5 py-0.5 rounded-full leading-none ml-auto shrink-0">PRO</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* DD Pro */}
          <div className="rounded-2xl p-6 border-2 border-[#0d9488] bg-[#0f172a] text-white relative shadow-xl shadow-teal-500/10">
            <span className="absolute -top-3 left-6 bg-gradient-to-r from-[#eab308] to-[#0d9488] text-[#0f172a] text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
            <h3 className="text-lg font-bold mb-1 mt-2" style={{ fontFamily: "var(--font-display)" }}>
              Data Driver <span className="text-[#0d9488]">Pro</span>
            </h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold bg-gradient-to-r from-[#eab308] to-[#22c55e] bg-clip-text text-transparent">FREE MONTH 1</span>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#22c55e]/20 text-[#22c55e] px-2.5 py-1 rounded-full w-fit">🎁 FREE MONTH 1 WITH PURCHASE OF 2,000 CONTACTS</span>
              <span className="text-xs text-white/40">Then $997/mo after</span>
            </div>
            <button onClick={() => handleCheckout("dd_pro")} disabled={checkoutLoading === "dd_pro"} className="btn-cta w-full justify-center mb-4 disabled:opacity-50">
              {checkoutLoading === "dd_pro" ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Get Pro Now <ArrowRight className="w-4 h-4" /></>}
            </button>
            <ul className="space-y-2">
              {["2,000 contacts/mo ($500 value)", "Sandy AI instant follow-up", "AI voice calls (6 assistants)", "Pipeline automation", "Custom SEO page + blog posts", "Additional contacts $0.20 each", "Warm Recruiting at $0.80 (20% off)"].map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>


      </section>


      {/* ===== WHITE-LABEL GHL SECTION ===== */}
      <section id="ghlagencies" className="py-16 md:py-24 bg-[#f97316] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="container max-w-5xl text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-6">
            <span className="text-sm font-semibold tracking-wider text-white uppercase">GHL Agency Owners</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            White-Label Data Driver.<br />
            <span className="text-[#fef3c7]">5 Minutes Tops.</span>
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-10 max-w-xl mx-auto">
            No API keys, no webhooks. Download from the GHL Marketplace, install, and go.
          </p>

          {/* 3 Step Cards */}
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 pt-8 relative shadow-lg shadow-black/10">
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-[#0d9488]" />
              <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-7 h-7 text-[#f97316]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-bold text-[#0f172a] text-base" style={{ fontFamily: "var(--font-display)" }}>Set Your Price & White Label Settings</h3>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 pt-8 relative shadow-lg shadow-black/10">
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-[#eab308]" />
              <div className="w-14 h-14 rounded-2xl bg-[#eab308]/10 flex items-center justify-center mx-auto mb-3">
                <Filter className="w-7 h-7 text-[#eab308]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#eab308] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-bold text-[#0f172a] text-base" style={{ fontFamily: "var(--font-display)" }}>Your Client Buys Contacts in Their Sub-Account</h3>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 pt-8 relative shadow-lg shadow-black/10">
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-[#0d9488]" />
              <div className="w-14 h-14 rounded-2xl bg-[#0d9488]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-[#0d9488]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-bold text-[#0f172a] text-base" style={{ fontFamily: "var(--font-display)" }}>Leads Drop Straight Into Their CRM</h3>
            </div>
          </div>

          {/* Value props */}
          <div className="space-y-2 text-white/90 text-base md:text-lg font-medium mb-10">
            <p>Set your price on every lead. When your clients buy — <span className="text-white font-bold">you keep the profit.</span></p>
            <p className="text-white font-bold text-lg md:text-xl">No overhead. No upfront cost. No risk.</p>
          </div>

          {/* Profit Calculator */}
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-10 shadow-xl shadow-black/10 text-left">
            <div className="text-center mb-6">
              <p className="text-xs tracking-[0.2em] text-[#f97316] font-semibold uppercase mb-1">Profit Calculator</p>
              <h3 className="text-xl md:text-2xl font-bold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>See What You Could Earn</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Subaccounts slider */}
              <div>
                <label className="text-sm font-semibold text-[#334155] mb-2 block">Number of Sub-Accounts</label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={calcSubaccounts}
                  onChange={(e) => setCalcSubaccounts(Number(e.target.value))}
                  className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
                />
                <div className="flex justify-between text-xs text-[#94a3b8] mt-1">
                  <span>1</span>
                  <span className="text-lg font-bold text-[#f97316]">{calcSubaccounts}</span>
                  <span>50</span>
                </div>
              </div>

              {/* Markup slider */}
              <div>
                <label className="text-sm font-semibold text-[#334155] mb-2 block">Your Markup Per Lead</label>
                <input
                  type="range"
                  min={0.05}
                  max={1.00}
                  step={0.05}
                  value={calcMarkup}
                  onChange={(e) => setCalcMarkup(Number(e.target.value))}
                  className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
                />
                <div className="flex justify-between text-xs text-[#94a3b8] mt-1">
                  <span>$0.05</span>
                  <span className="text-lg font-bold text-[#f97316]">${calcMarkup.toFixed(2)}</span>
                  <span>$1.00</span>
                </div>
              </div>
            </div>

            {/* Leads per subaccount */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-[#334155] mb-2 block">Avg. Leads Purchased Per Sub-Account / Month</label>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={calcLeads}
                onChange={(e) => setCalcLeads(Number(e.target.value))}
                className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
              />
              <div className="flex justify-between text-xs text-[#94a3b8] mt-1">
                <span>50</span>
                <span className="text-lg font-bold text-[#f97316]">{calcLeads.toLocaleString()}</span>
                <span>2,000</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-r from-[#f97316]/10 to-[#eab308]/10 rounded-xl p-5 border border-[#f97316]/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-[#64748b] font-medium mb-1">Per Sub-Account</p>
                  <p className="text-xl md:text-2xl font-bold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
                    ${(calcLeads * calcMarkup).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#64748b]">/month</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b] font-medium mb-1">Monthly Profit</p>
                  <p className="text-2xl md:text-3xl font-bold text-[#f97316]" style={{ fontFamily: "var(--font-display)" }}>
                    ${(calcSubaccounts * calcLeads * calcMarkup).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#64748b]">/month</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b] font-medium mb-1">Annual Profit</p>
                  <p className="text-xl md:text-2xl font-bold text-[#0d9488]" style={{ fontFamily: "var(--font-display)" }}>
                    ${(calcSubaccounts * calcLeads * calcMarkup * 12).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#64748b]">/year</p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#94a3b8] mt-3">Your cost: $0.25/lead &middot; You sell at ${(0.25 + calcMarkup).toFixed(2)}/lead &middot; Pure profit on every sale</p>
          </div>

          <button
            onClick={() => setShowGHLForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#f97316] font-bold text-base md:text-lg hover:bg-white/95 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
          >
            Get It Free in the GHL Marketplace <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>


      {/* ===== LEAD CAPTURE / ORDER ===== */}
      <section id="order" className="py-20 bg-[#0f172a]">
        <div className="container max-w-lg text-center">

          {selectedNiche && (
            <div className="mb-4 inline-flex items-center gap-2 bg-[#0d9488]/20 text-[#0d9488] font-semibold px-4 py-2 rounded-full text-sm">
              <Target className="w-4 h-4" /> Selected: {selectedNiche}
            </div>
          )}
          <DDVerifyForm title="" subtitle="" onGHLClick={() => setShowGHLForm(true)} onSuccess={(info) => {
              setSandyUserInfo(info);
              setShowSandyLive(true);
            }} />
        </div>
      </section>

      {/* ===== POPUP FORM (10s delay) ===== */}
      {showPopup && !showSandyLive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)}>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPopup(false)} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg hover:bg-[#1e293b] transition-colors">
              <X className="w-4 h-4" />
            </button>
            <DDVerifyForm title="" subtitle="" onGHLClick={() => { setShowPopup(false); setShowGHLForm(true); }} onSuccess={(info) => {
                setShowPopup(false);
                setSandyUserInfo(info);
                setShowSandyLive(true);
              }} />
          </div>
        </div>
      )}

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: "var(--font-display)" }}>Common Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What does 15/10 verification mean?", a: "We cross-reference every contact across 15 of the top intent-based predictive buying sources in the world. If at least 10 of those sources don't confirm the same person with the same data at the same time — we don't import it. We don't sell it. To you or anyone. Ever. That's why our data is the most accurate in the industry." },
              { q: "What's included in each contact for $0.25?", a: "Full name, verified email, skip-traced mobile phone number, age, gender, net worth, household income, credit rating, homeowner status, and social enrichment data. All verified across 15 sources." },
              { q: "What if you don't have my niche?", a: "Tell us what you need. If we have it, you'll get it fast. If we don't have it yet, we'll build it and send it to you. We're adding new segments constantly from our 50.6M contact database." },
              { q: "What is Data Driver Pro?", a: "Pro is $997/mo and includes 2,000 contacts ($500 value), Sandy AI handling all follow-up instantly, AI voice calls, pipeline automation, a custom SEO page, and AI blog posts. Additional contacts are only $0.20 each. Your first 30 days are only $497 and include 2,000 contacts — so you can try the full system before committing to the ongoing rate." },
              { q: "How does Warm Recruiting work?", a: "Warm Recruiting contacts are remote sales applications sourced from Indeed at $1.00 each ($0.80 with Pro — 20% off). These are verified candidates ready for outreach. With Pro, Sandy coaches them through onboarding and L.I.E.S. training automatically." },
              { q: "Can I try before I commit?", a: "Yes. Verify your phone number and Sandy will text you a free sample of up to 100 contacts from yesterday's data based on your niche. No credit card required. No commitment." },
              { q: "How fast is delivery?", a: "Instant delivery from payment to CRM. Contacts land in your GHL or HubSpot with tags, pipeline assignments, and workflows triggered automatically. If CRM integration fails, CSV fallback is immediate." },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#94a3b8] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#94a3b8] shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#64748b] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0f172a] text-white py-16">
        <div className="container grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4" style={{ fontFamily: "var(--font-display)" }}>
              <img src={DD_LOGO} alt="DataDriver" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-white/50 text-sm">AI Keyword Intent-Based Prospecting. 15/10 verified data delivered straight to your CRM.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><button onClick={() => scrollTo("overview")} className="hover:text-white transition-colors">Overview</button></li>
              <li><button onClick={() => scrollTo("thedata")} className="hover:text-white transition-colors">The Data</button></li>
              <li><button onClick={() => scrollTo("pricing")} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><button onClick={() => scrollTo("ddpro")} className="hover:text-white transition-colors">DD Pro</button></li>
              <li><button onClick={() => scrollTo("compare")} className="hover:text-white transition-colors">Compare Plans</button></li>
              <li><button onClick={() => scrollTo("pricing")} className="hover:text-white transition-colors">Warm Recruiting</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href="tel:7322070788" className="hover:text-white transition-colors">(732) 207-0788</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /><a href="mailto:keith@ajffinancialgroup.com" className="hover:text-white transition-colors">keith@ajffinancialgroup.com</a></li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Data Driver Pro. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://ajffinancialgroup.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AJF Financial Group</a>
            <a href="https://ajffinancialgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://ajffinancialgroup.com/terms-and-services" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ===== SANDY FORM POPUP (Speak to Sandy flow) ===== */}
      {showSandyForm && !showSandyLive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSandyForm(false)}>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSandyForm(false)} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg hover:bg-[#1e293b] transition-colors">
              <X className="w-4 h-4" />
            </button>
            <DDVerifyForm
              title=""
              subtitle=""
              onSuccess={(info) => {
                setSandyUserInfo(info);
                setShowSandyForm(false);
                setShowSandyLive(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ===== GHL AGENCY FORM POPUP ===== */}
      {showGHLForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowGHLForm(false)}>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowGHLForm(false)} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg hover:bg-[#1e293b] transition-colors">
              <X className="w-4 h-4" />
            </button>
            <GHLAgencyForm />
          </div>
        </div>
      )}

      {/* ===== SANDY LIVE AVATAR POPUP ===== */}
      {showSandyLive && (
        <SandyLiveAvatar
          onClose={() => { setShowSandyLive(false); setSandyUserInfo(undefined); }}
          userInfo={sandyUserInfo}
        />
      )}
    </div>
  );
}

// Suppress unused import warnings for icons imported but used in JSX inline expressions
void Zap;
void Globe;
void BarChart3;
void Clock;
void TrendingUp;
void Database;
void FileCheck;
void JUNE_UPPER;
void DataDriverLogo;
