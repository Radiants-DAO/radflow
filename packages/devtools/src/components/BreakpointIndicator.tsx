'use client';

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import type { DockPosition } from '../types';

interface Breakpoint {
  label: string;
  width: number;
}

// Dock position icons (matching Chrome DevTools style)
const DockIcons = {
  undocked: (active: boolean) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.5} />
      <rect x="4" y="4" width="8" height="8" rx="0.5" fill="currentColor" opacity={active ? 1 : 0.5} />
    </svg>
  ),
  left: (active: boolean) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.5} />
      <rect x="1.5" y="1.5" width="5" height="13" fill="currentColor" opacity={active ? 1 : 0.5} />
    </svg>
  ),
  right: (active: boolean) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" opacity={active ? 1 : 0.5} />
      <rect x="9.5" y="1.5" width="5" height="13" fill="currentColor" opacity={active ? 1 : 0.5} />
    </svg>
  ),
};

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
 * Also includes dock position controls
 */
export function BreakpointIndicator() {
  const { setPanelWidth, panelWidth, dockPosition, setDockPosition } = useDevToolsStore();
  const [breakpoints, setBreakpoints] = useState<Record<string, number>>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>({ label: '', width: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const dockPositions: { id: DockPosition; title: string }[] = [
    { id: 'undocked', title: 'Undock into separate window' },
    { id: 'left', title: 'Dock to left' },
    { id: 'right', title: 'Dock to right' },
  ];

  useEffect(() => {
    // Load breakpoints from CSS
    const bp = getBreakpointsFromCSS();
    setBreakpoints(bp);
  }, []);

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
          className="flex items-center gap-1.5 font-mono text-[10px] text-content-primary/60 hover:text-content-primary transition-colors cursor-pointer px-1.5 py-0.5 rounded-sm hover:bg-surface-secondary/5"
          title="Click to switch breakpoints"
        >
          <span className="font-bold uppercase">{currentBreakpoint.label}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-50">{currentBreakpoint.width}px</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px]">
        {/* Dock side controls */}
        <DropdownMenuLabel className="text-[10px] text-content-primary/50 font-normal px-2 py-1">
          Dock side
        </DropdownMenuLabel>
        <div className="flex items-center gap-1 px-2 pb-2">
          {dockPositions.map((pos) => {
            const isActive = pos.id === dockPosition;
            return (
              <button
                key={pos.id}
                onClick={() => setDockPosition(pos.id)}
                title={pos.title}
                className={`p-1.5 rounded transition-colors ${
                  isActive 
                    ? 'bg-surface-tertiary text-content-primary' 
                    : 'text-content-primary/50 hover:text-content-primary hover:bg-surface-secondary/10'
                }`}
              >
                {DockIcons[pos.id](isActive)}
              </button>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Breakpoint controls */}
        <DropdownMenuLabel className="text-[10px] text-content-primary/50 font-normal px-2 py-1">
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
                <span className="font-mono text-xs text-content-primary/50 ml-2">
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
