/*
 * GHL Agency Form — Separate form for White-Label GHL Agency button
 * Collects info, then redirects to GHL App Marketplace OAuth URL
 */
import { useState, useCallback } from "react";
import { ArrowRight, Loader2, MessageSquare, DollarSign, Filter, Users } from "lucide-react";

const GHL_MARKETPLACE_URL =
  "https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=https%3A%2F%2Fcreator.alltheapps.io%2Fintegrations%2Fauth%2Fsnapshot_onboarding%2F69171a579b400d7d55537ab6&client_id=69171a579b400d7d55537ab6-mhytgsbu&scope=locations.readonly+users.readonly+companies.readonly+marketplace-installer-details.readonly+locations%2FcustomFields.write+locations%2FcustomValues.write+locations%2FcustomValues.readonly+locations%2FcustomFields.readonly+contacts.readonly+contacts.write+custom-menu-link.readonly+custom-menu-link.write+charges.readonly+charges.write&version_id=6971fc70aa7f217bb3d2ed37";

const DD_VERIFY_CONFIG = {
  IMESSAGE_NUMBER: "+1XXXXXXXXXX",
  API_URL: "https://imessage-relay.up.railway.app",
};

function normPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d[0] === "1") return "+" + d;
  return "+" + d;
}

interface GHLAgencyFormProps {
  className?: string;
}

export default function GHLAgencyForm({ className = "" }: GHLAgencyFormProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    const { firstName, lastName, email, phone } = form;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setError("");
    setLoading(true);

    const normalizedPhone = normPhone(phone);

    try {
      // Submit to capture API
      await fetch(`${DD_VERIFY_CONFIG.API_URL}/api/capture-and-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: normalizedPhone,
          source: "ghl_agency_form",
          timestamp: new Date().toISOString(),
        }),
      });

      // Redirect to GHL Marketplace
      window.open(GHL_MARKETPLACE_URL, "_blank");
    } catch {
      // Even if capture fails, still redirect
      window.open(GHL_MARKETPLACE_URL, "_blank");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const inputBg = "bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]";
  const inputFocus = "focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20";

  return (
    <div className={`bg-white border border-[#e2e8f0] rounded-2xl p-5 md:p-10 ${className}`}>
      {/* Headline */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
        FOR GHL Agency Owners Only
      </h2>
      <p className="text-center text-lg md:text-xl font-bold italic mb-2 text-[#f97316]" style={{ fontFamily: "var(--font-display)" }}>
        Download Free In the App Marketplace
      </p>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
        {[
          { icon: DollarSign, label: "Set Your Price & White Label Settings", sub: "", num: 1, border: "border-t-[#0d9488]", numBg: "bg-[#0d9488]" },
          { icon: Filter, label: "Your Client Buys Contacts in Their Sub-Account", sub: "", num: 2, border: "border-t-[#eab308]", numBg: "bg-[#eab308]" },
          { icon: Users, label: "Leads Drop Straight Into Their CRM", sub: "", num: 3, border: "border-t-[#0d9488]", numBg: "bg-[#0d9488]" },
        ].map((step) => (
          <div key={step.num} className={`bg-[#f8fafc] rounded-xl border border-[#e2e8f0] ${step.border} border-t-4 p-2 md:p-4 text-center`}>
            <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-lg bg-[#f97316]/10 flex items-center justify-center">
              <step.icon className="w-4 h-4 md:w-5 md:h-5 text-[#f97316]" />
            </div>
            <div className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 rounded-full ${step.numBg} text-white text-[10px] md:text-xs font-bold flex items-center justify-center`}>
              {step.num}
            </div>
            <p className="text-[10px] md:text-xs font-bold text-[#0f172a] leading-tight">{step.label}</p>
            {step.sub && <p className="text-[9px] md:text-[11px] text-[#64748b] leading-tight">{step.sub}</p>}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form fields */}
      <div className="flex gap-2 md:gap-3 mb-3 md:mb-4">
        <input
          type="text"
          placeholder="First name"
          autoComplete="given-name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          onKeyDown={handleKeyDown}
          className={`flex-1 min-w-0 px-3 md:px-4 py-2.5 md:py-3.5 rounded-lg border ${inputBg} ${inputFocus} outline-none transition-all text-sm md:text-base`}
        />
        <input
          type="text"
          placeholder="Last name"
          autoComplete="family-name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          onKeyDown={handleKeyDown}
          className={`flex-1 min-w-0 px-3 md:px-4 py-2.5 md:py-3.5 rounded-lg border ${inputBg} ${inputFocus} outline-none transition-all text-sm md:text-base`}
        />
      </div>
      <input
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 md:px-4 py-2.5 md:py-3.5 rounded-lg border ${inputBg} ${inputFocus} outline-none transition-all text-sm md:text-base mb-3 md:mb-4`}
      />
      <input
        type="tel"
        placeholder="(555) 123-4567"
        autoComplete="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 md:px-4 py-2.5 md:py-3.5 rounded-lg border ${inputBg} ${inputFocus} outline-none transition-all text-sm md:text-base mb-3 md:mb-4`}
      />

      {/* Submit — Orange themed */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 md:py-4 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        {loading ? (
          <>
            <span className="opacity-80">Redirecting...</span>
            <Loader2 className="w-5 h-5 animate-spin absolute right-5" />
          </>
        ) : (
          <>Get It Free <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      {/* Badge */}
      <div className="flex items-center justify-center gap-2 bg-[#f97316]/[0.08] border border-[#f97316]/15 rounded-lg px-3 md:px-4 py-1.5 md:py-2.5 mt-3 md:mt-4 text-xs md:text-sm text-[#f97316]">
        <MessageSquare className="w-4 h-4 shrink-0" />
        You'll be redirected to the GHL App Marketplace
      </div>
    </div>
  );
}

// Suppress unused variable warning
void DD_VERIFY_CONFIG.IMESSAGE_NUMBER;
