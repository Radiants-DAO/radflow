'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ServiceCard,
  NavLink,
  ArticleCard,
  EventCard,
  TeamMember,
  SectionHeader,
  LogoWithHover,
  FloatingMenuBar,
} from '@radflow/theme-phase/components/landing';
import type { ServiceCardAccent } from '@radflow/theme-phase/components/landing';
import { Button, Icon } from '@radflow/theme-phase/components/core';

// ============================================================================
// Animated Number Hook & Component
// ============================================================================

function useCountUp(
  endValue: number,
  duration: number = 2000,
  startOnView: boolean = true
): { value: number; ref: React.RefObject<HTMLSpanElement | null>; hasAnimated: boolean } {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
    
    // Ease out cubic for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3);
    setValue(Math.round(easeOut * endValue));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setHasAnimated(true);
    }
  }, [endValue, duration]);

  useEffect(() => {
    if (!startOnView || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startTimeRef.current = null;
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, hasAnimated, startOnView]);

  return { value, ref, hasAnimated };
}

interface AnimatedNumberProps {
  value: string;
  className?: string;
  duration?: number;
}

function AnimatedNumber({ value, className = '', duration = 2000 }: AnimatedNumberProps) {
  // Extract numeric part and format info from the value string
  const match = value.match(/^(\$)?(\d+(?:,\d{3})*(?:\.\d+)?)(M\+?|%|x)?(.*)$/i);
  
  if (!match) {
    // If no number found, just return the value as-is
    return <span className={className}>{value}</span>;
  }

  const [, prefix = '', numStr, suffix = '', rest = ''] = match;
  const numericValue = parseFloat(numStr.replace(/,/g, ''));
  const hasCommas = numStr.includes(',');
  const decimalPlaces = numStr.includes('.') ? numStr.split('.')[1]?.length || 0 : 0;

  const { value: animatedValue, ref } = useCountUp(numericValue, duration);

  const formatValue = (num: number): string => {
    if (decimalPlaces > 0) {
      return num.toFixed(decimalPlaces);
    }
    if (hasCommas) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatValue(animatedValue)}{suffix}{rest}
    </span>
  );
}

// ============================================================================
// Animated StatCard Component
// ============================================================================

interface AnimatedStatCardProps {
  label: string;
  value: string;
  className?: string;
}

function AnimatedStatCard({ label, value, className = '' }: AnimatedStatCardProps) {
  return (
    <div className={`flex flex-col items-end w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-clip p-[12px] gap-px ${className}`}>
      <p className="font-kodemono font-bold text-[16px] text-content-primary uppercase">
        {label}
      </p>
      <AnimatedNumber 
        value={value} 
        className="font-kodemono font-normal text-[20px] text-[var(--color-gold)]"
      />
    </div>
  );
}

// Phase Logomark SVG Component
function PhaseLogomark({ className = '' }: { className?: string }) {
  return (
    <svg width="42" height="48" viewBox="0 0 42 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M33.2761 7.14112L24.9571 11.9264L20.7608 9.57056L8.31903 16.7853V21.5706L0 26.3558V12L20.8344 0L33.2761 7.14112Z" fill="currentColor"/>
      <path d="M41.5951 7.14062V16.7848L0 40.7848V31.1406L41.5951 7.14062Z" fill="currentColor"/>
      <path d="M41.5964 21.5703V35.9998L20.8357 47.9998L8.32031 40.7851L16.6393 35.9998L20.762 38.3556H20.8357L33.2774 31.1409V26.3556L41.5964 21.5703Z" fill="currentColor"/>
    </svg>
  );
}

// Placeholder logos (user will provide real assets)
const partnerLogos = [
  { src: '/logos/solana.svg', alt: 'Solana' },
  { src: '/logos/jito.svg', alt: 'Jito' },
  { src: '/logos/marinade.svg', alt: 'Marinade' },
  { src: '/logos/phantom.svg', alt: 'Phantom' },
];

// Mock data
const navLinks = ['STAKE', 'DELEGATION', 'TAX', 'MEDIA', 'CONTACT'];
const sidebarLinks = ['TAX', 'BLOG', 'STAKING', 'CONTACT', 'DELEGATION'];

