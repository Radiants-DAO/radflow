'use client';

import type { Tab } from '../types';

export interface NavigationTarget {
  tabId: Tab;
  subTabId?: string;
  sectionId?: string;
  subsectionId?: string;
  elementId?: string;  // For typography sections: id="typography-{section}"
  elementSelector?: string;
}

export interface ScrollOptions {
  behavior?: 'smooth' | 'instant';
  block?: 'start' | 'center' | 'nearest';
  spotlight?: boolean;
  spotlightDuration?: number;
}

// Component name to subsection mapping for common components
const COMPONENT_TO_SUBSECTION: Record<string, string> = {
  'button': 'button-variants',
  'card': 'card-variants',
  'input': 'text-inputs',
  'textarea': 'textarea',
  'select': 'select',
  'checkbox': 'checkbox-radio',
  'radio': 'checkbox-radio',
  'radiogroup': 'checkbox-radio',
  'switch': 'switch',
  'slider': 'slider',
  'badge': 'badge-variants',
  'alert': 'alert',
  'progress': 'progress',
  'spinner': 'spinner',
  'skeleton': 'skeleton',
  'tooltip': 'tooltip',
  'toast': 'toast',
  'avatar': 'avatar',
  'table': 'table',
  'breadcrumbs': 'breadcrumbs',
  'tabs': 'tabs-pill-variant',
  'divider': 'dividers',
  'dialog': 'dialog',
  'dropdownmenu': 'dropdown-menu',
  'popover': 'popover',
  'sheet': 'sheet',
  'helppanel': 'help-panel',
  'contextmenu': 'context-menu',
  'label': 'text-inputs',
};

// Section ID to first subsection mapping
const SECTION_TO_FIRST_SUBSECTION: Record<string, string> = {
  'buttons': 'button-variants',
  'cards': 'card-variants',
  'forms': 'text-inputs',
  'feedback': 'alert',
  'data-display': 'avatar',
  'navigation': 'breadcrumbs',
  'overlays': 'dialog',
};

// Typography section mappings
const TYPOGRAPHY_SECTIONS: Record<string, string> = {
  'headings': 'typography-headings',
  'heading': 'typography-headings',
  'h1': 'typography-headings',
  'h2': 'typography-headings',
  'h3': 'typography-headings',
  'h4': 'typography-headings',
  'h5': 'typography-headings',
  'h6': 'typography-headings',
  'text': 'typography-text',
  'paragraph': 'typography-text',
  'p': 'typography-text',
  'lists': 'typography-lists',
  'list': 'typography-lists',
  'ul': 'typography-lists',
  'ol': 'typography-lists',
  'li': 'typography-lists',
  'code': 'typography-code',
  'pre': 'typography-code',
  'semantic': 'typography-semantic',
  'quotations': 'typography-quotations',
  'blockquote': 'typography-quotations',
  'quote': 'typography-quotations',
  'captions': 'typography-captions',
  'caption': 'typography-captions',
  'figcaption': 'typography-captions',
};

/**
 * Resolve a component name to a navigation target
 */
export function resolveComponentNavigation(componentName: string): NavigationTarget | null {
  const nameLower = componentName.toLowerCase();

  // 1. Check typography sections first (for elements like h1, p, etc.)
  if (TYPOGRAPHY_SECTIONS[nameLower]) {
    return {
      tabId: 'typography',
      elementId: TYPOGRAPHY_SECTIONS[nameLower],
    };
  }

  // 2. Direct component name → subsection mapping
  if (COMPONENT_TO_SUBSECTION[nameLower]) {
    return {
      tabId: 'components',
      subTabId: 'design-system',
      subsectionId: COMPONENT_TO_SUBSECTION[nameLower],
    };
  }

  // 3. Check if it's a section name
  if (SECTION_TO_FIRST_SUBSECTION[nameLower]) {
    return {
      tabId: 'components',
      subTabId: 'design-system',
      sectionId: nameLower,
      subsectionId: SECTION_TO_FIRST_SUBSECTION[nameLower],
    };
  }

  // 4. Try plural form (e.g., "Button" -> "buttons")
  const pluralName = nameLower + 's';
  if (SECTION_TO_FIRST_SUBSECTION[pluralName]) {
    return {
      tabId: 'components',
      subTabId: 'design-system',
      sectionId: pluralName,
      subsectionId: SECTION_TO_FIRST_SUBSECTION[pluralName],
    };
  }

  // 5. Fallback: default to components tab
  return {
    tabId: 'components',
    subTabId: 'design-system',
  };
}

