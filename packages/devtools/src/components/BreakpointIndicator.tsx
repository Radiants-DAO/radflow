'use client';

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@radflow/ui';
import { useDevToolsStore } from '../store';

interface Breakpoint {
  label: string;
  width: number;
}

// Minimum panel width to ensure usability
const MIN_PANEL_WIDTH = 300;

/**
 * Get breakpoints from CSS custom properties
 */
function getBreakpointsFromCSS(): Record<string, number> {
  if (typeof window === 'undefined') {
    return {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };
  }

  const root = document.documentElement;
  const breakpoints: Record<string, number> = {};
  
  // Try to read from CSS custom properties
  const breakpointNames = ['sm', 'md', 'lg', 'xl', '2xl'];
  for (const name of breakpointNames) {
    const value = getComputedStyle(root).getPropertyValue(`--breakpoint-${name}`);
    if (value) {
      // Parse px value (e.g., "640px" -> 640)
      const pxValue = parseInt(value.trim().replace('px', ''), 10);
      if (!isNaN(pxValue)) {
        breakpoints[name] = pxValue;
      }
    }
  }

  // Fallback to defaults if no CSS values found
  if (Object.keys(breakpoints).length === 0) {
    return {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };
  }

  return breakpoints;
}

/**
 * Get current breakpoint based on window width
 */
function getCurrentBreakpoint(breakpoints: Record<string, number>, width: number): Breakpoint {
  let label = 'xs';
  
  // Sort breakpoints by width descending
  const sorted = Object.entries(breakpoints)
    .map(([name, w]) => ({ name, width: w }))
    .sort((a, b) => b.width - a.width);
  
  for (const bp of sorted) {
    if (width >= bp.width) {
      label = bp.name;
      break;
    }
  }
  
  return { label, width };
}

/**
 * Breakpoint indicator dropdown component
 * Shows current breakpoint and allows switching between breakpoints
 */
export function BreakpointIndicator() {
  const { setPanelWidth, panelWidth } = useDevToolsStore();
  // Load breakpoints from CSS on mount (initialize state directly)
  const [breakpoints] = useState<Record<string, number>>(() => getBreakpointsFromCSS());
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>({ label: '', width: 0 });
  const [isOpen, setIsOpen] = useState(false);

  // Update current breakpoint based on body width (viewport minus panel)
  useEffect(() => {
    const updateBreakpoint = () => {
      // Body width = viewport width - panel width
      const bodyWidth = window.innerWidth - panelWidth;
      setCurrentBreakpoint(getCurrentBreakpoint(breakpoints, bodyWidth));
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [breakpoints, panelWidth]);

  const handleBreakpointSelect = (breakpointName: string) => {
    // Get the target body width for this breakpoint
    const targetBodyWidth = breakpointName === 'xs' ? 320 : breakpoints[breakpointName];
    
    if (targetBodyWidth) {
      // Resize the devtools panel so the BODY (viewport minus panel) equals the breakpoint width
      // panelWidth = windowWidth - targetBodyWidth
      const newPanelWidth = window.innerWidth - targetBodyWidth;
      
      // Ensure minimum panel width
      const finalPanelWidth = Math.max(MIN_PANEL_WIDTH, newPanelWidth);
      
      setPanelWidth(finalPanelWidth);
      
      // Also dispatch event for any other listeners
      window.dispatchEvent(new CustomEvent('breakpoint-change', { 
        detail: { breakpoint: breakpointName, bodyWidth: targetBodyWidth, panelWidth: finalPanelWidth } 
      }));
    }
    setIsOpen(false);
  };

  if (currentBreakpoint.width === 0) {
    return null;
  }

  // Sort breakpoints for display (xs first, then sm, md, lg, xl, 2xl)
  const sortedBreakpoints = [
    { name: 'xs', width: 320, label: 'XS' },
    ...Object.entries(breakpoints)
      .map(([name, width]) => ({
        name,
        width,
        label: name.toUpperCase(),
      }))
      .sort((a, b) => a.width - b.width),
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 font-mono text-[10px] text-content-secondary hover:text-content-primary transition-colors cursor-pointer px-1.5 py-0.5 rounded-sm hover:bg-warm-cloud"
          title="Click to switch breakpoints"
        >
          <span className="font-bold uppercase">{currentBreakpoint.label}</span>
          <span className="text-content-primary">·</span>
          <span className="text-content-primary">{currentBreakpoint.width}px</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px]">
        <DropdownMenuLabel className="text-[10px] text-content-primary font-normal px-2 py-1">
          Breakpoints
        </DropdownMenuLabel>
        {sortedBreakpoints.map((bp) => {
          const isActive = bp.name === currentBreakpoint.label;
          return (
            <DropdownMenuItem
              key={bp.name}
              onClick={() => handleBreakpointSelect(bp.name)}
              className={isActive ? 'bg-surface-tertiary/20' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold uppercase">{bp.label}</span>
                <span className="font-mono text-xs text-content-primary ml-2">
                  {bp.width}px
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
