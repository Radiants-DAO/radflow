'use client';

import React from 'react';
import {
  Tag,
  StatCard,
  ServiceCard,
  TeamMember,
  ArticleCard,
  EventCard,
  NavLink,
  SectionHeader,
  LogoGrid,
} from '../components/landing';

// ============================================================================
// Phase Theme Colors (for reference in styling)
// ============================================================================
// Background: #090908 / #14141e
// Text: #f3eed9 (cream)
// Border: rgba(243,238,217,0.2)
// Grey text: #9a957e
// Accent/Gold: #fce184

// ============================================================================
// Section Component
// ============================================================================

function Section({
  title,
  children,
  variant = 'h3',
  subsectionId,
  className,
  'data-edit-scope': editScope,
  'data-component': component,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'h3' | 'h4';
  subsectionId?: string;
  className?: string;
  'data-edit-scope'?: string;
  'data-component'?: string;
}) {
  const HeadingTag = variant === 'h4' ? 'h4' : 'h3';
  const hasMarginOverride = className?.includes('mb-');
  const isSubsection = variant === 'h4';
  const subsectionClasses = isSubsection ? 'p-4 border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)]' : '';
  const baseClasses = `${hasMarginOverride ? '' : 'mb-4'} ${subsectionClasses} rounded flex flex-col gap-4`.trim();
  return (
    <div
      className={`${baseClasses} ${className || ''}`}
      data-subsection-id={subsectionId}
      data-edit-scope={editScope}
      data-component={component}
      {...rest}
    >
      <HeadingTag className="font-audiowide text-content-primary">{title}</HeadingTag>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="text-[var(--color-content-tertiary)] text-xs font-kodemono">{props}</code>
  );
}

