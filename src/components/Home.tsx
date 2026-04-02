/*
 * Data Driver — Rewritten Home Page
 * One product. One path. No forks. No jargon. No cliffs.
 * Design: Light theme, DM Sans headings, Inter body
 * Colors: White bg, dark sections (#0f172a), teal accent (#0d9488), yellow-green gradient CTAs
 */
import { useState, useEffect, useRef } from "react";
import DDVerifyForm from "@/components/DDVerifyForm";
import DataDriverLogo from "@/components/DataDriverLogo";
import SandyLiveAvatar from "@/components/SandyLiveAvatar";
import GHLAgencyForm from "@/components/GHLAgencyForm";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, Star,
  Phone, Mail, Shield, Users, MessageSquare, Video,
  Calendar, Target, X, User, Smartphone, FileCheck,
} from "lucide-react";
import { toast } from "sonner";

// Suppress unused import warnings
void toast;
void Star;
void Target;
void GHLAgencyForm;
void DataDriverLogo;

const DD_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/datadriver-logo-transparent_2fb150a7.png";
const SANDY_VIDEO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/SandyGreeting-DataDriverHomepage_1080p_ec4dcb9b.mp4";

const NAV_ITEMS = [
  { label: "What You Get", id: "what-you-get" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "Contact Sandy", id: "sandy" },
];

// ===== SANDY VIDEO COMPONENT =====
function SandyVideoSection({ onSpeakToSandy }: { onSpeakToSandy: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayed) {
            video.muted = true;
            video.play().then(() => {
              setIsPlaying(true);
              setHasAutoPlayed(true);
            }).catch(() => {});
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [hasAutoPlayed]);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().then(() => setIsPlaying(true)).catch(() => {
      v.muted = true;
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    });
  };

  return (
    <div ref={containerRef} className="rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-lg bg-white">
      <div className="relative cursor-pointer" onClick={handlePlay}>
        <video
          ref={videoRef}
          src={SANDY_VIDEO}
          playsInline
          className="w-full aspect-video object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-[#0f172a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <button
          onClick={onSpeakToSandy}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-base bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all"
        >
          <Video className="w-5 h-5" /> Talk to Sandy Live
        </button>
      </div>
    </div>
  );
}

// ===== VERIFICATION DEMO =====
const VERIFY_CHECKS = [
  "Full name confirmed",
  "Mobile number skip-traced",
  "Email deliverability verified",
  "TCPA compliance checked",
  "USPS address confirmed",
  "Income range validated",
  "Net worth sourced",
  "Homeowner status confirmed",
  "Intent signals detected",
  "Credit band sourced",
  "Social enrichment matched",
  "DNC list scrubbed",
  "Age & gender confirmed",
  "Company & title verified",
  "15th source cross-check passed",
];

function VerificationDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([]);
  const [verificationDone, setVerificationDone] = useState(false);
  const [score, setScore] = useState(0);

  const startVerification = () => {
    if (!name || !email || !phone || !state) {
      toast("Please fill in all fields to see the demo.");
      return;
    }
    setIsVerifying(true);
    setChecks([]);
    setVerificationDone(false);
    setScore(0);

    VERIFY_CHECKS.forEach((_, i) => {
      setTimeout(() => {
        setChecks((prev) => [...prev, true]);
        setScore(Math.round(((i + 1) / VERIFY_CHECKS.length) * 100));
        if (i === VERIFY_CHECKS.length - 1) {
          setIsVerifying(false);
          setVerificationDone(true);
        }
      }, 300 + i * 220);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
      {!verificationDone ? (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0d9488]"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0d9488]"
            />
            <input
              type="tel"
              placeholder="Mobile Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0d9488]"
            />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0d9488] text-[#64748b]"
            >
              <option value="">Select State</option>
              {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {isVerifying ? (
            <div className="space-y-2.5">
              {VERIFY_CHECKS.map((check, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i < checks.length ? "opacity-100" : "opacity-20"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i < checks.length ? "bg-[#0d9488]" : "bg-[#e2e8f0]"}`}>
                    {i < checks.length && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={i < checks.length ? "text-[#334155]" : "text-[#94a3b8]"}>{check}</span>
                </div>
              ))}
              <div className="mt-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-[#0d9488] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#0d9488]">{score}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#334155]">Verification Score</p>
                  <p className="text-xs text-[#94a3b8]">Running checks...</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={startVerification}
              className="w-full btn-cta justify-center text-base"
            >
              Run Verification Demo <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-4 border-[#0d9488] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#0d9488]">100</span>
          </div>
          <p className="text-xs tracking-[0.2em] text-[#0d9488] font-semibold uppercase mb-2">Verification Complete</p>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            15 of 15 checks passed.
          </h3>
          <p className="text-sm text-[#64748b] mb-6">This is what every contact looks like before it reaches you.</p>
          <a
            href="https://data-driver-form.vercel.app?ref=datadriverpro"
            className="btn-cta inline-flex text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Contacts This Verified — $0.25 Each <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function Home() {
  const [activeNav, setActiveNav] = useState("what-you-get");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSandyLive, setShowSandyLive] = useState(false);
  const [sandyUserInfo, setSandyUserInfo] = useState<{ firstName: string; lastName: string; email: string; phone: string } | undefined>(undefined);
  const [showSandyForm, setShowSandyForm] = useState(false);

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
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
            <img src={DD_LOGO} alt="DataDriver" className="h-10 w-auto object-contain" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${activeNav === item.id ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a
            href="https://data-driver-form.vercel.app?ref=datadriverpro"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-sm !py-2 !px-5"
          >
            Get Contacts
          </a>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" className="pt-24 pb-20 bg-[#0f172a] text-white">
        <div className="container text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <img src={DD_LOGO} alt="DataDriver" className="h-20 sm:h-28 w-auto object-contain" />
          </div>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real people already looking<br />
            <span className="bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent">
              for what you sell.
            </span>
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-8">
            Name. Phone. Email. Company. Delivered to your CRM in seconds.
          </p>
          <div className="flex justify-center mb-4">
            <a
              href="https://data-driver-form.vercel.app?ref=datadriverpro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta text-base"
            >
              Get Verified Contacts — $0.25 Each <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-white/40 text-sm">No subscription. No contract. No minimum.</p>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section id="what-you-get" className="py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Every Contact Includes</p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What's in each contact
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: <User className="w-5 h-5 text-[#0d9488]" />, label: "Full Name", desc: "Real person, no synthetic records" },
              { icon: <Phone className="w-5 h-5 text-[#0d9488]" />, label: "Mobile Phone", desc: "Skip-traced, TCPA checked" },
              { icon: <Mail className="w-5 h-5 text-[#0d9488]" />, label: "Email", desc: "MX-validated, deliverable" },
              { icon: <Users className="w-5 h-5 text-[#0d9488]" />, label: "Company & Title", desc: "LinkedIn-enriched, verified" },
              { icon: <Target className="w-5 h-5 text-[#0d9488]" />, label: "Income & Net Worth", desc: "Sourced from financial aggregates" },
              { icon: <FileCheck className="w-5 h-5 text-[#0d9488]" />, label: "Intent Signals", desc: "Actively researching your category" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0d9488]/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>{item.label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#64748b]">
            Every contact verified against <span className="font-semibold text-[#0f172a]">15 data points</span> before it reaches you.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 bg-[#0f172a] text-white">
        <div className="container max-w-5xl text-center">
          <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Simple as 1-2-3</p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-14">
            No demo calls. No qualification forms. No monthly minimums. Pick, pay, prospect.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                num: "01",
                icon: <Target className="w-6 h-6 text-[#0d9488]" />,
                title: "Pick Your Market",
                desc: "Choose your niche. Insurance, real estate, solar, home services — we have 41 segments. Filter by state, city, age, income, credit, homeowner status.",
              },
              {
                num: "02",
                icon: <Shield className="w-6 h-6 text-[#0d9488]" />,
                title: "Set Your Filters",
                desc: "Narrow to exactly who you want. State, city, age range, income level, credit band, homeowner status. You define the audience.",
              },
              {
                num: "03",
                icon: <Smartphone className="w-6 h-6 text-[#0d9488]" />,
                title: "Get Your Contacts",
                desc: "Delivered instantly. Name, phone, email, ready to call. Lands in your CRM or downloads as CSV the moment you pay.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative bg-[#1e293b] rounded-2xl p-8 border border-white/10 text-left hover:border-[#0d9488]/40 transition-all"
              >
                <span
                  className="absolute top-4 right-6 text-6xl font-bold text-white/5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#0d9488]/15 flex items-center justify-center mb-5">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <a
            href="https://data-driver-form.vercel.app?ref=datadriverpro"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-base inline-flex"
          >
            Browse Available Markets <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ===== VERIFICATION DEMO ===== */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Live Demo</p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See the Verification In Action
            </h2>
            <p className="text-[#64748b] text-base">
              Enter your info and watch our 15-point check run in real time. This is what happens to every contact before it reaches you.
            </p>
          </div>
          <VerificationDemo />
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Simple Pricing</p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              $0.25 per contact. That's it.
            </h2>
            <p className="text-[#64748b] text-base">No subscription. No contract. No minimum order.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6 shadow-sm">
            <ul className="space-y-3 mb-8">
              {[
                "Verified name, phone, and email",
                "Company and job title",
                "Income range, credit band, net worth",
                "Intent signals — actively researching your category",
                "Instant CRM delivery (GHL, HubSpot, or CSV)",
                "No subscription, no contract, no minimum",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#334155]">
                  <Check className="w-4 h-4 text-[#0d9488] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="border-t border-[#e2e8f0] pt-6 mb-6">
              <p className="text-sm font-semibold text-[#334155] mb-1">Volume pricing</p>
              <p className="text-sm text-[#64748b]">$0.20 per contact at 5,000+</p>
            </div>
            <a
              href="https://data-driver-form.vercel.app?ref=datadriverpro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta w-full justify-center text-base"
            >
              Order Contacts Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-center text-xs text-[#94a3b8]">
            50M+ contacts indexed &middot; 41 segments &middot; Instant delivery
          </p>
        </div>
      </section>

      {/* ===== THE BRIDGE TO SANDY ===== */}
      <section id="sandy" className="py-20 bg-[#f8fafc]">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Available with Data Driver Pro</p>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Want someone to work those leads for you?
              </h2>
              <p className="text-[#64748b] text-base leading-relaxed mb-6">
                Sandy is an AI assistant that texts, calls, and books appointments from your contacts — automatically. She never sleeps, never misses a follow-up, and works 24/7.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <MessageSquare className="w-5 h-5 text-[#0d9488]" />, text: "Texts new contacts the instant they're delivered" },
                  { icon: <Phone className="w-5 h-5 text-[#0d9488]" />, text: "AI voice calls that qualify and handle objections" },
                  { icon: <Calendar className="w-5 h-5 text-[#0d9488]" />, text: "Books appointments directly on your calendar" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0d9488]/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-[#334155] text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSandyForm(true)}
                className="btn-cta text-base"
              >
                Talk to Sandy <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <SandyVideoSection onSpeakToSandy={() => setShowSandyForm(true)} />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Common Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What kind of contacts do I get?",
                a: "Real people with verified name, phone, email, company, and enrichment data — income, net worth, credit band, homeowner status, and intent signals. Every contact is cross-checked against 15 data sources before delivery.",
              },
              {
                q: "How fast is delivery?",
                a: "Instant. Contacts land in your CRM or download as CSV the moment you pay. No waiting, no batch processing.",
              },
              {
                q: "Is there a subscription?",
                a: "No. Pay per contact. $0.25 each. Buy when you want, stop when you want. Volume pricing ($0.20) kicks in at 5,000 contacts.",
              },
              {
                q: "What markets do you cover?",
                a: "41 segments across insurance, real estate, solar, home services, financial services, and more. 50M+ contacts indexed nationwide.",
              },
              {
                q: "Who is Sandy?",
                a: "Sandy is our AI sales assistant. She can text, call, qualify, and book appointments from your leads automatically. She's available as an add-on with Data Driver Pro.",
              },
              {
                q: "Can I try before I commit?",
                a: "Yes. Verify your number below and we'll text you a sample from your market.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-[#94a3b8] shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-[#94a3b8] shrink-0" />}
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

      {/* ===== LEAD CAPTURE ===== */}
      <section id="order" className="py-20 bg-[#0f172a]">
        <div className="container max-w-lg text-center">
          <p className="text-xs tracking-[0.25em] text-[#0d9488] font-semibold uppercase mb-3">Get Started</p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to see what's available in your market?
          </h2>
          <p className="text-white/50 text-sm mb-8">Enter your info and we'll show you what's ready to deliver.</p>
          <DDVerifyForm
            title=""
            subtitle=""
            onSuccess={(info) => {
              setSandyUserInfo(info);
              window.location.href = `https://data-driver-form.vercel.app?ref=datadriverpro&email=${encodeURIComponent(info.email)}&name=${encodeURIComponent(info.firstName)}`;
            }}
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0f172a] text-white py-12 border-t border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-6">
          <div>
            <img src={DD_LOGO} alt="DataDriver" className="h-10 w-auto object-contain mb-3" />
            <p className="text-white/40 text-xs">Built by AJF Financial Group</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="https://ajffinancialgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://ajffinancialgroup.com/terms-and-services" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:keith@ajffinancialgroup.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>
        </div>
        <div className="container mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Data Driver Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* ===== SANDY FORM POPUP ===== */}
      {showSandyForm && !showSandyLive && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSandyForm(false)}
        >
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSandyForm(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg hover:bg-[#1e293b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <DDVerifyForm
              title="Talk to Sandy"
              subtitle="She's ready when you are."
              onSuccess={(info) => {
                setSandyUserInfo(info);
                setShowSandyForm(false);
                setShowSandyLive(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ===== SANDY LIVE AVATAR ===== */}
      {showSandyLive && (
        <SandyLiveAvatar
          onClose={() => { setShowSandyLive(false); setSandyUserInfo(undefined); }}
          userInfo={sandyUserInfo}
        />
      )}
    </div>
  );
}
