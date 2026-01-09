'use client';

import type { Tab } from '../types';
import { SecondaryNavigation } from './SecondaryNavigation';
import { PrimaryNavigationFooter } from './PrimaryNavigationFooter';

interface ContextualFooterProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  // Components tab props
  componentSubTab?: string;
  onComponentSubTabChange?: (tab: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onAddComponentFolder?: (folderName: string) => void;
  // Typography tab props
  typographySearchQuery?: string;
  onTypographySearchChange?: (query: string) => void;
}

export function ContextualFooter({
  activeTab,
  onTabChange,
  componentSubTab,
  onComponentSubTabChange,
  componentTabs,
  onAddComponentFolder,
  typographySearchQuery,
  onTypographySearchChange,
}: ContextualFooterProps) {
  return (
    <>
      {/* Primary Navigation Footer (always visible) */}
      <PrimaryNavigationFooter
        activeTab={activeTab}
        typographySearchQuery={typographySearchQuery}
        onTypographySearchChange={onTypographySearchChange}
      />
    </>
  );
}

