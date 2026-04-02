/*
 * DD Verify Capture Form — React component
 * Submits to imessage-relay API, opens native SMS for verification
 * Supports Apple (iMessage) and Android (RCS/SMS) flows
 * Config: IMESSAGE_NUMBER placeholder — update when number is provided
 */
import { useState, useCallback } from "react";
import { ArrowRight, Loader2, CheckCircle, MessageSquare } from "lucide-react";

const DD_VERIFY_CONFIG = {
  IMESSAGE_NUMBER: "+17322070788",
  API_URL: "https://imessage-relay.up.railway.app",
  GHL_WEBHOOK_URL: "",
};

function isApple() {
  return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

function normPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d[0] === "1") return "+" + d;
  return "+" + d;
}

function openMessaging(token: string, name: string) {
  const body = encodeURIComponent(`VERIFY-${token} Hey, this is ${name}!`);
  window.location.href = `sms:${DD_VERIFY_CONFIG.IMESSAGE_NUMBER}&body=${body}`;
}

interface DDVerifyFormProps {
  /** Optional heading override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
  /** Use dark variant (for dark backgrounds) */
  dark?: boolean;
  /** Optional className for the outer wrapper */
  className?: string;
  /** Callback fired after successful form submission with user info */
  onSuccess?: (info: { firstName: string; lastName: string; email: string; phone: string }) => void;
  /** Callback fired when "GHL Agency Owner? Click Here" is clicked */
  onGHLClick?: () => void;
}

export default function DDVerifyForm({
  title = "Get Connected",
  subtitle = "With Sandy Now",
  dark = false,
  className = "",
  onSuccess,
  onGHLClick,
}: DDVerifyFormProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [isAppleDevice] = useState(isApple);

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
    const userInfo = { firstName, lastName, email, phone: normalizedPhone };

    // Fire API + GHL webhook as best-effort (non-blocking)
    // The form succeeds regardless — Sandy takes over
    fetch(`${DD_VERIFY_CONFIG.API_URL}/api/capture-and-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userInfo,
        source: "verify_form",
        timestamp: new Date().toISOString(),
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.token) {
        openMessaging(data.token, firstName);
        setSuccessToken(data.token);
      }
    }).catch(() => {
      // Relay is down — no SMS verification, Sandy handles it
    });

    if (DD_VERIFY_CONFIG.GHL_WEBHOOK_URL) {
      fetch(DD_VERIFY_CONFIG.GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      }).catch(() => {});
    }

    // Always fire onSuccess — Sandy Live Avatar takes over from here
    if (onSuccess) {
      onSuccess(userInfo);
    } else {
      // No onSuccess handler — show success state directly
      setSuccessToken("local");
    }

    setLoading(false);
  }, [form, onSuccess]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Colors based on dark/light variant
  const bg = dark ? "bg-[#1a1a19]" : "bg-white";
  const border = dark ? "border-white/[0.08]" : "border-[#e2e8f0]";
  const titleColor = dark ? "text-[#f8f8f7]" : "text-[#0f172a]";
  const subtitleColor = dark ? "text-[#858481]" : "text-[#64748b]";
  const inputBg = dark ? "bg-white/[0.04] border-white/[0.08] text-[#f8f8f7] placeholder:text-white/20" : "bg-white border-[#e2e8f0] text-[#0f172a] placeholder:text-[#94a3b8]";
  const inputFocus = "focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20";
  const errorBg = dark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200";
  const errorText = dark ? "text-[#ff6568]" : "text-red-600";
  const successTextColor = dark ? "text-[#f8f8f7]" : "text-[#0f172a]";
  const successSubColor = dark ? "text-[#858481]" : "text-[#64748b]";
  const badgeBg = dark ? "bg-[#0766ee]/[0.08] border-[#0766ee]/15" : "bg-[#0d9488]/[0.08] border-[#0d9488]/15";
  const badgeText = dark ? "text-[#3ce19b]" : "text-[#0d9488]";

  // Suppress unused variable warnings from props not used in markup
  void title;
  void subtitle;
  void subtitleColor;
  void titleColor;

  // Success state — SMS verification sent, show next step
  if (successToken) {
    const retryClick = (e: React.MouseEvent) => {
      e.preventDefault();
      openMessaging(successToken, form.firstName);
    };

    const ORDER_FORM_URL = `https://data-driver-form.vercel.app?ref=datadriverpro&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.firstName)}`;

    return (
      <div className={`${bg} border ${border} rounded-2xl p-8 md:p-10 ${className}`}>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0766ee] to-[#3ce19b] flex items-center justify-center mx-auto mb-4 text-[#020509] text-3xl font-bold">
            ✓
          </div>
          <h2 className={`text-xl font-bold mb-2 ${successTextColor}`} style={{ fontFamily: "var(--font-display)" }}>
            You're verified, {form.firstName}!
          </h2>
          <p className={`text-sm ${successSubColor}`}>
            {isAppleDevice
              ? "Your Messages app should have opened. Tap send to verify your number."
              : "Your messaging app should have opened. Tap send to verify your number."}
          </p>
          <p className="mt-3 text-xs text-[#858481]">
            Didn't open?{" "}
            <button onClick={retryClick} className="text-[#0d9488] hover:underline">
              Tap here to try again.
            </button>
          </p>
          {/* Redirect to order leads form */}
          <a
            href={ORDER_FORM_URL}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 md:py-4 rounded-lg bg-gradient-to-r from-[#0766ee] to-[#3ce19b] text-[#020509] font-bold text-sm md:text-base hover:scale-[1.02] hover:opacity-95 active:scale-[0.98] transition-all no-underline"
          >
            Browse & Order Leads <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bg} border ${border} rounded-2xl p-5 md:p-10 ${className}`}>
      {/* Built-in headline — always shown */}
      <h2 className={`text-2xl md:text-3xl font-bold text-center mb-1 ${successTextColor}`} style={{ fontFamily: "var(--font-display)" }}>
        Connect with Us.
      </h2>
      <p className="text-center text-xl md:text-2xl font-bold italic mb-4 md:mb-6 bg-gradient-to-r from-[#eab308] to-[#0d9488] bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display)" }}>
        Get a free sample.
      </p>

      {/* Error */}
      {error && (
        <div className={`${errorBg} border rounded-xl px-4 py-3 mb-4 text-sm ${errorText}`}>
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

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 md:py-4 rounded-lg bg-gradient-to-r from-[#0766ee] to-[#3ce19b] text-[#020509] font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:scale-[1.02] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        {loading ? (
          <>
            <span className="opacity-60">Submitting...</span>
            <Loader2 className="w-5 h-5 animate-spin absolute right-5" />
          </>
        ) : (
          <>Submit <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      {/* Badge */}
      <div className={`flex items-center justify-center gap-2 ${badgeBg} border rounded-lg px-3 md:px-4 py-1.5 md:py-2.5 mt-3 md:mt-4 text-xs md:text-sm ${badgeText}`}>
        <MessageSquare className="w-4 h-4 shrink-0" />
        To verify your number, your message app will open
      </div>

      {/* GHL Agency Owner Link */}
      {onGHLClick && (
        <button
          onClick={onGHLClick}
          className="w-full mt-3 md:mt-4 py-2.5 text-center text-sm md:text-base font-semibold text-[#f97316] hover:text-[#ea580c] transition-colors flex items-center justify-center gap-1.5"
        >
          GHL Agency Owner? Click Here <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Suppress unused import warning
void CheckCircle;
