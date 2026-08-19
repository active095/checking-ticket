import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  textColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  textColor,
}) => {
  const [customLogo] = useState<string | null>(() => {
    return localStorage.getItem('checking_ticket_custom_logo');
  });

  // If user uploaded a custom logo image file in localStorage, render it
  if (customLogo) {
    const heightClass = {
      sm: 'h-7',
      md: 'h-9',
      lg: 'h-12',
      xl: 'h-16',
    }[size];

    return (
      <img
        src={customLogo}
        alt="Checking Ticket Logo"
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto object-contain ${className}`}
      />
    );
  }

  // Vector SVG rendering matching exact typographic logo uploaded
  // Top: "Checking" (Medium/Bold Blue), Bottom: "TICKET" (Heavy Bold Blue)
  const dimensions = {
    sm: { width: 110, height: 38 },
    md: { width: 140, height: 48 },
    lg: { width: 180, height: 62 },
    xl: { width: 240, height: 82 },
  }[size];

  return (
    <div className={`inline-flex flex-col justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 85"
        width={dimensions.width}
        height={dimensions.height}
        className="w-auto h-auto max-h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Top: Checking */}
        <text
          x="120"
          y="34"
          textAnchor="middle"
          fill={textColor || '#0062FF'}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif"
          fontWeight="600"
          fontSize="36"
          letterSpacing="-0.5"
        >
          Checking
        </text>

        {/* Bottom: TICKET */}
        <text
          x="120"
          y="78"
          textAnchor="middle"
          fill={textColor || '#0052FF'}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="1"
        >
          TICKET
        </text>
      </svg>

      {showSubtitle && (
        <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-1 text-center">
          Validation & Activation de codes
        </span>
      )}
    </div>
  );
};
