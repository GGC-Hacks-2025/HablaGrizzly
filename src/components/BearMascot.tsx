"use client";

import React, { useEffect, useState } from 'react';

type BearProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function BearMascot({ size = 'md', className = '' }: BearProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if we're in dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Set up a mutation observer to detect changes to the classList
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'lg': return 'w-24 h-24';
      case 'md':
      default: return 'w-16 h-16';
    }
  };

  // GGC Green for the background
  const ggcGreen = "#00704a";

  // Primary bear color based on mode
  const bearFur = "#A67C52";
  const bearFurDark = "#704b2e";

  // Darker bear color for details
  const bearDetail = "#8B5A2B";
  const bearDetailDark = "#5D3A19";

  // Lighter bear color for the snout
  const bearSnout = "#C4976B";

  return (
    <div className={`${getSize()} ${className} overflow-hidden rounded-full bg-primary/10`}>
      {/* Bear SVG design inspired by GGC Grizzly */}
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background Circle - GGC Green */}
        <circle cx="50" cy="50" r="45" fill={ggcGreen} />

        {/* Bear head */}
        <circle cx="50" cy="50" r="40" fill={bearFur} />

        {/* Ears */}
        <circle cx="25" cy="25" r="10" fill={bearDetail} />
        <circle cx="75" cy="25" r="10" fill={bearDetail} />
        <circle cx="25" cy="25" r="5" fill={bearDetailDark} />
        <circle cx="75" cy="25" r="5" fill={bearDetailDark} />

        {/* Face */}
        <circle cx="35" cy="45" r="5" fill={bearDetailDark} /> {/* Left eye */}
        <circle cx="65" cy="45" r="5" fill={bearDetailDark} /> {/* Right eye */}

        {/* Shine in eyes */}
        <circle cx="37" cy="43" r="2" fill="#FFF" />
        <circle cx="67" cy="43" r="2" fill="#FFF" />

        {/* Snout */}
        <ellipse cx="50" cy="60" rx="15" ry="10" fill={bearSnout} />
        <ellipse cx="50" cy="65" rx="8" ry="5" fill={bearDetailDark} /> {/* Nose */}

        {/* Mouth - smiling */}
        <path d="M40,70 Q50,80 60,70" stroke={bearDetailDark} strokeWidth="2" fill="none" />

        {/* Small details */}
        <circle cx="45" cy="68" r="1" fill={bearDetailDark} /> {/* Left nostril */}
        <circle cx="55" cy="68" r="1" fill={bearDetailDark} /> {/* Right nostril */}
      </svg>
    </div>
  );
}
