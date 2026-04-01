/**
 * DataDriver Animated Logo
 * Recreates the DD arrow/circuit logo as an animated SVG.
 * The lines pulse and flow with a gradient animation.
 * Props:
 *   size: "sm" (nav), "lg" (hero)
 *   animate: whether to run the flowing animation
 */

interface LogoProps {
  size?: "sm" | "lg";
  animate?: boolean;
  className?: string;
}

export default function DataDriverLogo({ size = "sm", animate = false, className = "" }: LogoProps) {
  const dim = size === "lg" ? 200 : 32;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Static gradient */}
        <linearGradient id="logoGradStatic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="40%" stopColor="#0d9488" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Animated flowing gradient */}
        <linearGradient id="logoGradFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee">
            {animate && <animate attributeName="stopColor" values="#22d3ee;#0d9488;#eab308;#22d3ee" dur="3s" repeatCount="indefinite" />}
          </stop>
          <stop offset="50%" stopColor="#0d9488">
            {animate && <animate attributeName="stopColor" values="#0d9488;#eab308;#22d3ee;#0d9488" dur="3s" repeatCount="indefinite" />}
          </stop>
          <stop offset="100%" stopColor="#eab308">
            {animate && <animate attributeName="stopColor" values="#eab308;#22d3ee;#0d9488;#eab308" dur="3s" repeatCount="indefinite" />}
          </stop>
        </linearGradient>

        {/* Glow filter for hero */}
        {animate && (
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}

        {/* Dash animation for flowing lines */}
        {animate && (
          <style>{`
            .dd-line-flow {
              stroke-dasharray: 8 4;
              animation: ddDashFlow 1.5s linear infinite;
            }
            .dd-line-flow-slow {
              stroke-dasharray: 12 6;
              animation: ddDashFlow 2.5s linear infinite;
            }
            .dd-pulse {
              animation: ddPulse 2s ease-in-out infinite;
            }
            @keyframes ddDashFlow {
              to { stroke-dashoffset: -24; }
            }
            @keyframes ddPulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
          `}</style>
        )}
      </defs>

      <g filter={animate ? "url(#logoGlow)" : undefined}>
        {/* Main D shape — outer curve */}
        <path
          d="M 20 15 L 20 85 L 45 85 C 65 85 78 70 78 50 C 78 30 65 15 45 15 Z"
          stroke={animate ? "url(#logoGradFlow)" : "url(#logoGradStatic)"}
          strokeWidth={size === "lg" ? 3 : 4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? "dd-line-flow-slow" : ""}
        />

        {/* Inner D horizontal lines — circuit board effect */}
        <line x1="28" y1="35" x2="55" y2="35"
          stroke={animate ? "url(#logoGradFlow)" : "url(#logoGradStatic)"}
          strokeWidth={size === "lg" ? 2.5 : 3}
          strokeLinecap="round"
          className={animate ? "dd-line-flow" : ""}
        />
        <line x1="28" y1="50" x2="60" y2="50"
          stroke={animate ? "url(#logoGradFlow)" : "url(#logoGradStatic)"}
          strokeWidth={size === "lg" ? 2.5 : 3}
          strokeLinecap="round"
          className={animate ? "dd-line-flow" : ""}
        />
        <line x1="28" y1="65" x2="55" y2="65"
          stroke={animate ? "url(#logoGradFlow)" : "url(#logoGradStatic)"}
          strokeWidth={size === "lg" ? 2.5 : 3}
          strokeLinecap="round"
          className={animate ? "dd-line-flow" : ""}
        />

        {/* Arrow pointing right — the "Driver" part */}
        <path
          d="M 55 35 L 80 50 L 55 65"
          stroke="#eab308"
          strokeWidth={size === "lg" ? 3 : 4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? "dd-pulse" : ""}
        />

        {/* Small circuit dots at line ends */}
        <circle cx="28" cy="35" r={size === "lg" ? 2 : 2.5}
          fill="#22d3ee"
          className={animate ? "dd-pulse" : ""}
        />
        <circle cx="28" cy="50" r={size === "lg" ? 2 : 2.5}
          fill="#0d9488"
          className={animate ? "dd-pulse" : ""}
        />
        <circle cx="28" cy="65" r={size === "lg" ? 2 : 2.5}
          fill="#eab308"
          className={animate ? "dd-pulse" : ""}
        />

        {/* Arrow tip dot */}
        <circle cx="80" cy="50" r={size === "lg" ? 2.5 : 2.5}
          fill="#eab308"
          className={animate ? "dd-pulse" : ""}
        />
      </g>
    </svg>
  );
}
