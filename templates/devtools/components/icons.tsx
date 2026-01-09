/**
 * Icon Components for RadTools
 * SVG icons copied from radOS reference
 * 
 * @deprecated These icon components are deprecated. Use the Icon component from @/components/icons instead.
 * This file is kept for backward compatibility during migration but will be removed in a future version.
 * 
 * Migration guide:
 * - Replace <CloseIcon /> with <Icon name="close" />
 * - Replace <CopyIcon /> with <Icon name="copy" />
 * - Replace <CopiedIcon /> with <Icon name="checkmark-filled" />
 * - Replace <HelpIcon /> with <Icon name="question" />
 */

import React from 'react';

// ============================================================================
// Standard Icon Sizes
// ============================================================================

export const ICON_SIZE = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

interface IconProps {
  className?: string;
  size?: number | string;
}

// ============================================================================
// UI Icons
// ============================================================================

export function CloseIcon({ className = '', size = 10 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 10 11" 
      fill="none" 
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M1.11111 0.5H0V1.61111H1.11111V2.72222H2.22222V3.83333H3.33333V4.94444H4.44444V6.05556H3.33333V7.16667H2.22222V8.27778H1.11111V9.38889H0V10.5H1.11111H2.22222V9.38889H3.33333V8.27778H4.44444V7.16667H5.55556V8.27778H6.66667V9.38889H7.77778V10.5H8.88889H10V9.38889H8.88889V8.27778H7.77778V7.16667H6.66667V6.05556H5.55556V4.94444H6.66667V3.83333H7.77778V2.72222H8.88889V1.61111H10V0.5H8.88889H7.77778V1.61111H6.66667V2.72222H5.55556V3.83333H4.44444V2.72222H3.33333V1.61111H2.22222V0.5H1.11111Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export function CopyIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 28 28" 
      fill="none" 
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M8.71111 0H28V19.2889H19.2889V28H0V8.71111H8.71111V0ZM11 8.71111H19.2889V17H26V2.5H11V8.71111ZM17 11.5H2.5V25.5H17V11.5Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export function CopiedIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={typeof size === 'number' ? size * (20 / 26) : size} 
      viewBox="0 0 26 20" 
      fill="none" 
      className={className}
    >
      <path 
        d="M11.4187 11.4375H8.56875V8.5875H5.7V5.71875H2.85V8.5875H0V11.4375H2.85V14.2875H5.7V17.1563H8.56875V20.0062H11.4187V17.1563H14.2875V14.2875H17.1375V11.4375H19.9875V8.5875H22.8562V5.71875H25.7062V2.86875H22.8562V0H19.9875V2.86875H17.1375V5.71875H14.2875V8.5875H11.4187V11.4375Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export function HelpIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      className={className}
    >
      {/* Outer circle */}
      <path d="M5 0H11V2H5V0Z" fill="currentColor" />
      <path d="M3 2H5V4H3V2Z" fill="currentColor" />
      <path d="M11 2H13V4H11V2Z" fill="currentColor" />
      <path d="M2 4H4V6H2V4Z" fill="currentColor" />
      <path d="M12 4H14V6H12V4Z" fill="currentColor" />
      <path d="M0 5H2V11H0V5Z" fill="currentColor" />
      <path d="M14 5H16V11H14V5Z" fill="currentColor" />
      <path d="M2 10H4V12H2V10Z" fill="currentColor" />
      <path d="M12 10H14V12H12V10Z" fill="currentColor" />
      <path d="M3 12H5V14H3V12Z" fill="currentColor" />
      <path d="M11 12H13V14H11V12Z" fill="currentColor" />
      <path d="M5 14H11V16H5V14Z" fill="currentColor" />
      {/* Question mark */}
      <path d="M6 4H10V5H6V4Z" fill="currentColor" />
      <path d="M10 5H11V7H10V5Z" fill="currentColor" />
      <path d="M8 7H10V8H8V7Z" fill="currentColor" />
      <path d="M7 8H9V10H7V8Z" fill="currentColor" />
      <path d="M7 11H9V13H7V11Z" fill="currentColor" />
    </svg>
  );
}

export function ComponentsIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      {/* 2x2 grid of squares representing components */}
      <rect x="2" y="2" width="9" height="9" />
      <rect x="13" y="2" width="9" height="9" />
      <rect x="2" y="13" width="9" height="9" />
      <rect x="13" y="13" width="9" height="9" />
    </svg>
  );
}

export function ChevronIcon({ className = '', size = 8 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 8 10" 
      fill="none" 
      className={className}
    >
      <path 
        d="M7.21826 5.64286L5.91799 5.64286L5.91799 6.92857L4.64346 6.92857L4.64346 8.21429L3.35605 8.21429L3.35605 9.5L0.781248 9.5L0.781249 8.21429L2.06865 8.21429L2.06865 6.92857L3.35605 6.92857L3.35605 5.64286L4.64346 5.64286L4.64346 4.35714L3.35605 4.35714L3.35605 3.07143L2.06865 3.07143L2.06865 1.78572L0.78125 1.78571L0.78125 0.5L3.35606 0.5L3.35606 1.78572L4.64346 1.78572L4.64346 3.07143L5.91799 3.07143L5.91799 4.35714L7.21826 4.35714L7.21826 5.64286Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export default {
  CloseIcon,
  CopyIcon,
  CopiedIcon,
  HelpIcon,
  ComponentsIcon,
  ChevronIcon,
};

