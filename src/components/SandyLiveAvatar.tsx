/**
 * SandyLiveAvatar — Full-screen stable popup with Railway LiveAvatar
 *
 * Desktop: Wide window (90vw, max 1100px) showing Sandy + conversation panel
 * Mobile: Full-screen, face-only — just Sandy talking
 * The window is FIXED and PINNED — no layout shifts, no jumping.
 * "Sandy is Coming..." holds until iframe signals ready or 6s fallback.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

const JUNE_UPPER =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/june-upper-body_fbbaace4.webp";

const LIVEAVATAR_APP_URL = "https://liveavatar-ghl-agent-production.up.railway.app";

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface SandyLiveAvatarProps {
  onClose?: () => void;
  userInfo?: UserInfo;
}

export default function SandyLiveAvatar({ onClose, userInfo }: SandyLiveAvatarProps) {
  const [sandyReady, setSandyReady] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lock ALL scrolling when Sandy is open — prevent iframe from autoscrolling the page
  useEffect(() => {
    const original = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Prevent any scroll events from bubbling out of the iframe
    const preventScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.tagName !== 'IFRAME') return;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('scroll', preventScroll, { capture: true });
    // Force scroll to top of Sandy overlay
    window.scrollTo({ top: 0 });
    return () => {
      document.body.style.overflow = original;
      document.documentElement.style.overflow = originalHtml;
      window.removeEventListener('scroll', preventScroll, { capture: true });
    };
  }, []);

  // Listen for postMessage from Sandy iframe signaling she's ready
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data === "sandy-ready" || e.data?.type === "sandy-ready") {
        setSandyReady(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Fallback: fade in after 6s if iframe never signals
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!sandyReady) setSandyReady(true);
    }, 6000);
    return () => clearTimeout(fallback);
  }, [sandyReady]);

  // Fade in once Sandy is ready, then auto-click "Start Conversation" in iframe
  useEffect(() => {
    if (sandyReady) {
      const timer = setTimeout(() => setFadeIn(true), 200);

      // Auto-click the Start Conversation button inside the iframe
      // Try postMessage first (preferred), then direct DOM access as fallback
      const autoStart = setTimeout(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Method 1: postMessage to iframe app (if it listens for this)
        try {
          iframe.contentWindow?.postMessage({ type: 'auto-start-conversation' }, '*');
        } catch (_) { /* cross-origin, expected */ }

        // Method 2: Direct DOM click (works if same-origin or CORS allows)
        try {
          const btn = iframe.contentDocument?.querySelector('button[class*="Start"], button[class*="start"], .start-btn, [data-action="start"]') as HTMLButtonElement | null;
          if (btn) btn.click();
        } catch (_) { /* cross-origin block, expected */ }
      }, 1500);

      return () => { clearTimeout(timer); clearTimeout(autoStart); };
    }
  }, [sandyReady]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Build iframe URL — match LiveAvatar client params exactly
  // Client reads: email, phone, autostart (lowercase), name
  const getIframeUrl = () => {
    const params = new URLSearchParams();
    params.set("autostart", "true");
    params.set("mode", "datadriver");
    if (userInfo?.firstName) params.set("name", userInfo.firstName);
    if (userInfo?.email) params.set("email", userInfo.email);
    if (userInfo?.phone) params.set("phone", userInfo.phone);
    return `${LIVEAVATAR_APP_URL}?${params.toString()}`;
  };

  return (
    <>
      {/* Full-screen overlay — FIXED position, no scroll, no layout shift */}
      <div
        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
        style={{ isolation: "isolate" }}
        onClick={handleClose}
      />

      {/* Sandy container — FIXED, centered, does NOT participate in document flow */}
      <div
        className="fixed z-[10000] bg-[#0b1120] shadow-2xl border border-white/10 overflow-hidden flex flex-col
          inset-0 rounded-none
          md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[90vw] md:max-w-[1100px] md:h-[85vh] md:max-h-[800px] md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with Sandy branding */}
        <div className="bg-[#0f172a] border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between px-4 py-2 h-12">
            <div className="flex items-center gap-3">
              <img src={JUNE_UPPER} alt="Sandy" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-white text-sm font-semibold">Sandy Beach</span>
              <span className="text-[#0d9488] text-xs">Live</span>
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area — fills remaining space, no resize */}
        <div className="flex-1 relative min-h-0">
          {/* Cover the iframe's built-in "LiveAvatar Agent" header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-[#0b1120] text-center py-3 px-4 border-b border-white/5">
            <h2 className="text-white text-lg md:text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Meet Sandy Beach AI
            </h2>
            <p className="text-white/60 text-sm mt-0.5">Your New Rep / Recruiter / Coach</p>
            <p className="text-[#0d9488] text-xs font-medium mt-1">Only available with Data Driver Pro</p>
          </div>
          {/* "Sandy is Coming..." loading screen */}
          <div
            className={`absolute inset-0 z-10 bg-[#0b1120] flex flex-col items-center justify-center transition-opacity duration-700 ${fadeIn ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="relative w-24 h-24 mb-5">
              <img
                src={JUNE_UPPER}
                alt="Sandy"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#0d9488]"
              />
              <div className="absolute inset-0 rounded-full border-2 border-[#0d9488] animate-ping opacity-30" />
            </div>
            <p className="text-white text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Sandy is Coming...
            </p>
            {userInfo?.firstName && (
              <p className="text-white/40 text-sm">Getting ready for you, {userInfo.firstName}</p>
            )}
            <div className="flex justify-center gap-1.5 mt-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>

          {/* Iframe — offset down to hide iframe's built-in "LiveAvatar Agent" header behind our branding */}
          <iframe
            ref={iframeRef}
            src={getIframeUrl()}
            className={`absolute left-0 right-0 bottom-0 w-full border-0 transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}
            allow="camera; microphone; autoplay; fullscreen"
            style={{ display: "block", top: "20px", height: "calc(100% - 20px)" }}
          />
        </div>
      </div>
    </>
  );
}
