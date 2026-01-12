import React, { createContext, useContext, useState } from 'react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

// ============================================================================
// Types
// ============================================================================

type TabsVariant = 'pill' | 'line' | 'manila';
type TabsOrientation = 'horizontal' | 'vertical';
type TabsLayout = 'text' | 'icon' | 'icon-text';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: TabsVariant;
  orientation: TabsOrientation;
  layout: TabsLayout;
  wrap: boolean;
}

interface TabsProps {
  /** Default active tab ID (uncontrolled mode) */
  defaultValue?: string;
  /** Active tab ID (controlled mode) */
  value?: string;
  /** Callback when tab changes (controlled mode) */
  onValueChange?: (value: string) => void;
  /** Visual variant */
  variant?: TabsVariant;
  /** Orientation of tabs */
  orientation?: TabsOrientation;
  /** Layout mode: text only, icon only, or icon with text */
  layout?: TabsLayout;
  /** Allow tabs to wrap (horizontal only) */
  wrap?: boolean;
  /** Tab components */
  children: React.ReactNode;
  /** Additional classes for container */
  className?: string;
}

interface TabListProps {
  /** TabTrigger components */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

interface TabTriggerProps {
  /** Unique tab ID */
  value: string;
  /** Tab label */
  children: React.ReactNode;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Tooltip text (auto-shown for icon-only mode) */
  tooltip?: string;
  /** Additional classes */
  className?: string;
}

interface TabContentProps {
  /** Tab ID this content belongs to */
  value: string;
  /** Content to render when active */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs provider');
  }
  return context;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Tabs container - provides context for tab state
 */
export function Tabs({ defaultValue, value, onValueChange, variant = 'pill', orientation = 'horizontal', layout = 'text', wrap = false, children, className = '' }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalValue;

  const setActiveTab = (newValue: string) => {
    if (isControlled) {
      onValueChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, orientation, layout, wrap }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/**
 * Container for tab triggers
 */
export function TabList({ children, className = '' }: TabListProps) {
  const { orientation, wrap, variant } = useTabsContext();

  const baseClasses = orientation === 'vertical' ? 'flex flex-col gap-1 overflow-y-auto' : wrap ? 'flex flex-wrap gap-1 justify-center' : 'flex gap-1 items-center overflow-x-auto';

  if (variant === 'manila') {
    const manilaClasses = orientation === 'vertical' ? 'flex flex-col items-start' : wrap ? 'flex flex-wrap items-end flex-1' : 'flex items-end flex-1';

    return (
      <div className={`${manilaClasses} ${className}`} role="tablist">
        {children}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-[rgba(243,238,217,0.05)] border border-[rgba(243,238,217,0.2)] ${className}`}>
      {children}
    </div>
  );
}

/**
 * Individual tab trigger button
 */
export function TabTrigger({ value, children, iconName, tooltip, className = '' }: TabTriggerProps) {
  const { activeTab, setActiveTab, variant, orientation, layout } = useTabsContext();
  const isActive = activeTab === value;

  if (variant === 'manila') {
    const manilaBaseClasses = 'flex-1 px-3 h-8 text-xs font-kodemono cursor-pointer outline-none border border-[rgba(243,238,217,0.2)] border-b-0 -mr-px last:mr-0 flex items-center justify-center transition-all duration-200';
    const manilaActiveClasses = 'bg-[rgba(243,238,217,0.1)] relative z-20 text-[#f3eed9] h-[33px] -mb-px border-[rgba(153,163,255,0.5)]';
    const manilaInactiveClasses = 'bg-[rgba(243,238,217,0.05)] hover:bg-[rgba(243,238,217,0.08)] z-10 text-[rgba(243,238,217,0.6)]';

    const manilaButton = (
      <button onClick={() => setActiveTab(value)} className={`${manilaBaseClasses} ${isActive ? manilaActiveClasses : manilaInactiveClasses} ${className}`} aria-selected={isActive} role="tab">
        {children}
      </button>
    );

    if (layout === 'icon' && (tooltip || children)) {
      return (
        <Tooltip content={tooltip || children} position={orientation === 'vertical' ? 'right' : 'bottom'} size="md">
          {manilaButton}
        </Tooltip>
      );
    }

    return manilaButton;
  }

  const buttonVariant = isActive ? 'purple' : 'ghost';
  const isIconOnly = layout === 'icon';
  const showIcon = layout === 'icon' || layout === 'icon-text';
  const tooltipPosition = orientation === 'vertical' ? 'right' : 'bottom';

  const button = (
    <Button variant={buttonVariant} size="md" iconOnly={isIconOnly} iconName={showIcon ? iconName : undefined} onClick={() => setActiveTab(value)} className={className} aria-selected={isActive} role="tab">
      {!isIconOnly && children}
    </Button>
  );

  if (isIconOnly && (tooltip || children)) {
    return (
      <Tooltip content={tooltip || children} position={tooltipPosition} size="md">
        {button}
      </Tooltip>
    );
  }

  return button;
}

/**
 * Tab content panel
 */
export function TabContent({ value, children, className = '' }: TabContentProps) {
  const { activeTab, variant } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  if (variant === 'manila') {
    return (
      <div role="tabpanel" className={`bg-[rgba(243,238,217,0.05)] border border-[rgba(243,238,217,0.2)] ${className}`}>
        {children}
      </div>
    );
  }

  const contentClasses = variant === 'line' ? `bg-[rgba(243,238,217,0.02)] border-r border-[rgba(243,238,217,0.1)] ${className}` : className;

  return (
    <div role="tabpanel" className={contentClasses}>
      {children}
    </div>
  );
}

export default Tabs;
export type { TabsVariant, TabsOrientation, TabsLayout, TabsProps, TabListProps, TabTriggerProps, TabContentProps };
