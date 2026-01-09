import React, { ElementType } from 'react';

// ============================================================================
// Types
// ============================================================================

interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Navigation href (optional for current/last item) */
  href?: string;
}

interface BreadcrumbsProps<LinkComponent extends ElementType = 'a'> {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator character */
  separator?: string;
  /** Custom Link component (e.g., Next.js Link) */
  LinkComponent?: LinkComponent;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Breadcrumbs component - Navigation hierarchy
 * Supports custom Link component for framework integration
 */
export function Breadcrumbs<LinkComponent extends ElementType = 'a'>({ items, separator = '/', LinkComponent, className = '' }: BreadcrumbsProps<LinkComponent>) {
  if (items.length === 0) return null;

  const Link = LinkComponent || 'a';

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`.trim()}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Separator */}
              {index > 0 && (
                <span className="font-mondwest text-base text-content-primary/40" aria-hidden="true">
                  {separator}
                </span>
              )}

              {/* Item */}
              {item.href && !isLast ? (
                <Link href={item.href} className="font-mondwest text-base text-content-primary/60 hover:text-content-primary hover:underline transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`
                    font-mondwest text-base
                    ${isLast ? 'text-content-primary font-semibold' : 'text-content-primary/60'}
                  `.trim()}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
export type { BreadcrumbItem, BreadcrumbsProps };
