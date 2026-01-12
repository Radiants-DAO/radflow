'use client';

import { memo, useEffect, useState, ComponentType } from 'react';
import { useIconConfig, PhosphorWeight } from './IconContext';

// Dynamically import Phosphor icons - will be tree-shaken if not used
let PhosphorIcons: Record<string, ComponentType<{ size?: number; weight?: PhosphorWeight; className?: string }>> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PhosphorIcons = require('@phosphor-icons/react');
} catch {
  // Phosphor not installed - will use SVG fallback
}

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
  /** Icon name (filename without .svg extension) */
  name: string;
  /** Icon size - semantic (sm, md, lg, xl) or pixels */
  size?: IconSize | number;
  /** Additional CSS classes for styling (use text-* for color) */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Base path for icons (default: /assets/icons) */
  basePath?: string;
}

// Icon name aliases for backward compatibility (SVG icon names)
const ICON_ALIASES: Record<string, string> = {
  refresh: 'refresh1',
  settings: 'settings-cog',
  lightning: 'electric',
  'information-circle': 'info-filled',
  expand: 'full-screen',
  collapse: 'minus',
  'checkmark-filled': 'checkmark',
  // Common icon aliases
  add: 'plus',
  edit: 'pencil',
  external: 'expand',
  'arrow-right': 'go-forward',
  email: 'envelope-closed',
  user: 'usericon',
  star: 'trophy',
  menu: 'hamburger',
  home: 'home2',
  paste: 'copy-to-clipboard',
};

// Map common icon names to Phosphor component names
const PHOSPHOR_MAP: Record<string, string> = {
  // Navigation & actions
  'chevron-down': 'CaretDown',
  'chevron-up': 'CaretUp',
  'chevron-left': 'CaretLeft',
  'chevron-right': 'CaretRight',
  close: 'X',
  checkmark: 'Check',
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
  paste: 'ClipboardText',
  download: 'DownloadSimple',
  upload: 'UploadSimple',

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
  'go-forward': 'ArrowRight',
  'arrow-right': 'ArrowRight',
  'envelope-closed': 'Envelope',
  email: 'Envelope',
  clock: 'Clock',
  calendar: 'Calendar',
  save: 'FloppyDisk',
  print: 'Printer',
  share: 'ShareNetwork',
  cut: 'Scissors',
};

function IconComponent({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  basePath = '/assets/icons',
}: IconProps) {
  const iconConfig = useIconConfig();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const pixelSize = typeof size === 'string' ? ICON_SIZES[size] : size;
  const resolvedName = ICON_ALIASES[name] || name;

  // Use Phosphor icons if configured and available
  const usePhosphor = iconConfig?.library === 'phosphor' && PhosphorIcons;

  useEffect(() => {
    // Skip SVG fetch if using Phosphor
    if (usePhosphor) return;

    const iconPath = `${basePath}/${resolvedName}.svg`;

    fetch(iconPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load icon: ${name} (${res.status})`);
        }
        return res.text();
      })
      .then((text) => {
        const cleanedText = text.replace(/<\?xml[^>]*\?>\s*/i, '').trim();

        if (!cleanedText.startsWith('<svg')) {
          throw new Error(`Invalid icon format: ${name}`);
        }

        const widthMatch = cleanedText.match(/width=["'](\d+)["']/i);
        const heightMatch = cleanedText.match(/height=["'](\d+)["']/i);
        const originalWidth = widthMatch ? parseInt(widthMatch[1]) : 16;
        const originalHeight = heightMatch ? parseInt(heightMatch[1]) : 16;

        let svgProcessed = cleanedText.replace(/\s+(width|height)=["'][^"']*["']/gi, '');

        svgProcessed = svgProcessed.replace(/fill=["'](?!none)[^"']*["']/gi, 'fill="currentColor"');
        svgProcessed = svgProcessed.replace(
          /stroke=["'](?!none)[^"']*["']/gi,
          'stroke="currentColor"'
        );

        if (!svgProcessed.includes('viewBox=')) {
          svgProcessed = svgProcessed.replace(
            /<svg([^>]*)>/,
            `<svg$1 viewBox="0 0 ${originalWidth} ${originalHeight}">`
          );
        }

        const svgWithSize = svgProcessed.replace(
          /<svg([^>]*)>/,
          `<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display: block; fill: currentColor;">`
        );
        setSvgContent(svgWithSize);
      })
      .catch((err) => {
        console.error(`Failed to load icon: ${name} (resolved: ${resolvedName})`, err);
      });
  }, [name, resolvedName, basePath, usePhosphor]);

  // Render Phosphor icon
  if (usePhosphor && PhosphorIcons) {
    const phosphorName = PHOSPHOR_MAP[name] || PHOSPHOR_MAP[resolvedName] || 'Circle';
    const PhosphorComponent = PhosphorIcons[phosphorName];

    if (PhosphorComponent) {
      return (
        <PhosphorComponent
          size={pixelSize}
          weight={iconConfig.weight || 'regular'}
          className={className}
          aria-label={ariaLabel}
          aria-hidden={!ariaLabel}
        />
      );
    }

    // Fallback to Circle if icon not found in map
    const FallbackIcon = PhosphorIcons.Circle;
    if (FallbackIcon) {
      return (
        <FallbackIcon
          size={pixelSize}
          weight={iconConfig.weight || 'regular'}
          className={className}
          aria-label={ariaLabel}
          aria-hidden={!ariaLabel}
        />
      );
    }
  }

  // SVG loading placeholder
  if (!svgContent) {
    return (
      <span
        className={className}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
        style={{
          width: pixelSize,
          height: pixelSize,
          display: 'inline-block',
        }}
      />
    );
  }

  // Render SVG icon
  return (
    <span
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      style={{
        width: pixelSize,
        height: pixelSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 0,
        color: 'inherit',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export const Icon = memo(IconComponent);
export type { IconProps };
