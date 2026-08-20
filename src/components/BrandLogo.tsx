import React, { useState } from 'react';
import activationLogo from '../../assets/image/ok.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  textColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
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

  const heightClass = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  }[size];

  return (
    <img
      src={activationLogo}
      alt="Activation Logo"
      className={`${heightClass} w-auto object-contain ${className}`}
    />
  );

};
