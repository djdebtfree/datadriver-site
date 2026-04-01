/**
 * SandyLiveAvatar — Auto-launching popup with Railway LiveAvatar
 *
 * Shows "Sandy is Coming..." until the iframe posts a ready message,
 * then fades in. Passes user name/email/phone so Sandy greets them
 * by name and picks up from their last conversation.
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

  // Fallback: if iframe loads but never posts "sandy-ready", fade in after 6s
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!sandyReady) setSandyReady(true);
    }, 6000);
    return () => clearTimeout(fallback);
  }, [sandyReady]);

  // Fade in once Sandy signals ready
  useEffect(() => {
    if (sandyReady) {
      const timer = setTimeout(() => setFadeIn(true), 200);
      return () => clearTimeout(timer);
    }
  }, [sandyReady]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Build iframe URL with user context so Sandy greets by name
  const getIframeUrl = () => {
    const params = new URLSearchParams({ autoStart: "true" });
    if (userInfo?.firstName) params.set("name", userInfo.firstName);
    if (userInfo?.lastName) params.set("lastName", userInfo.lastName);
    if (userInfo?.email) params.set("email", userInfo.email);
    if (userInfo?.phone) params.set("phone", userInfo.phone);
    // Tell Sandy to greet with name and resume prior conversation
    params.set("greeting", `Hi ${userInfo?.firstName || "there"}`);
    params.set("resumeConversation", "true");
    return `${LIVEAVATAR_APP_URL}?${params.toString()}`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-[95vw] max-w-2xl h-[80vh] max-h-[700px] bg-[#0b1120] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img src={JUNE_UPPER} alt="Sandy" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <span className="text-white text-sm font-semibold">Sandy Beach Live!</span>
              <span className="text-[#0d9488] text-xs ml-2">AI-Powered</span>
            </div>
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

        {/* Iframe + loading overlay */}
        <div className="flex-1 relative">
          {/* "Sandy is Coming..." stays until she's ready */}
          {!fadeIn && (
            <div className="absolute inset-0 z-10 bg-[#0b1120] flex flex-col items-center justify-center transition-opacity duration-700">
              <div className="relative w-20 h-20 mb-4">
                <img
                  src={JUNE_UPPER}
                  alt="Sandy"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#0d9488]"
                />
                <div className="absolute inset-0 rounded-full border-2 border-[#0d9488] animate-ping opacity-30" />
              </div>
              <p className="text-white text-base font-semibold mb-1">Sandy is Coming...</p>
              {userInfo?.firstName && (
                <p className="text-white/40 text-sm">Getting ready for you, {userInfo.firstName}</p>
              )}
              <div className="flex justify-center gap-1 mt-3">
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Iframe loads immediately (hidden behind loading screen) */}
          <iframe
            ref={iframeRef}
            src={getIframeUrl()}
            className={`w-full h-full border-0 transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}
            allow="camera; microphone; autoplay; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
