'use client';

import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function BreakpointIndicator() {
  const [width, setWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState('');

  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      setWidth(w);

      if (w >= BREAKPOINTS['2xl']) setBreakpoint('2xl');
      else if (w >= BREAKPOINTS.xl) setBreakpoint('xl');
      else if (w >= BREAKPOINTS.lg) setBreakpoint('lg');
      else if (w >= BREAKPOINTS.md) setBreakpoint('md');
      else if (w >= BREAKPOINTS.sm) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV === 'production') return null;

  // Don't render on server
  if (width === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs text-alternate shadow-lg">
      <span className="font-bold uppercase">{breakpoint}</span>
      <span className="opacity-60">·</span>
      <span className="opacity-60">{width}px</span>
    </div>
  );
}