const services: Array<{
  iconSrc: string;
  title: string;
  description: string;
  ctaText: string;
  accent: ServiceCardAccent;
}> = [
  {
    iconSrc: '/assets/icons/stake-services.svg',
    title: 'Stake Services',
    description: 'The Leading Institutional Staking & Compliance Infrastructure for Solana',
    ctaText: 'Run a validator',
    accent: 'blue',
  },
  {
    iconSrc: '/assets/icons/delegation.svg',
    title: 'Delegation',
    description: "We offer Solana stake delegation to high performing validators that contribute to Solana's growth and decentralization.",
    ctaText: 'Apply for Stake',
    accent: 'purple',
  },
  {
    iconSrc: '/assets/icons/taxes.svg',
    title: 'Taxes',
    description: 'Solana crypto tax reporting for token swaps, perp trading, staking, NFTs, and DeFi.',
    ctaText: 'File my taxes',
    accent: 'green',
  },
];

const teamMembers = [
  { name: 'DEVØUR', role: 'CEO', avatar: '/assets/avatars/devour.avif', twitter: 'devour' },
  { name: 'S3B', role: 'CMO', avatar: '/assets/avatars/seb.avif', twitter: 's3b' },
  { name: 'MINT', role: 'CTO', avatar: '/assets/avatars/mint.avif', twitter: 'mint' },
  { name: 'DAN', role: 'CFO', avatar: '/assets/avatars/dan.avif', twitter: 'dan' },
  { name: 'Jeff', role: 'CPO', avatar: '/assets/avatars/jeff.avif', twitter: 'mynameisjeff' },
  { name: 'Gabe', role: 'Lead Dev', avatar: '/assets/avatars/bored.avif', twitter: 'gabriel_sol' },
];

const events = [
  { title: 'Dev Workshop: Building on Phase SDK', date: 'Dec 09', ctaText: 'WATCH ON X' },
  { title: 'Phase Live: Weekly Community Call', date: 'Dec 09', ctaText: 'WATCH ON X' },
  { title: 'Mainnet Launch Event', date: 'Dec 09', ctaText: 'WATCH ON X' },
];

const articles = [
  {
    title: 'Validator Infrastructure Deep Dive',
    description: 'Running a Phase validator requires specific high-availability hardware configurations to ensure network stability. This guide covers the recommended specs, slashing conditions, and reward structures for node...',
    date: '10.06.2024',
    tags: ['TECHNICAL', 'VALIDATORS'],
  },
  {
    title: 'Q3 Roadmap Update',
    description: 'The Q3 roadmap focuses on deep Solana ecosystem integrations, specifically Liquid Staking and advanced analytics dashboards. Key deliverables include new validator tools and enhanced tax...',
    date: '10.06.2024',
    tags: ['TECHNICAL', 'VALIDATORS'],
  },
  {
    title: 'Introducing Phase: The Next Evolution',
    description: 'Phase Public Beta is now live, offering a high-frequency, non-custodial digital asset management platform. This release introduces a brutalist design system focused on speed and institutional-grade security.',
    date: '10.06.2024',
    tags: ['TECHNICAL', 'VALIDATORS'],
  },
];

// ============================================================================
// Header Component
// ============================================================================

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center w-full h-[97px]">
        {/* Logo Section - Icon Square */}
        <a href="/phase" className="flex items-center shrink-0">
          {/* Icon Square */}
          <div className="w-[97px] h-[97px] bg-content-primary flex items-center justify-center">
            <PhaseLogomark className="w-12 h-14 text-surface-primary" />
          </div>
          {/* PHASE Text + Tagline */}
          <div className="h-[97px] border border-surface-primary flex flex-col items-center justify-center px-8 gap-[5px]">
            <span className="font-audiowide text-[35px] text-content-primary tracking-tight">
              PHASE
            </span>
            <span className="font-kodemono text-[10px] text-content-secondary uppercase tracking-[1.8px]">
              STAKE // DELEGATE // TAX
            </span>
          </div>
        </a>

        {/* Nav Items - Equal Width Cells */}
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="flex-1 h-[97px] bg-[var(--glass-bg)] border border-surface-primary flex items-center justify-center hover:bg-[var(--glass-bg-hover)] transition-colors"
          >
            <span className="font-outfit font-semibold text-[18px] text-content-primary uppercase">
              {link}
            </span>
          </a>
        ))}

        {/* Hamburger Menu Cell */}
        <div className="flex-1 h-[97px] border border-surface-primary flex items-center justify-center">
          <div className="flex flex-col gap-[6px]">
            <div className="w-[32px] h-[2px] bg-content-primary" />
            <div className="w-[32px] h-[2px] bg-content-primary" />
            <div className="w-[32px] h-[2px] bg-content-primary" />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-[64px] px-4 bg-surface-primary">
        <a href="/phase" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-content-primary flex items-center justify-center">
            <PhaseLogomark className="w-6 h-7 text-surface-primary" />
          </div>
          <span className="font-audiowide text-xl text-content-primary">PHASE</span>
        </a>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center text-content-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name={mobileMenuOpen ? 'x' : 'list'} size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-surface-primary z-40 p-6">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link}
                variant="large"
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ============================================================================
// Hero Section Component
// ============================================================================