function Row({ children, props }: { children: React.ReactNode; props?: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}

// ============================================================================
// Tag Content
// ============================================================================

function TagsContent() {
  return (
    <div className="space-y-6">
      <Section title="Tag Variants" variant="h4" subsectionId="tag-variants">
        <Row props='variant="default" | "outline" | "accent"'>
          <Tag variant="default" data-edit-scope="component-definition" data-component="Tag">Technical</Tag>
          <Tag variant="default" data-edit-scope="component-definition" data-component="Tag">Validators</Tag>
          <Tag variant="outline" data-edit-scope="component-definition" data-component="Tag" data-edit-variant="outline">Protocol</Tag>
          <Tag variant="accent" data-edit-scope="component-definition" data-component="Tag" data-edit-variant="accent">New</Tag>
        </Row>
      </Section>

      <Section title="Tag Usage" variant="h4" subsectionId="tag-usage">
        <Row props='Multiple tags in a row'>
          <div className="flex gap-2">
            <Tag>Staking</Tag>
            <Tag>DeFi</Tag>
            <Tag>Solana</Tag>
            <Tag variant="accent">Featured</Tag>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Stat Card Content
// ============================================================================

function StatCardsContent() {
  return (
    <div className="space-y-6">
      <Section title="StatCard Variants" variant="h4" subsectionId="statcard-variants">
        <Row props='variant="default" | "compact" | "highlight"'>
          <div className="flex gap-3">
            <StatCard
              label="/native"
              value="9% APR"
              data-edit-scope="component-definition"
              data-component="StatCard"
            />
            <StatCard
              label="/liquid"
              value="15% APR"
              data-edit-scope="component-definition"
              data-component="StatCard"
            />
            <StatCard
              label="/validators"
              value="35 Connected"
              data-edit-scope="component-definition"
              data-component="StatCard"
            />
          </div>
        </Row>
      </Section>

      <Section title="StatCard Highlight" variant="h4" subsectionId="statcard-highlight">
        <Row props='variant="highlight"'>
          <StatCard
            label="Total Value Locked"
            value="$700M+"
            variant="highlight"
            sublabel="USD"
            data-edit-scope="component-definition"
            data-component="StatCard"
            data-edit-variant="highlight"
          />
        </Row>
      </Section>

      <Section title="StatCard with Sublabel" variant="h4" subsectionId="statcard-sublabel">
        <Row props='sublabel="..."'>
          <StatCard
            label="Validators"
            value="4x"
            sublabel="Redundancy Uptime"
            data-edit-scope="component-definition"
            data-component="StatCard"
          />
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Service Card Content
// ============================================================================

function ServiceCardsContent() {
  return (
    <div className="space-y-6">
      <Section title="ServiceCard Default" variant="h4" subsectionId="servicecard-default">
        <Row props='iconName, title, description, ctaText'>
          <div className="grid grid-cols-3 gap-4 w-full max-w-[900px]">
            <ServiceCard
              iconName="stack"
              title="Stake Services"
              description="The leading institutional Staking & Compliance infrastructure for Solana."
              ctaText="Run a Validator"
              data-edit-scope="component-definition"
              data-component="ServiceCard"
            />
            <ServiceCard
              iconName="users"
              title="Delegation"
              description="Set-and-forget native delegation to high consensus, high-growth staking providers."
              ctaText="Apply for Stake"
              data-edit-scope="component-definition"
              data-component="ServiceCard"
            />
            <ServiceCard
              iconName="file-text"
              title="Taxes"
              description="Solana-specific crypto reporting for token swaps, yield farming, air drops, and NFTs."
              ctaText="File My Taxes"
              data-edit-scope="component-definition"
              data-component="ServiceCard"
            />
          </div>
        </Row>
      </Section>

      <Section title="ServiceCard Featured" variant="h4" subsectionId="servicecard-featured">
        <Row props='variant="featured"'>
          <div className="w-[300px]">
            <ServiceCard
              iconName="star"
              title="Premium Service"
              description="Enterprise-grade staking with dedicated support and custom SLAs."
              ctaText="Contact Us"
              variant="featured"
              data-edit-scope="component-definition"
              data-component="ServiceCard"
              data-edit-variant="featured"
            />
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Team Member Content
// ============================================================================

function TeamMembersContent() {
  return (
    <div className="space-y-6">
      <Section title="TeamMember Sizes" variant="h4" subsectionId="teammember-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="flex gap-8">
            <TeamMember
              name="Brandon"
              role="CEO"
              size="sm"
              data-edit-scope="component-definition"
              data-component="TeamMember"
            />
            <TeamMember
              name="Dan"
              role="CTO"
              size="md"
              data-edit-scope="component-definition"
              data-component="TeamMember"
            />
            <TeamMember
              name="Sarah"
              role="COO"
              size="lg"
              data-edit-scope="component-definition"
              data-component="TeamMember"
            />
          </div>
        </Row>
      </Section>

      <Section title="TeamMember with Avatar" variant="h4" subsectionId="teammember-avatar">
        <Row props='avatarUrl="..."'>
          <div className="flex gap-6">
            <TeamMember
              name="Alex"
              role="Engineer"
              avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"
              data-edit-scope="component-definition"
              data-component="TeamMember"
            />
            <TeamMember
              name="Jordan"
              role="Designer"
              avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
              data-edit-scope="component-definition"
              data-component="TeamMember"
            />
          </div>
        </Row>
      </Section>

      <Section title="TeamMember Row" variant="h4" subsectionId="teammember-row">
        <Row props='Team display row'>
          <div className="flex gap-8">
            <TeamMember name="Brandon" role="CEO" />
            <TeamMember name="Dan" role="CTO" />
            <TeamMember name="Sarah" role="COO" />
            <TeamMember name="Gabriel" role="CFO" />
            <TeamMember name="Jeff" role="Lead Dev" />
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Article Card Content
// ============================================================================

function ArticleCardsContent() {
  return (
    <div className="space-y-6">
      <Section title="ArticleCard Default" variant="h4" subsectionId="articlecard-default">
        <Row props='title, description, date, tags, ctaText'>
          <div className="w-full max-w-[1280px]">
            <ArticleCard
              title="Validator Infrastructure Deep Dive"
              description="Running a Phase validator requires specific high-availability hardware configurations to ensure network stability. This guide covers the recommended specs, slashing conditions, and reward structures for node..."
              date="10.06.2024"
              tags={['Technical', 'Validators']}
              data-edit-scope="component-definition"
              data-component="ArticleCard"
            />
          </div>
        </Row>
      </Section>

      <Section title="ArticleCard Stack" variant="h4" subsectionId="articlecard-stack">
        <Row props='Multiple articles'>
          <div className="w-full max-w-[1280px] space-y-4">
            <ArticleCard
              title="Q3 Roadmap Update"
              description="The Q3 roadmap focuses on major Solana ecosystem integrations, specifically liquid staking and smart..."
              date="09.15.2024"
              tags={['Roadmap', 'Updates']}
            />
            <ArticleCard
              title="Introducing Phase: The Next Evolution"
              description="Phase Tech Labs is live, offering liquid Phase's ease of use for high-yield liquid staking options..."
              date="08.01.2024"
              tags={['Announcement']}
            />
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Event Card Content
// ============================================================================

function EventCardsContent() {
  return (
    <div className="space-y-6">
      <Section title="EventCard Default" variant="h4" subsectionId="eventcard-default">
        <Row props='title, date, ctaText, iconName'>
          <div className="flex gap-4">
            <EventCard
              title="Dev Workshop: Building on Phase SDK"
              date="Dec 09"
              ctaText="WATCH ON X"
              data-edit-scope="component-definition"
              data-component="EventCard"
            />
            <EventCard
              title="Phase Live Weekly Community Call"
              date="Dec 12"
              ctaText="JOIN LIVE"
              iconName="video"
              data-edit-scope="component-definition"
              data-component="EventCard"
            />
            <EventCard
              title="Mainnet Launch Event"
              date="Dec 15"
              ctaText="REGISTER"
              iconName="calendar"
              data-edit-scope="component-definition"
              data-component="EventCard"
            />
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Navigation Content
// ============================================================================

function NavigationContent() {
  return (
    <div className="space-y-6">
      <Section title="NavLink Variants" variant="h4" subsectionId="navlink-variants">
        <Row props='variant="default" | "large" | "footer"'>
          <div className="flex gap-6 items-center">
            <NavLink variant="default" data-edit-scope="component-definition" data-component="NavLink">Stake</NavLink>
            <NavLink variant="default" data-edit-scope="component-definition" data-component="NavLink">Delegation</NavLink>
            <NavLink variant="default" active data-edit-scope="component-definition" data-component="NavLink">Tax</NavLink>
            <NavLink variant="default" data-edit-scope="component-definition" data-component="NavLink">Media</NavLink>
            <NavLink variant="default" data-edit-scope="component-definition" data-component="NavLink">Contact</NavLink>
          </div>
        </Row>
      </Section>

      <Section title="NavLink Large" variant="h4" subsectionId="navlink-large">
        <Row props='variant="large"'>
          <div className="flex flex-col gap-2">
            <NavLink variant="large" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="large">Tax</NavLink>
            <NavLink variant="large" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="large">Blog</NavLink>
            <NavLink variant="large" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="large">Staking</NavLink>
            <NavLink variant="large" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="large">Contact</NavLink>
            <NavLink variant="large" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="large">Delegation</NavLink>
          </div>
        </Row>
      </Section>

      <Section title="NavLink Footer" variant="h4" subsectionId="navlink-footer">
        <Row props='variant="footer"'>
          <div className="flex gap-4">
            <NavLink variant="footer" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="footer">TAX</NavLink>
            <span className="text-content-secondary">//</span>
            <NavLink variant="footer" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="footer">STAKE</NavLink>
            <span className="text-content-secondary">//</span>
            <NavLink variant="footer" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="footer">DELEGATION</NavLink>
            <span className="text-content-secondary">//</span>
            <NavLink variant="footer" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="footer">CONTACT</NavLink>
            <span className="text-content-secondary">//</span>
            <NavLink variant="footer" data-edit-scope="component-definition" data-component="NavLink" data-edit-variant="footer">BLOG</NavLink>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Section Header Content
// ============================================================================

function SectionHeadersContent() {
  return (
    <div className="space-y-6">
      <Section title="SectionHeader Sizes" variant="h4" subsectionId="sectionheader-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="space-y-8 w-full">
            <SectionHeader
              title="Our Services"
              size="sm"
              data-edit-scope="component-definition"
              data-component="SectionHeader"
            />
            <SectionHeader
              title="Our Services"
              size="md"
              data-edit-scope="component-definition"
              data-component="SectionHeader"
            />
            <SectionHeader
              title="Our Services"
              size="lg"
              data-edit-scope="component-definition"
              data-component="SectionHeader"
            />
          </div>
        </Row>
      </Section>

      <Section title="SectionHeader with Label" variant="h4" subsectionId="sectionheader-label">
        <Row props='label="..."'>
          <SectionHeader
            label="About Us"
            title="Who We Are"
            subtitle="Founded in 2021, Phase has become a leading provider of staking infrastructure for the Solana ecosystem."
            data-edit-scope="component-definition"
            data-component="SectionHeader"
          />
        </Row>
      </Section>

      <Section title="SectionHeader Centered" variant="h4" subsectionId="sectionheader-centered">
        <Row props='align="center"'>
          <SectionHeader
            title="Phase Live"
            subtitle="Watch our latest community calls and development updates"
            align="center"
            data-edit-scope="component-definition"
            data-component="SectionHeader"
          />
        </Row>
      </Section>

      <Section title="SectionHeader with Line" variant="h4" subsectionId="sectionheader-line">
        <Row props='showLine={true}'>
          <SectionHeader
            title="Blog"
            showLine
            data-edit-scope="component-definition"
            data-component="SectionHeader"
          />
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Logo Grid Content
// ============================================================================

function LogoGridContent() {
  const sampleLogos = [
    { src: 'https://via.placeholder.com/120x32/1a1a1a/f3eed9?text=Solana', alt: 'Solana' },
    { src: 'https://via.placeholder.com/120x32/1a1a1a/f3eed9?text=Jito', alt: 'Jito' },
    { src: 'https://via.placeholder.com/120x32/1a1a1a/f3eed9?text=Marinade', alt: 'Marinade' },
    { src: 'https://via.placeholder.com/120x32/1a1a1a/f3eed9?text=Phantom', alt: 'Phantom' },
  ];

  return (
    <div className="space-y-6">
      <Section title="LogoGrid Default" variant="h4" subsectionId="logogrid-default">
        <Row props='logos, columns, logoSize'>
          <LogoGrid
            logos={sampleLogos}
            columns={4}
            data-edit-scope="component-definition"
            data-component="LogoGrid"
          />
        </Row>
      </Section>

      <Section title="LogoGrid Sizes" variant="h4" subsectionId="logogrid-sizes">
        <Row props='logoSize="sm" | "md" | "lg"'>
          <div className="space-y-6">
            <LogoGrid logos={sampleLogos.slice(0, 2)} logoSize="sm" />
            <LogoGrid logos={sampleLogos.slice(0, 2)} logoSize="md" />
            <LogoGrid logos={sampleLogos.slice(0, 2)} logoSize="lg" />
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Component Sections
// ============================================================================

const COMPONENT_SECTIONS = [
  { id: 'tags', title: 'Tags', content: <TagsContent /> },
  { id: 'stat-cards', title: 'Stat Cards', content: <StatCardsContent /> },
  { id: 'service-cards', title: 'Service Cards', content: <ServiceCardsContent /> },
  { id: 'team-members', title: 'Team Members', content: <TeamMembersContent /> },
  { id: 'article-cards', title: 'Article Cards', content: <ArticleCardsContent /> },
  { id: 'event-cards', title: 'Event Cards', content: <EventCardsContent /> },
  { id: 'navigation', title: 'Navigation', content: <NavigationContent /> },
  { id: 'section-headers', title: 'Section Headers', content: <SectionHeadersContent /> },
  { id: 'logo-grid', title: 'Logo Grid', content: <LogoGridContent /> },
];

interface LandingUITabProps {
  searchQuery?: string;
}

export function LandingUITab({ searchQuery: propSearchQuery = '' }: LandingUITabProps) {
  const searchQuery = propSearchQuery;

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? COMPONENT_SECTIONS.filter((section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMPONENT_SECTIONS;

  return (
    <div className="flex flex-col h-full overflow-auto bg-surface-primary font-outfit text-content-primary">
      <div className="space-y-0 p-6">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-6">
              <Section title={section.title}>
                {section.content}
              </Section>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[var(--color-content-subtle)] font-audiowide text-base">
            No components match &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingUITab;
