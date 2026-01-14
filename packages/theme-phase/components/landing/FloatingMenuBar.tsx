'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../core';

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface SectionAnchor {
  id: string;
  label: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface FloatingMenuBarProps {
  primaryNav?: NavItem[];
  sections?: SectionAnchor[];
  logoHref?: string;
  autoDiscoverSections?: boolean;
  socials?: SocialLink[];
}

// ============================================================================
// Hooks
// ============================================================================

function useActiveSection(sections: SectionAnchor[]): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    // Track visibility ratios for all sections
    const visibilityMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility map
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        // Find the most visible section
        let maxRatio = 0;
        let mostVisible: string | null = null;

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        });

        if (mostVisible && maxRatio > 0.1) {
          setActiveSection(mostVisible);
        }
      },
      { threshold: [0.1, 0.2, 0.3, 0.4, 0.5], rootMargin: '-100px 0px -40% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return activeSection;
}

function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

function useScrolled(threshold = 100): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

function useAutoDiscoverSections(): SectionAnchor[] {
  const [sections, setSections] = useState<SectionAnchor[]>([]);

  useEffect(() => {
    // Wait for DOM to be ready
    const discover = () => {
      const discovered: SectionAnchor[] = [];

      // Only find sections with explicit data-section-label attribute
      const sectionElements = document.querySelectorAll('[data-section-label]');

      sectionElements.forEach((el) => {
        const id = el.getAttribute('data-section') || el.id;
        const label = el.getAttribute('data-section-label') || '';

        if (id && label) {
          discovered.push({ id, label: label.toUpperCase() });
        }
      });

      // Only update if sections actually changed
      setSections((prev) => {
        const prevIds = prev.map((s) => s.id).join(',');
        const newIds = discovered.map((s) => s.id).join(',');
        if (prevIds === newIds) return prev;
        return discovered;
      });
    };

    // Run after a short delay to ensure DOM is ready
    const timeout = setTimeout(discover, 100);

    // Run again after a longer delay to catch lazy-loaded content
    const timeout2 = setTimeout(discover, 500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

  return sections;
}

// ============================================================================
// Sub-components
// ============================================================================

interface NavItemButtonProps {
  item: NavItem;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
}

function NavItemButton({ item, isExpanded, onToggle, onNavigate }: NavItemButtonProps) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="w-full border-b border-[var(--glass-border)] last:border-b-0">
      <button
        onClick={() => (hasChildren ? onToggle() : onNavigate(item.href))}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--glass-bg-hover)] transition-colors"
      >
        <span className="font-outfit font-bold text-sm uppercase tracking-wide text-content-primary">
          {item.label}
        </span>
        {hasChildren && (
          <Icon
            name="caret-down"
            size={16}
            className={`text-content-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="pl-4 pb-2 border-t border-[var(--glass-border)]">
          {item.children!.map((child) => (
            <button
              key={child.href}
              onClick={() => onNavigate(child.href)}
              className="w-full px-4 py-2 text-left text-sm text-content-secondary hover:text-content-primary hover:bg-[var(--glass-bg-hover)] transition-colors"
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

const defaultSocials: SocialLink[] = [
  { name: 'X', href: 'https://x.com/phase', icon: 'x-logo' },
  { name: 'Discord', href: 'https://discord.gg/phase', icon: 'discord-logo' },
];

export function FloatingMenuBar({
  primaryNav = [],
  sections: propSections,
  logoHref = '/phase',
  autoDiscoverSections = true,
  socials = defaultSocials,
}: FloatingMenuBarProps) {

  const discoveredSections = useAutoDiscoverSections();
  const sections = propSections || (autoDiscoverSections ? discoveredSections : []);

  const activeSection = useActiveSection(sections);
  const scrollProgress = useScrollProgress();
  const isScrolled = useScrolled(100);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const offset = 80;
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setIsMenuOpen(false);
  }, []);

  const handleNavigate = useCallback((href: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href.slice(1));
    } else {
      window.location.href = href;
    }
    setIsMenuOpen(false);
  }, [scrollToSection]);

  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Hamburger Menu Panel */}
      <div
        className={`fixed right-[48px] z-50 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          top: 'calc(30px + 40px + 8px)',
          width: '300px',
        }}
      >
        <div className="bg-surface-primary backdrop-blur-xl border border-[var(--glass-border)] overflow-hidden shadow-2xl">
          {primaryNav.map((item) => (
            <NavItemButton
              key={item.label}
              item={item}
              isExpanded={expandedItems.has(item.label)}
              onToggle={() => toggleExpanded(item.label)}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>

      {/* Left Section: Logo + Socials */}
      <div
        className={`fixed left-[48px] top-[30px] z-50 transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="h-[40px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-2xl flex items-center">
          {/* Logo */}
          <a
            href={logoHref}
            className="w-[40px] h-[40px] bg-content-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <svg width="42" height="48" viewBox="0 0 42 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7 text-surface-primary">
              <path d="M33.2761 7.14112L24.9571 11.9264L20.7608 9.57056L8.31903 16.7853V21.5706L0 26.3558V12L20.8344 0L33.2761 7.14112Z" fill="currentColor"/>
              <path d="M41.5951 7.14062V16.7848L0 40.7848V31.1406L41.5951 7.14062Z" fill="currentColor"/>
              <path d="M41.5964 21.5703V35.9998L20.8357 47.9998L8.32031 40.7851L16.6393 35.9998L20.762 38.3556H20.8357L33.2774 31.1409V26.3556L41.5964 21.5703Z" fill="currentColor"/>
            </svg>
          </a>

          {/* Socials */}
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[40px] h-[40px] flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-[var(--glass-bg-hover)] transition-all border-l border-[var(--glass-border)]"
              title={social.name}
            >
              <Icon name={social.icon} size={20} />
            </a>
          ))}
        </div>
      </div>

      {/* Center Section: Page Nav (hidden on mobile) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 top-[30px] z-50 transition-all duration-300 hidden md:block ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="h-[40px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-2xl flex items-center">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`shrink-0 h-[40px] px-5 font-kodemono font-normal text-[14px] uppercase border-r border-[var(--glass-border)] last:border-r-0 ${
                activeSection === id
                  ? 'text-[var(--color-gold)] bg-[var(--glass-bg-gold)]'
                  : 'text-content-secondary hover:text-content-primary hover:bg-[var(--glass-bg-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section: CTA + Hamburger */}
      <div
        className={`fixed right-[48px] top-[30px] z-50 transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="h-[40px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-2xl flex items-center">
          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-[40px] h-[40px] flex items-center justify-center shrink-0 transition-all ${
              isMenuOpen
                ? 'bg-[var(--glass-bg-hover)] text-content-primary'
                : 'text-content-secondary hover:text-content-primary hover:bg-[var(--glass-bg-hover)]'
            }`}
            title="Menu"
          >
            <Icon name={isMenuOpen ? 'x' : 'list'} size={20} />
          </button>
        </div>
      </div>

      {/* Top Gradient Overlay */}
      <div
        className={`fixed top-0 left-0 right-0 h-[120px] pointer-events-none z-40 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 12, 14, 0.8) 0%, transparent 100%)',
        }}
      />

      {/* Progress Bar - Full Width at Top */}
      <div
        className={`fixed top-0 left-0 right-0 h-[2px] bg-[var(--glass-border)] overflow-hidden z-50 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full bg-[var(--glass-border-gold-strong)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Backdrop when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-primary/80 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hide scrollbar style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      ` }} />
    </>
  );
}

export default FloatingMenuBar;