/**
 * Resolve a typography section to a navigation target
 */
export function resolveTypographyNavigation(sectionId: string): NavigationTarget | null {
  const elementId = `typography-${sectionId}`;
  return {
    tabId: 'typography',
    sectionId,
    elementId,
  };
}

/**
 * Scroll to a target element within the DevTools panel
 */
export function scrollToTarget(
  target: NavigationTarget,
  options: ScrollOptions = {}
): HTMLElement | null {
  const {
    behavior = 'smooth',
    block = 'center',
    spotlight = false,
    spotlightDuration = 2000
  } = options;

  let element: HTMLElement | null = null;

  // Find element by elementId (for typography sections)
  if (target.elementId) {
    element = document.getElementById(target.elementId) as HTMLElement;
  }

  // Find element by subsectionId (for component sections)
  if (!element && target.subsectionId) {
    element = document.querySelector(
      `[data-subsection-id="${target.subsectionId}"]`
    ) as HTMLElement;
  }

  // Fallback to elementSelector
  if (!element && target.elementSelector) {
    element = document.querySelector(target.elementSelector) as HTMLElement;
  }

  // Fallback: find first subsection in the section
  if (!element && target.sectionId) {
    element = document.querySelector(
      `[data-subsection-id]`
    ) as HTMLElement;
  }

  if (element) {
    element.scrollIntoView({ behavior, block });

    if (spotlight) {
      applySpotlight(element, spotlightDuration);
    }

    return element;
  }

  return null;
}

let currentSpotlightCleanup: (() => void) | null = null;

/**
 * Apply spotlight effect: dim everything except the target element
 */
export function applySpotlight(element: HTMLElement, duration = 2000): () => void {
  // Clean up any existing spotlight
  if (currentSpotlightCleanup) {
    currentSpotlightCleanup();
  }

  // Mark target element
  element.setAttribute('data-spotlight-target', 'true');

  // Find and mark panel
  const panel = element.closest('[data-radtools-panel]');
  panel?.classList.remove('spotlight-fading');
  panel?.classList.add('spotlight-active');

  // Cleanup function
  const cleanup = () => {
    element.removeAttribute('data-spotlight-target');
    panel?.classList.remove('spotlight-active');
    panel?.classList.remove('spotlight-fading');
    currentSpotlightCleanup = null;
  };

  currentSpotlightCleanup = cleanup;

  // Skip auto-cleanup if duration is 0 (persistent spotlight for preview)
  if (duration === 0) {
    return cleanup;
  }

  // Auto-cleanup after duration
  const timer = setTimeout(() => {
    panel?.classList.add('spotlight-fading');
    setTimeout(() => {
      cleanup();
    }, 500);
  }, duration);

  // Cleanup on user interaction within panel
  const handleInteraction = (e: Event) => {
    // Don't clear if clicking the spotlighted element itself
    if (element.contains(e.target as Node)) {
      return;
    }
    clearTimeout(timer);
    cleanup();
  };

  panel?.addEventListener('mousedown', handleInteraction, { once: true });

  return cleanup;
}

/**
 * Clear any active spotlight
 */
export function clearSpotlight(): void {
  if (currentSpotlightCleanup) {
    currentSpotlightCleanup();
  }
}
