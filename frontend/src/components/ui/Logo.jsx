import React from 'react';

export default function Logo({ className = "", isDark = false }) {
  // Theme Colors
  const goldColor = "#A18A70";
  const darkColor = isDark ? "#F5F1E9" : "#111110";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 🔥 PROFESSIONAL ZX MONOGRAM (Exact Design) */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 hover:scale-105"
      >
        {/* The Overlapping Z & X Lines */}
        <g stroke={goldColor} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter">
          {/* Top horizontal line of Z (shared with top of X) */}
          <path d="M 20 20 L 80 20" />
          
          {/* Diagonal of Z (going down-left) */}
          <path d="M 80 20 L 20 80" />
          
          {/* Bottom horizontal line of Z (shared with bottom of X) */}
          <path d="M 20 80 L 80 80" />
          
          {/* The X's cross lines (Overlapping) */}
          <path d="M 50 20 L 80 80" />
          <path d="M 80 20 L 50 80" />
        </g>
      </svg>

      {/* Divider Line */}
      <span className="w-[1px] h-6 bg-[#A18A70]/40 hidden sm:block"></span>

      {/* ZORROXO Text */}
      <span 
        style={{ color: darkColor }} 
        className="font-heading text-xl sm:text-2xl tracking-[0.25em] font-medium hidden sm:block transition-colors duration-500"
      >
        ZORROXO
      </span>
    </div>
  );
}