'use client';

import { useEffect, RefObject } from 'react';

/**
 * Hook to handle escape key press to close modals/overlays
 */
export function useEscapeKey(isActive: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, onEscape]);
}

/**
 * Hook to detect clicks outside of specified element(s)
 */
export function useClickOutside(isActive: boolean, refs: RefObject<HTMLElement | null>[], onClickOutside: () => void): void {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      const clickedOutsideAll = refs.every((ref) => ref.current && !ref.current.contains(e.target as Node));
      if (clickedOutsideAll) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive, refs, onClickOutside]);
}

/**
 * Hook to prevent body scroll when modal is open
 */
export function useLockBodyScroll(isActive: boolean): void {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);
}
