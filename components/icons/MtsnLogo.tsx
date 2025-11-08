import React from 'react';

// A simplified SVG representation of the MTsN 1 Ciamis logo
export const MtsnLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg
    className={className}
    viewBox="0 0 200 190"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Logo MTsN 1 Ciamis"
    role="img"
  >
    <defs>
      <clipPath id="pentagonClipPath">
        <path d="M100 0 L200 70 L162 190 L38 190 L0 70 Z" />
      </clipPath>
    </defs>
    
    <g clipPath="url(#pentagonClipPath)">
      {/* Left yellow part */}
      <rect x="0" y="0" width="100" height="190" fill="#FFEB3B" />
      {/* Right blue part */}
      <rect x="100" y="0" width="100" height="190" fill="#303F9F" />
    </g>

    {/* Central white elements */}
    <g fill="#FFFFFF" stroke="#000000" strokeWidth="3">
        {/* Beads */}
        <circle cx="50" cy="55" r="8" />
        <circle cx="35" cy="75" r="8" />
        <circle cx="35" cy="100" r="8" />
        <circle cx="50" cy="120" r="8" />
        <circle cx="70" cy="135" r="8" />
        {/* Leaves */}
        <ellipse cx="150" cy="55" rx="15" ry="8" transform="rotate(-30 150 55)" />
        <ellipse cx="165" cy="75" rx="15" ry="8" transform="rotate(-30 165 75)" />
        <ellipse cx="165" cy="100" rx="15" ry="8" transform="rotate(-30 165 100)" />
        <ellipse cx="150" cy="120" rx="15" ry="8" transform="rotate(-30 150 120)" />
        <ellipse cx="130" cy="135" rx="15" ry="8" transform="rotate(-30 130 135)" />
    </g>

    {/* Central black/white symbol (simplified) */}
    <g transform="translate(100 100) scale(1.2)">
        <path d="M0 -30 L-20 -10 L0 10 L20 -10 Z" fill="#000000"/>
        <path d="M-18 -8 L0 8 L18 -8 L0 -26 Z" fill="#FFFFFF"/>
        <path d="M-5 10 L5 10 L5 30 L-5 30 Z" fill="#000000"/>
        <path d="M-5 12 L5 12 L5 18 L-5 18 Z" fill="#FFFFFF"/>
    </g>
    
    {/* Border */}
    <path d="M100 0 L200 70 L162 190 L38 190 L0 70 Z" fill="none" stroke="black" strokeWidth="3" />
    
    {/* Text is omitted for clarity at small icon sizes */}
  </svg>
);
