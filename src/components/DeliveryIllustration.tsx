export function DeliveryIllustration() {
  return (
    <svg
      viewBox="0 0 620 400"
      className="w-full h-auto max-w-[560px] mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground line */}
      <line x1="30" y1="300" x2="590" y2="300" stroke="#c9caff" strokeWidth="2" />

      {/* Delivery van (light gray body) */}
      <g>
        {/* Cargo */}
        <rect x="220" y="150" width="240" height="130" rx="10" fill="#eeeff7" />
        {/* Cab */}
        <path
          d="M460 170 L520 170 Q555 170 555 210 L555 280 L460 280 Z"
          fill="#e2e3ff"
        />
        {/* Window */}
        <rect x="475" y="180" width="45" height="35" rx="4" fill="#ffffff" />
        {/* Details on cargo */}
        <rect x="235" y="170" width="60" height="60" rx="4" fill="#dddef2" />
        <rect x="310" y="170" width="60" height="60" rx="4" fill="#dddef2" />
        <rect x="385" y="170" width="60" height="60" rx="4" fill="#dddef2" />
        {/* Wheels */}
        <circle cx="275" cy="295" r="24" fill="#1e293b" />
        <circle cx="275" cy="295" r="10" fill="#ffffff" />
        <circle cx="505" cy="295" r="24" fill="#1e293b" />
        <circle cx="505" cy="295" r="10" fill="#ffffff" />
      </g>

      {/* Character 1 — sitting at counter (left) */}
      <g transform="translate(60, 175)">
        {/* Head */}
        <circle cx="30" cy="20" r="16" fill="#2b1b1b" />
        {/* Body */}
        <path d="M15 40 L45 40 L50 90 L10 90 Z" fill="#4a45fe" />
        {/* Legs */}
        <rect x="14" y="90" width="14" height="35" fill="#1e293b" />
        <rect x="32" y="90" width="14" height="35" fill="#1e293b" />
      </g>

      {/* Character 2 — standing serving (left) */}
      <g transform="translate(110, 145)">
        {/* Hair */}
        <path d="M25 5 Q45 -5 55 15 Q52 30 55 40 L20 40 Q15 25 25 5 Z" fill="#2b1b1b" />
        {/* Head */}
        <circle cx="38" cy="25" r="14" fill="#c98467" />
        {/* Body */}
        <path d="M25 40 L52 40 L58 100 L18 100 Z" fill="#4a45fe" />
        {/* Legs */}
        <rect x="22" y="100" width="14" height="45" fill="#1e293b" />
        <rect x="40" y="100" width="14" height="45" fill="#1e293b" />
      </g>

      {/* Counter table */}
      <rect x="35" y="270" width="150" height="10" fill="#94a3b8" />
      <rect x="45" y="280" width="6" height="20" fill="#64748b" />
      <rect x="170" y="280" width="6" height="20" fill="#64748b" />

      {/* Character 3 — deliverer with bottles (right) */}
      <g transform="translate(360, 155)">
        {/* Head */}
        <circle cx="20" cy="20" r="14" fill="#c98467" />
        {/* Hair */}
        <path d="M8 12 Q20 2 32 12 L30 20 L10 20 Z" fill="#2b1b1b" />
        {/* Body */}
        <path d="M6 34 L34 34 L40 105 L0 105 Z" fill="#e2e3ff" />
        {/* Legs */}
        <rect x="6" y="105" width="12" height="40" fill="#1e293b" />
        <rect x="22" y="105" width="12" height="40" fill="#1e293b" />
        {/* Arm holding bottle */}
        <rect x="35" y="55" width="20" height="12" rx="3" fill="#e2e3ff" transform="rotate(-15 45 61)" />
        {/* Bottle */}
        <rect x="55" y="45" width="10" height="24" rx="2" fill="#7d33f9" />
      </g>

      {/* Character 4 — retailer receiving (right) */}
      <g transform="translate(420, 155)">
        {/* Head */}
        <circle cx="20" cy="20" r="14" fill="#2b1b1b" />
        {/* Body */}
        <path d="M6 34 L34 34 L40 105 L0 105 Z" fill="#4a45fe" />
        {/* Legs */}
        <rect x="6" y="105" width="12" height="40" fill="#1e293b" />
        <rect x="22" y="105" width="12" height="40" fill="#1e293b" />
      </g>
    </svg>
  );
}