function HeroSection() {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform based on scroll - moves up and fades out
  const topContentStyle: React.CSSProperties = {
    transform: `translateY(-${Math.min(scrollY * 0.2, 150)}px)`,
  };

  // Gradient overlay opacity increases as we scroll
  const gradientOpacity = Math.min(1, scrollY / 400);

  return (
    <section id="hero" className="h-[100dvh] min-h-[994px] pt-12 px-12 pb-12">
      <div className="h-full mx-auto flex flex-col justify-between">
        {/* Top Section: SVG + Stat Cards */}
        <div style={topContentStyle} className="relative">
          {/* Gradient overlay that fades in on scroll */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, var(--color-surface-primary) 0%, transparent 100%)',
              opacity: gradientOpacity,
            }}
          />
          {/* Giant PHASE Typography */}
          <svg 
            className="w-full h-auto mb-8" 
            viewBox="0 0 1320 238" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-label="PHASE"
          >
            <path d="M236.563 99.5817C236.563 109.429 235.352 118.226 232.932 125.971C230.511 133.716 227.209 140.576 223.027 146.551C218.955 152.415 214.222 157.45 208.829 161.654C203.437 165.859 197.769 169.289 191.827 171.944C185.993 174.599 180.049 176.537 173.998 177.753C168.054 178.97 162.441 179.579 157.159 179.579H60.0901V158.003V136.427H157.159C162.661 135.984 167.614 134.878 172.016 133.107C176.528 131.226 180.381 128.737 183.572 125.639C186.764 122.541 189.24 118.834 191 114.519C192.762 110.093 193.642 105.114 193.642 99.5817V79.9972C193.091 74.5756 191.937 69.5965 190.175 65.0599C188.414 60.5235 185.993 56.6508 182.911 53.4421C179.94 50.2334 176.308 47.7438 172.016 45.9736C167.724 44.0925 162.772 43.152 157.159 43.152H60.4203C54.6974 43.152 50.3503 44.6457 47.3786 47.6331C44.4072 50.6207 42.9214 54.9358 42.9214 60.5788V238H0V60.5788C0 49.5142 1.981 40.1093 5.94297 32.3641C10.015 24.6188 15.0225 18.3673 20.9654 13.6095C27.0186 8.85169 33.5668 5.42166 40.6103 3.31938C47.6538 1.10646 54.147 0 60.0901 0H157.159C166.843 0 175.538 1.27243 183.241 3.81729C190.946 6.25152 197.715 9.5709 203.547 13.7755C209.49 17.8693 214.497 22.6272 218.57 28.0488C222.752 33.4705 226.163 39.1688 228.805 45.1437C231.556 51.0079 233.537 56.9827 234.747 63.0684C235.958 69.0433 236.563 74.6862 236.563 79.9972V99.5817ZM316.629 97.2581H467.349V0H510.27V238H467.349V140.742H316.629V238H273.707V0H316.629V97.2581ZM792.892 238H749.97V179.579H599.086V238H556.164V119C556.164 101.629 559.135 85.6402 565.077 71.0349C571.021 56.4296 579.275 43.8712 589.841 33.3598C600.406 22.8484 612.897 14.6606 627.314 8.79638C641.731 2.93213 657.469 0 674.527 0H771.266C774.238 0 777.044 0.553232 779.684 1.65969C782.327 2.76615 784.637 4.3152 786.619 6.30684C788.6 8.29847 790.14 10.622 791.24 13.2776C792.341 15.9331 792.892 18.7546 792.892 21.742V238ZM599.086 136.427H749.97V43.152H674.527C673.207 43.152 670.4 43.3733 666.108 43.8158C661.926 44.1479 657.029 45.0883 651.417 46.6374C645.913 48.1865 640.081 50.5653 633.917 53.774C627.754 56.9827 622.086 61.4087 616.913 67.0516C611.742 72.6945 607.448 79.7759 604.037 88.2957C600.735 96.7048 599.086 106.94 599.086 119V136.427ZM1070.4 167.961C1070.4 176.481 1069.29 184.171 1067.09 191.03C1065 197.781 1062.2 203.755 1058.68 208.955C1055.15 214.156 1051.03 218.581 1046.29 222.233C1041.56 225.884 1036.66 228.872 1031.6 231.195C1026.54 233.518 1021.37 235.233 1016.08 236.34C1010.91 237.448 1006.01 238 1001.39 238H835.814V194.847H1001.39C1009.65 194.847 1016.03 192.414 1020.54 187.546C1025.16 182.677 1027.47 176.149 1027.47 167.961C1027.47 163.978 1026.87 160.326 1025.66 157.007C1024.45 153.688 1022.69 150.811 1020.38 148.377C1018.17 145.942 1015.42 144.061 1012.12 142.734C1008.93 141.406 1005.35 140.742 1001.39 140.742H902.671C895.739 140.742 888.255 139.525 880.22 137.091C872.187 134.546 864.702 130.507 857.769 124.975C850.945 119.443 845.223 112.195 840.601 103.233C836.088 94.2707 833.833 83.3166 833.833 70.3709C833.833 57.4255 836.088 46.5267 840.601 37.6751C845.223 28.7126 850.945 21.4654 857.769 15.9331C864.702 10.2901 872.187 6.25152 880.22 3.81729C888.255 1.27243 895.739 0 902.671 0H1048.77V43.152H902.671C894.528 43.152 888.145 45.6416 883.522 50.6207C879.01 55.5997 876.753 62.1831 876.753 70.3709C876.753 78.6696 879.01 85.253 883.522 90.1213C888.145 94.8791 894.528 97.2581 902.671 97.2581H1001.39H1001.72C1006.34 97.3688 1011.24 98.0326 1016.41 99.2496C1021.59 100.356 1026.7 102.126 1031.77 104.561C1036.94 106.995 1041.84 110.093 1046.46 113.855C1051.08 117.506 1055.15 121.932 1058.68 127.133C1062.31 132.333 1065.17 138.308 1067.26 145.057C1069.35 151.807 1070.4 159.441 1070.4 167.961ZM1300.69 140.742H1165.15V97.2581H1300.69V140.742ZM1320 238H1165.15C1159.21 238 1152.72 236.95 1145.67 234.847C1138.63 232.745 1132.08 229.314 1126.03 224.557C1120.09 219.688 1115.08 213.437 1111.01 205.802C1107.04 198.056 1105.06 188.596 1105.06 177.422V21.742C1105.06 18.7546 1105.61 15.9331 1106.71 13.2776C1107.82 10.622 1109.3 8.29847 1111.17 6.30684C1113.15 4.3152 1115.46 2.76615 1118.1 1.65969C1120.75 0.553232 1123.61 0 1126.69 0H1320V43.152H1147.99V177.422C1147.99 183.065 1149.47 187.38 1152.44 190.367C1155.41 193.355 1159.76 194.847 1165.48 194.847H1320V238Z" fill="currentColor" className="text-content-primary" />
          </svg>

          {/* Stat Cards Row */}
          <div className="flex flex-nowrap gap-4 mb-16">
            <AnimatedStatCard label="/native" value="9% APR" />
            <AnimatedStatCard label="/liquid" value="15% APR" />
            <AnimatedStatCard label="/validators" value="35 Connected" />
          </div>
        </div>

        {/* Bottom Section: Two Column Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          {/* Sidebar Navigation */}
          <div className="flex flex-col items-start">
            {/* Phase Logomark */}
            <div className="h-[48px] mb-8">
              <PhaseLogomark className="h-12 w-auto text-content-primary" />
            </div>
            {/* Nav Links */}
            <nav className="flex flex-col items-start">
              {sidebarLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="font-outfit font-semibold text-[32px] text-content-primary uppercase hover:text-gold transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 w-full lg:w-[429px]">
            <p className="font-outfit font-light text-[24px] text-content-primary leading-normal">
              The Leading Institutional Staking & Tax Compliance Infrastructure for Solana
            </p>
            <Button variant="default" iconName="arrow-up-right" fullWidth>
              STAKE NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Logo Grid Section
// ============================================================================

function LogoSection() {
  return (
    <section id="partners" className="py-24 px-16 border-y border-edge-secondary">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between flex-wrap">
          <LogoWithHover name="solana" width="8%" />
          <LogoWithHover name="hylo" width="7%" />
          <LogoWithHover name="solflare" width="8%" />
          <LogoWithHover name="doublezero" width="7%" />
          <LogoWithHover name="jito" width="12%" />
          <LogoWithHover name="magiceden" width="9%" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Stake Calculator Component
// ============================================================================

function StakeCalculator() {
  const [amount, setAmount] = React.useState(5500);
  const [sliderValue, setSliderValue] = React.useState(55);
  const [selectedToken, setSelectedToken] = React.useState<'USDSOL' | 'PDSOL'>('USDSOL');

  // Mock calculations
  const solPrice = 130;
  const usdValue = amount * solPrice;
  const apyRates = { USDSOL: 6.88, PDSOL: 10.3 };
  const yearlyYieldUSD = Math.round(usdValue * (apyRates[selectedToken] / 100));

  // TVL data
  const tvlData = [
    { label: 'USDSOL TVL', value: '$10,058,941' },
    { label: 'PDSOL TVL', value: '$30,058,941' },
    { label: 'pSOL TVL', value: '$129,058,941' },
  ];

  return (
    <section id="stake" data-section-label="Stake" className="py-32 px-16">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Title + Stats + Buttons */}
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <SectionHeader
                label="// EARN"
                title="PHASE STAKE"
                size="md"
                showLeftBorder
              />

              {/* Description + TVL Stats */}
              <div className="flex flex-col gap-3">
                <p className="font-outfit font-light text-[16px] text-content-secondary max-w-[506px]">
                  Stake your USDSOL, PDSOL, or pSOL to earn rewards.
                </p>
                <div className="flex gap-3">
                  {tvlData.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-3 overflow-hidden"
                    >
                      <p className="font-kodemono font-medium text-[16px] text-content-secondary uppercase">
                        {stat.label}
                      </p>
                      <AnimatedNumber 
                        value={stat.value} 
                        className="font-audiowide text-[24px] text-content-primary block"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <Button variant="blue" iconName="arrow-up-right" fullWidth>
                Stake Now
              </Button>
              <Button variant="default" iconName="arrow-up-right" fullWidth>
                Learn more
              </Button>
            </div>
          </div>

          {/* Right: Calculator */}
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 h-[409px] flex flex-col justify-between relative">
            {/* Phase Icon */}
            <PhaseLogomark className="absolute top-6 right-6 w-[40px] h-[44px] text-content-primary" />
            {/* Amount Display */}
            <div className="flex flex-col gap-2">
              <p className="font-kodemono font-light text-[18px] text-content-primary">
                Amount to Stake
              </p>
              <div className="flex items-end gap-2 uppercase">
                <input
                  type="text"
                  value={amount.toLocaleString()}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/,/g, '')) || 0;
                    setAmount(val);
                    setSliderValue(Math.min(100, Math.round((val / 10000) * 100)));
                  }}
                  className="font-audiowide text-[48px] text-content-primary bg-transparent outline-none w-[240px] text-center"
                />
                <span className="font-outfit font-normal text-[24px] text-content-primary h-[36px]">
                  SOL
                </span>
              </div>
              <p className="font-kodemono font-light text-[18px] text-content-primary">
                ${usdValue.toLocaleString()} USD
              </p>
            </div>

            {/* Slider */}
            <div className="relative w-full h-[20px] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div
                className="absolute top-0 left-0 h-full bg-[var(--glass-border)]"
                style={{ width: `${sliderValue}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSliderValue(val);
                  setAmount(Math.round((val / 100) * 10000));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-content-primary border border-[var(--glass-border)] rounded-full pointer-events-none"
                style={{ left: `calc(${sliderValue}% - 12px)` }}
              />
            </div>

            {/* Yield Text */}
            <p className="font-outfit font-light text-[24px] text-content-primary max-w-[506px]">
              You would earn an extra ${yearlyYieldUSD.toLocaleString()} USD per year.
            </p>

            {/* Token Options */}
            <div className="flex gap-[17px]">
              {/* USDSOL Option */}
              <button
                type="button"
                onClick={() => setSelectedToken('USDSOL')}
                className={`flex gap-2 items-center p-2 transition-colors ${
                  selectedToken === 'USDSOL'
                    ? 'bg-[var(--glass-bg-blue)] border border-blue'
                    : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
                }`}
              >
                <img src="/assets/icons/usdsol-token.png" alt="USDSOL" className="w-12 h-12 object-cover" />
                <div className="flex flex-col items-start">
                  <span className="font-outfit font-bold text-[20px] text-content-primary uppercase">
                    USDSOL
                  </span>
                  <span className="font-kodemono font-normal text-[16px] text-blue-light">
                    {apyRates.USDSOL}% APY
                  </span>
                </div>
              </button>

              {/* PDSOL Option */}
              <button
                type="button"
                onClick={() => setSelectedToken('PDSOL')}
                className={`flex gap-2 items-center p-2 transition-colors ${
                  selectedToken === 'PDSOL'
                    ? 'bg-[var(--glass-bg-gold)] border border-gold'
                    : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
                }`}
              >
                <img src="/assets/icons/pdsol-token.png" alt="PDSOL" className="w-12 h-12 object-cover" />
                <div className="flex flex-col items-start">
                  <span className="font-outfit font-bold text-[20px] text-content-primary uppercase">
                    PDSOL
                  </span>
                  <span className="font-kodemono font-normal text-[16px] text-gold">
                    {apyRates.PDSOL}% APY
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Services Section
// ============================================================================

function ServicesSection() {
  return (
    <section id="services" data-section-label="Services" className="py-32 px-16">
      <div className="max-w-[1440px] mx-auto">
        <SectionHeader label="// APPS" title="Our Services" size="md" />
        <div className="flex flex-col md:flex-row gap-3 mt-8">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              iconSrc={service.iconSrc}
              title={service.title}
              description={service.description}
              ctaText={service.ctaText}
              variant="large"
              accent={service.accent}
              className="w-full md:flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Who We Are Section
// ============================================================================

function WhoWeAreSection() {
  return (
    <section id="about" data-section-label="About" className="py-32 px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Who We Are Header */}
        <div className="flex items-center justify-between">
          <SectionHeader
            label="// ABOUT"
            title="WHO WE ARE"
            size="md"
            showLeftBorder
          />
          <p className="font-outfit font-light text-[16px] text-content-secondary text-right w-[562px] leading-[1.4]">
            Founded in 2021, Phase has been a partner and longtime supporter of the Solana Network. We've championed decentralization, returns, and guarantee satisfaction, yadda yadda.
          </p>
        </div>

        {/* SOC-2 Certified Banner */}
        <div className="flex flex-col gap-3">
          {/* Title Banner */}
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 overflow-hidden">
            <h2 className="font-audiowide text-[48px] md:text-[80px] lg:text-[121px] text-content-primary text-center leading-none whitespace-nowrap">
              SOC-2 CERTIFIED
            </h2>
          </div>

          {/* Stats Row */}
          <div className="flex flex-col md:flex-row gap-3 h-auto md:h-[194px]">
            <div className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 flex flex-col items-center justify-center gap-3">
              <AnimatedNumber
                value="$700M+ USD"
                className="font-audiowide text-[48px] text-primary text-center uppercase"
              />
              <p className="font-kodemono font-normal text-[20px] text-content-secondary">
                Total Assets Staked
              </p>
            </div>
            <div className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 flex flex-col items-center justify-center gap-3">
              <AnimatedNumber
                value="4x"
                className="font-audiowide text-[48px] text-primary text-center uppercase"
              />
              <p className="font-kodemono font-normal text-[20px] text-content-secondary">
                Hackathon Winners
              </p>
            </div>
          </div>

          {/* Team Members Row */}
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            {teamMembers.map((member) => (
              <TeamMember
                key={member.name}
                name={member.name}
                role={member.role}
                avatarUrl={member.avatar}
                href={`https://x.com/${member.twitter}`}
                layout="horizontal"
                className="flex-1 min-w-[120px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Phase Live Section
// ============================================================================

function PhaseLiveSection() {
  return (
    <section id="media" data-section-label="Media" className="py-32">
      <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-16">
        {/* Phase Live Section */}
        <div>
          {/* Header Row */}
          <div className="flex items-end justify-between mb-16">
            <SectionHeader
              label="// MEDIA"
              title="PHASE LIVE"
              size="md"
              showLeftBorder
            />
            <Button
              as="a"
              href="#"
              variant="default"
              size="sm"
              iconName="arrow-up-right"
            >
              VIEW ALL STREAMS
            </Button>
          </div>

          {/* Event Cards */}
          <div className="flex items-center justify-between gap-6">
            {events.map((event) => (
              <EventCard
                key={event.title}
                title={event.title}
                date={event.date}
                ctaText={event.ctaText}
                iconName="play"
              />
            ))}
          </div>
        </div>

        {/* Blog Section */}
        <div>
          {/* Header Row */}
          <div className="flex items-end justify-between mb-16">
            <SectionHeader
              label="// MEDIA"
              title="BLOG"
              size="md"
              showLeftBorder
            />
            <Button
              as="a"
              href="#"
              variant="default"
              size="sm"
              iconName="arrow-up-right"
            >
              VIEW ARCHIVE
            </Button>
          </div>

          {/* Articles */}
          <div className="flex flex-col">
            {articles.map((article) => (
              <ArticleCard
                key={article.title}
                title={article.title}
                description={article.description}
                date={article.date}
                tags={article.tags}
                href="#"
                className="py-8 first:pt-0 last:pb-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Footer
// ============================================================================

function Footer() {
  return (
    <footer id="contact" data-section-label="Contact" className="py-24 px-16 border-t border-edge-secondary relative overflow-hidden">
      {/* Large transparent PHASE SVG logo background - same as hero */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg 
          className="w-full h-auto opacity-[0.03]" 
          viewBox="0 0 1320 238" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M236.563 99.5817C236.563 109.429 235.352 118.226 232.932 125.971C230.511 133.716 227.209 140.576 223.027 146.551C218.955 152.415 214.222 157.45 208.829 161.654C203.437 165.859 197.769 169.289 191.827 171.944C185.993 174.599 180.049 176.537 173.998 177.753C168.054 178.97 162.441 179.579 157.159 179.579H60.0901V158.003V136.427H157.159C162.661 135.984 167.614 134.878 172.016 133.107C176.528 131.226 180.381 128.737 183.572 125.639C186.764 122.541 189.24 118.834 191 114.519C192.762 110.093 193.642 105.114 193.642 99.5817V79.9972C193.091 74.5756 191.937 69.5965 190.175 65.0599C188.414 60.5235 185.993 56.6508 182.911 53.4421C179.94 50.2334 176.308 47.7438 172.016 45.9736C167.724 44.0925 162.772 43.152 157.159 43.152H60.4203C54.6974 43.152 50.3503 44.6457 47.3786 47.6331C44.4072 50.6207 42.9214 54.9358 42.9214 60.5788V238H0V60.5788C0 49.5142 1.981 40.1093 5.94297 32.3641C10.015 24.6188 15.0225 18.3673 20.9654 13.6095C27.0186 8.85169 33.5668 5.42166 40.6103 3.31938C47.6538 1.10646 54.147 0 60.0901 0H157.159C166.843 0 175.538 1.27243 183.241 3.81729C190.946 6.25152 197.715 9.5709 203.547 13.7755C209.49 17.8693 214.497 22.6272 218.57 28.0488C222.752 33.4705 226.163 39.1688 228.805 45.1437C231.556 51.0079 233.537 56.9827 234.747 63.0684C235.958 69.0433 236.563 74.6862 236.563 79.9972V99.5817ZM316.629 97.2581H467.349V0H510.27V238H467.349V140.742H316.629V238H273.707V0H316.629V97.2581ZM792.892 238H749.97V179.579H599.086V238H556.164V119C556.164 101.629 559.135 85.6402 565.077 71.0349C571.021 56.4296 579.275 43.8712 589.841 33.3598C600.406 22.8484 612.897 14.6606 627.314 8.79638C641.731 2.93213 657.469 0 674.527 0H771.266C774.238 0 777.044 0.553232 779.684 1.65969C782.327 2.76615 784.637 4.3152 786.619 6.30684C788.6 8.29847 790.14 10.622 791.24 13.2776C792.341 15.9331 792.892 18.7546 792.892 21.742V238ZM599.086 136.427H749.97V43.152H674.527C673.207 43.152 670.4 43.3733 666.108 43.8158C661.926 44.1479 657.029 45.0883 651.417 46.6374C645.913 48.1865 640.081 50.5653 633.917 53.774C627.754 56.9827 622.086 61.4087 616.913 67.0516C611.742 72.6945 607.448 79.7759 604.037 88.2957C600.735 96.7048 599.086 106.94 599.086 119V136.427ZM1070.4 167.961C1070.4 176.481 1069.29 184.171 1067.09 191.03C1065 197.781 1062.2 203.755 1058.68 208.955C1055.15 214.156 1051.03 218.581 1046.29 222.233C1041.56 225.884 1036.66 228.872 1031.6 231.195C1026.54 233.518 1021.37 235.233 1016.08 236.34C1010.91 237.448 1006.01 238 1001.39 238H835.814V194.847H1001.39C1009.65 194.847 1016.03 192.414 1020.54 187.546C1025.16 182.677 1027.47 176.149 1027.47 167.961C1027.47 163.978 1026.87 160.326 1025.66 157.007C1024.45 153.688 1022.69 150.811 1020.38 148.377C1018.17 145.942 1015.42 144.061 1012.12 142.734C1008.93 141.406 1005.35 140.742 1001.39 140.742H902.671C895.739 140.742 888.255 139.525 880.22 137.091C872.187 134.546 864.702 130.507 857.769 124.975C850.945 119.443 845.223 112.195 840.601 103.233C836.088 94.2707 833.833 83.3166 833.833 70.3709C833.833 57.4255 836.088 46.5267 840.601 37.6751C845.223 28.7126 850.945 21.4654 857.769 15.9331C864.702 10.2901 872.187 6.25152 880.22 3.81729C888.255 1.27243 895.739 0 902.671 0H1048.77V43.152H902.671C894.528 43.152 888.145 45.6416 883.522 50.6207C879.01 55.5997 876.753 62.1831 876.753 70.3709C876.753 78.6696 879.01 85.253 883.522 90.1213C888.145 94.8791 894.528 97.2581 902.671 97.2581H1001.39H1001.72C1006.34 97.3688 1011.24 98.0326 1016.41 99.2496C1021.59 100.356 1026.7 102.126 1031.77 104.561C1036.94 106.995 1041.84 110.093 1046.46 113.855C1051.08 117.506 1055.15 121.932 1058.68 127.133C1062.31 132.333 1065.17 138.308 1067.26 145.057C1069.35 151.807 1070.4 159.441 1070.4 167.961ZM1300.69 140.742H1165.15V97.2581H1300.69V140.742ZM1320 238H1165.15C1159.21 238 1152.72 236.95 1145.67 234.847C1138.63 232.745 1132.08 229.314 1126.03 224.557C1120.09 219.688 1115.08 213.437 1111.01 205.802C1107.04 198.056 1105.06 188.596 1105.06 177.422V21.742C1105.06 18.7546 1105.61 15.9331 1106.71 13.2776C1107.82 10.622 1109.3 8.29847 1111.17 6.30684C1113.15 4.3152 1115.46 2.76615 1118.1 1.65969C1120.75 0.553232 1123.61 0 1126.69 0H1320V43.152H1147.99V177.422C1147.99 183.065 1149.47 187.38 1152.44 190.367C1155.41 193.355 1159.76 194.847 1165.48 194.847H1320V238Z" fill="currentColor" className="text-content-primary" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* EST. 2021 */}
          <p className="font-kodemono text-xs text-content-secondary">
            EST. 2021
          </p>

          {/* Footer Nav - Centered */}
          <nav className="flex flex-wrap gap-4 justify-center md:flex-1">
            {navLinks.map((link, i) => (
              <React.Fragment key={link}>
                <NavLink variant="footer" href={`#${link.toLowerCase()}`}>
                  {link}
                </NavLink>
                {i < navLinks.length - 1 && (
                  <span className="font-kodemono text-content-secondary">//</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Legal */}
          <p className="font-kodemono text-xs text-content-secondary">
            LEGAL
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Main Page
// ============================================================================

// Primary navigation for the floating menu bar
const primaryNav = [
  {
    label: 'STAKE',
    href: '#stake',
    children: [
      { label: 'Native Staking', href: '/stake/native' },
      { label: 'Liquid Staking', href: '/stake/liquid' },
      { label: 'Run a Validator', href: '/stake/validator' },
    ],
  },
  {
    label: 'DELEGATION',
    href: '#delegation',
    children: [
      { label: 'Apply for Stake', href: '/delegation/apply' },
      { label: 'Validator List', href: '/delegation/validators' },
    ],
  },
  { label: 'TAX', href: '/tax' },
  { label: 'MEDIA', href: '#media' },
  { label: 'CONTACT', href: '#contact' },
];

export default function PhaseLandingPage() {
  return (
    <main>
      <FloatingMenuBar
        primaryNav={primaryNav}
        autoDiscoverSections={true}
      />
      <HeroSection />
      <LogoSection />
      <StakeCalculator />
      <ServicesSection />
      <WhoWeAreSection />
      <PhaseLiveSection />
      <Footer />
    </main>
  );
}
