'use client';

import { memo, useEffect, useState } from 'react';
import { Icon as RadFlowIcon } from '@radflow/ui/Icon';
import * as PhosphorIcons from '@phosphor-icons/react';

type PhosphorIconName = keyof typeof PhosphorIcons;
type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface ThemeIconProps {
  /** Icon name - will be mapped to theme-appropriate icon */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Phosphor weight (only used for Phosphor icons) */
  weight?: PhosphorWeight;
}

// Map common icon names to Phosphor equivalents
const PHOSPHOR_MAP: Record<string, PhosphorIconName> = {
  // Navigation & actions
  'chevron-down': 'CaretDown',
  'chevron-up': 'CaretUp',
  'chevron-left': 'CaretLeft',
  'chevron-right': 'CaretRight',
  close: 'X',
  checkmark: 'Check',
  plus: 'Plus',
  minus: 'Minus',
  refresh: 'ArrowClockwise',
  refresh1: 'ArrowClockwise',
  search: 'MagnifyingGlass',
  filter: 'Funnel',
  edit: 'PencilSimple',
  delete: 'Trash',
  copy: 'Copy',
  paste: 'ClipboardText',

  // Objects
  cube: 'Cube',
  folder: 'Folder',
  file: 'File',
  image: 'Image',
  document: 'FileText',
  code: 'Code',
  terminal: 'Terminal',

  // UI elements
  menu: 'List',
  'dots-vertical': 'DotsThreeVertical',
  'dots-horizontal': 'DotsThree',
  grip: 'DotsSixVertical',
  'external-link': 'ArrowSquareOut',
  link: 'Link',

  // Status & feedback
  info: 'Info',
  'info-filled': 'Info',
  warning: 'Warning',
  error: 'WarningCircle',
  success: 'CheckCircle',
  question: 'Question',

  // Media
  play: 'Play',
  pause: 'Pause',
  stop: 'Stop',

  // Settings
  settings: 'Gear',
  'settings-cog': 'Gear',
  sliders: 'Sliders',

  // Misc
  eye: 'Eye',
  'eye-off': 'EyeSlash',
  lock: 'Lock',
  unlock: 'LockOpen',
  star: 'Star',
  heart: 'Heart',
  bookmark: 'BookmarkSimple',
  electric: 'Lightning',
  lightning: 'Lightning',
  sun: 'Sun',
  moon: 'Moon',
  'full-screen': 'ArrowsOut',
  expand: 'ArrowsOut',
  collapse: 'ArrowsIn',
};

interface ThemeConfig {
  iconLibrary?: string;
  iconStyle?: string;
}

// Cache for theme detection to avoid repeated fetches
let cachedThemeConfig: ThemeConfig | null = null;
let configPromise: Promise<ThemeConfig> | null = null;

async function getThemeConfig(): Promise<ThemeConfig> {
  if (cachedThemeConfig) return cachedThemeConfig;
  if (configPromise) return configPromise;

  configPromise = fetch('/api/devtools/icons')
    .then((res) => res.json())
    .then((data) => {
      cachedThemeConfig = {
        iconLibrary: data.iconLibrary?.library,
        iconStyle: data.iconLibrary?.style,
      };
      return cachedThemeConfig;
    })
    .catch(() => {
      cachedThemeConfig = {};
      return cachedThemeConfig;
    });

  return configPromise;
}

function ThemeIconComponent({ name, size = 20, className = '', weight }: ThemeIconProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(cachedThemeConfig);

  useEffect(() => {
    if (!cachedThemeConfig) {
      getThemeConfig().then(setThemeConfig);
    }
  }, []);

  // While loading, show placeholder
  if (!themeConfig) {
    return (
      <span
        className={className}
        style={{
          width: size,
          height: size,
          display: 'inline-block',
        }}
      />
    );
  }

  // Use Phosphor icons for Phase theme
  if (themeConfig.iconLibrary?.toLowerCase() === 'phosphor') {
    const phosphorName = PHOSPHOR_MAP[name] || 'Circle';
    const PhosphorComponent = PhosphorIcons[phosphorName] as React.ComponentType<{
      size?: number;
      weight?: PhosphorWeight;
      className?: string;
    }>;

    if (PhosphorComponent) {
      const iconWeight = weight || (themeConfig.iconStyle as PhosphorWeight) || 'regular';
      return <PhosphorComponent size={size} weight={iconWeight} className={className} />;
    }

    // Fallback to Circle if icon not found
    return <PhosphorIcons.Circle size={size} weight="regular" className={className} />;
  }

  // Default: use RadFlow Icon (SVG-based)
  return <RadFlowIcon name={name} size={size} className={className} />;
}

export const ThemeIcon = memo(ThemeIconComponent);
export type { ThemeIconProps };
