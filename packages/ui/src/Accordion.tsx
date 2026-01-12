import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { createSafeContext } from './hooks/createSafeContext';

// ============================================================================
// Types
// ============================================================================

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  type: AccordionType;
  expandedItems: Set<string>;
  toggleItem: (value: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  isExpanded: boolean;
}

// ============================================================================
// Context
// ============================================================================

const [AccordionContext, useAccordionContext] = createSafeContext<AccordionContextValue>('Accordion');
const [AccordionItemContext, useAccordionItemContext] = createSafeContext<AccordionItemContextValue>('AccordionItem');

// ============================================================================
// Accordion Root
// ============================================================================

interface AccordionProps {
  /** Allow single or multiple items to be expanded at once */
  type?: AccordionType;
  /** Default expanded item(s) */
  defaultValue?: string | string[];
  /** Controlled expanded value(s) */
  value?: string | string[];
  /** Callback when expanded items change */
  onValueChange?: (value: string | string[]) => void;
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function Accordion({ type = 'single', defaultValue, value: controlledValue, onValueChange, className = '', children }: AccordionProps) {
  const getInitialExpanded = (): Set<string> => {
    const initial = controlledValue ?? defaultValue;
    if (!initial) return new Set();
    return new Set(Array.isArray(initial) ? initial : [initial]);
  };

  const [expandedItems, setExpandedItems] = useState<Set<string>>(getInitialExpanded);

  // Use controlled value directly if provided, otherwise use internal state
  const activeExpandedItems = controlledValue !== undefined
    ? new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : expandedItems;

  const toggleItem = useCallback(
    (itemValue: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);

        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          if (type === 'single') {
            next.clear();
          }
          next.add(itemValue);
        }

        if (onValueChange) {
          const newValue = Array.from(next);
          onValueChange(type === 'single' ? newValue[0] ?? '' : newValue);
        }

        return next;
      });
    },
    [type, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ type, expandedItems: activeExpandedItems, toggleItem }}>
      <div className={`space-y-0 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// ============================================================================
// Accordion Item
// ============================================================================

interface AccordionItemProps {
  /** Unique value for this item */
  value: string;
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function AccordionItem({ value, className = '', children }: AccordionItemProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.has(value);

  return (
    <AccordionItemContext.Provider value={{ value, isExpanded }}>
      <div
        className={`
          border border-edge-primary
          bg-surface-primary
          -mt-px first:mt-0
          ${className}
        `.trim()}
        data-state={isExpanded ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// ============================================================================
// Accordion Trigger
// ============================================================================

interface AccordionTriggerProps {
  /** Additional className */
  className?: string;
  /** Children (header content) */
  children: React.ReactNode;
}

export function AccordionTrigger({ className = '', children }: AccordionTriggerProps) {
  const { toggleItem } = useAccordionContext();
  const { value, isExpanded } = useAccordionItemContext();

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={`
        w-full flex items-center justify-between
        px-4 py-3
        font-joystix text-sm uppercase text-content-primary
        bg-transparent
        hover:bg-surface-primary-foreground/5
        transition-colors
        cursor-pointer
        ${className}
      `.trim()}
      aria-expanded={isExpanded}
    >
      <span>{children}</span>
      <Icon
        name={isExpanded ? 'minus' : 'plus'}
        size="sm"
        className="select-none"
        aria-hidden="true"
      />
    </button>
  );
}

// ============================================================================
// Accordion Content
// ============================================================================

interface AccordionContentProps {
  /** Additional className */
  className?: string;
  /** Children (content) */
  children: React.ReactNode;
}

export function AccordionContent({ className = '', children }: AccordionContentProps) {
  const { isExpanded } = useAccordionItemContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (isExpanded) {
      // Expanding: measure content height and animate
      const scrollHeight = content.scrollHeight;
      setHeight(scrollHeight);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setHeight(undefined);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // Collapsing: set current height first, then animate to 0
      const scrollHeight = content.scrollHeight;
      setHeight(scrollHeight);
      setIsAnimating(true);

      requestAnimationFrame(() => {
        setHeight(0);
      });

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Wrap plain text children in a paragraph for proper typography
  const renderContent = () => {
    // If children is a single string, wrap it in a paragraph
    if (typeof children === 'string' && children.trim()) {
      return <p>{children}</p>;
    }
    // Otherwise, render children as-is
    return children;
  };

  return (
    <div
      className={`
        overflow-hidden
        transition-[height] duration-200 ease-out
        ${className}
      `.trim()}
      style={{
        height: isAnimating ? height : isExpanded ? 'auto' : 0,
      }}
      aria-hidden={!isExpanded}
    >
      <div ref={contentRef} className="px-4 pb-4 text-content-primary">
        {renderContent()}
      </div>
    </div>
  );
}

export default Accordion;
export type { AccordionType, AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps };
