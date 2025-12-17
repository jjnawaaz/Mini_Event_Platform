import React from "react";

const Logo = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="url(#glow)"
        strokeWidth="6"
        opacity="0.9"
      />

      <circle cx="60" cy="60" r="26" fill="url(#core)" />

      <circle cx="78" cy="42" r="6" fill="#EC4899" />

      <defs>
        <linearGradient id="glow" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        <radialGradient
          id="core"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(60 60) scale(26)"
        >
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Logo;
