'use client';

import { memo } from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { useIconConfig } from './IconContext';

/** Semantic size options for icons */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/** Size mapping from semantic names to pixels */
export const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

interface IconProps {
  /** Icon name - use Phosphor icon names (kebab-case) */
  name: string;
  /** Icon size - semantic (sm, md, lg, xl) or pixels */
  size?: IconSize | number;
  /** Additional CSS classes for styling (use text-* for color) */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

// Map common/legacy icon names to Phosphor component names
// Phase theme uses Phosphor icons exclusively
const PHOSPHOR_MAP: Record<string, string> = {
  // Navigation & actions
  'chevron-down': 'CaretDown',
  'chevron-up': 'CaretUp',
  'chevron-left': 'CaretLeft',
  'chevron-right': 'CaretRight',
  close: 'X',
  checkmark: 'Check',
  check: 'Check',
  plus: 'Plus',
  add: 'Plus',
  minus: 'Minus',
  refresh: 'ArrowClockwise',
  refresh1: 'ArrowClockwise',
  search: 'MagnifyingGlass',
  filter: 'Funnel',
  edit: 'PencilSimple',
  pencil: 'PencilSimple',
  delete: 'Trash',
  trash: 'Trash',
  copy: 'Copy',
  'copy-to-clipboard': 'Copy',
  'copied-to-clipboard': 'Check',
  paste: 'ClipboardText',
  download: 'DownloadSimple',
  upload: 'UploadSimple',

  // Arrows
  'arrow-right': 'ArrowRight',
  'arrow-left': 'ArrowLeft',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'go-forward': 'ArrowRight',
  'arrow-up-right': 'ArrowUpRight',

  // Objects
  cube: 'Cube',
  folder: 'Folder',
  'folder-open': 'FolderOpen',
  'folder-closed': 'Folder',
  file: 'File',
  image: 'Image',
  document: 'FileText',
  code: 'Code',
  terminal: 'Terminal',

  // UI elements
  menu: 'List',
  hamburger: 'List',
  'dots-vertical': 'DotsThreeVertical',
  'dots-horizontal': 'DotsThree',
  grip: 'DotsSixVertical',
  'external-link': 'ArrowSquareOut',
  external: 'ArrowSquareOut',
  expand: 'ArrowsOut',
  'full-screen': 'ArrowsOut',
  collapse: 'ArrowsIn',
  link: 'Link',

  // Status & feedback
  info: 'Info',
  'info-filled': 'Info',
  warning: 'Warning',
  error: 'WarningCircle',
  success: 'CheckCircle',
  question: 'Question',
  'question-filled': 'Question',

  // Media
  play: 'Play',
  pause: 'Pause',
  stop: 'Stop',
  'skip-forward': 'SkipForward',
  'skip-back': 'SkipBack',

  // Settings
  settings: 'Gear',
  'settings-cog': 'Gear',
  sliders: 'Sliders',

  // Misc
  eye: 'Eye',
  'eye-off': 'EyeSlash',
  'eye-hidden': 'EyeSlash',
  lock: 'Lock',
  'lock-closed': 'Lock',
  unlock: 'LockOpen',
  'lock-open': 'LockOpen',
  star: 'Star',
  trophy: 'Trophy',
  heart: 'Heart',
  bookmark: 'BookmarkSimple',
  electric: 'Lightning',
  lightning: 'Lightning',
  sun: 'Sun',
  moon: 'Moon',
  globe: 'Globe',
  home: 'House',
  home2: 'House',
  user: 'User',
  usericon: 'User',
  'envelope-closed': 'Envelope',
  email: 'Envelope',
  clock: 'Clock',
  calendar: 'Calendar',
  save: 'FloppyDisk',
  print: 'Printer',
  share: 'ShareNetwork',
  cut: 'Scissors',
};

/**
 * Convert kebab-case to PascalCase for Phosphor icons
 * e.g., "arrow-right" -> "ArrowRight"
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function IconComponent({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}: IconProps) {
  const iconConfig = useIconConfig();
  const pixelSize = typeof size === 'string' ? ICON_SIZES[size] : size;

  // Default to regular weight for Phase theme
  const weight = iconConfig?.weight || 'regular';

  // Look up in map first, then try PascalCase conversion
  const phosphorName = PHOSPHOR_MAP[name] || toPascalCase(name);

  // Get the icon component from Phosphor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PhosphorComponent = (PhosphorIcons as any)[phosphorName] as React.ComponentType<PhosphorIconProps> | undefined;

  if (PhosphorComponent) {
    return (
      <PhosphorComponent
        size={pixelSize}
        weight={weight}
        className={className}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
      />
    );
  }

  // Fallback to Circle if icon not found
  console.warn(`Icon "${name}" not found in Phosphor. Tried: ${phosphorName}`);
  return (
    <PhosphorIcons.Circle
      size={pixelSize}
      weight={weight}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
}

export const Icon = memo(IconComponent);
export type { IconProps };
