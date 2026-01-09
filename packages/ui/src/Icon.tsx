import { memo, useEffect, useState } from 'react';

/** Semantic size options for icons */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/** Size mapping from semantic names to pixels */
export const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 24,
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

// Icon name aliases for backward compatibility
const ICON_ALIASES: Record<string, string> = {
  refresh: 'refresh1',
  settings: 'settings-cog',
  lightning: 'electric',
  'information-circle': 'info-filled',
  expand: 'full-screen',
  collapse: 'minus',
  'checkmark-filled': 'checkmark',
};

function IconComponent({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  basePath = '/assets/icons',
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const pixelSize = typeof size === 'string' ? ICON_SIZES[size] : size;
  const resolvedName = ICON_ALIASES[name] || name;
  const iconPath = `${basePath}/${resolvedName}.svg`;

  useEffect(() => {
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
          `<svg$1 width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display: block; fill: currentColor;">`
        );
        setSvgContent(svgWithSize);
      })
      .catch((err) => {
        console.error(`Failed to load icon: ${name} (resolved: ${resolvedName})`, err);
      });
  }, [name, resolvedName, iconPath]);

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
