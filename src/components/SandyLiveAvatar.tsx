/**
 * SandyLiveAvatar — Popup overlay with Railway LiveAvatar
 *
 * Shows the Railway LiveAvatar app in a centered popup that floats
 * over the main site. User can close it anytime with the X button.
 *
 * Props:
 * - onClose: callback when user closes the popup
 * - userInfo: optional user info to pass to the Railway app
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

// Sandy images
const JUNE_UPPER =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663269081921/cqEkT78PsUQqunxYkBY5U5/june-upper-body_fbbaace4.webp";

// Railway LiveAvatar app URL
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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // After a brief loading moment, show the iframe
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIframe(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // When iframe loads, fade it in smoothly
  useEffect(() => {
    if (iframeLoaded && showIframe) {
      const timer = setTimeout(() => setFadeIn(true), 300);
      return () => clearTimeout(timer);
    }
  }, [iframeLoaded, showIframe]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Build the iframe URL with user info if available
  const getIframeUrl = () => {
    const params = new URLSearchParams({
      autoStart: "true",
    });
    if (userInfo?.email) params.set("email", userInfo.email);
    if (userInfo?.phone) params.set("phone", userInfo.phone);
    if (userInfo?.firstName) params.set("name", userInfo.firstName);
    return `${LIVEAVATAR_APP_URL}?${params.toString()}`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Popup container */}
      <div
        className="relative w-[95vw] max-w-2xl h-[80vh] max-h-[700px] bg-[#0b1120] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={JUNE_UPPER}
              alt="Sandy"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="text-white text-sm font-semibold">
                Sandy Beach Live!
              </span>
              <span className="text-[#0d9488] text-xs ml-2">
                AI-Powered
              </span>
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

        {/* Iframe container */}
        <div className="flex-1 relative">
          {/* Loading overlay that fades out when iframe loads */}
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
              <p className="text-white/60 text-sm">Sandy is Coming...</p>
              <div className="flex justify-center gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {showIframe && (
            <iframe
              ref={iframeRef}
              src={getIframeUrl()}
              className={`w-full h-full border-0 transition-opacity duration-700 ${
                fadeIn ? "opacity-100" : "opacity-0"
              }`}
              allow="camera; microphone; autoplay; fullscreen"
              onLoad={() => setIframeLoaded(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
