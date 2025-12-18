/**
 * Generate a CSS selector for an element
 * Priority: data-testid > id > built path
 */
export function generateSelector(element: HTMLElement): string {
  // Priority 1: data-testid
  if (element.dataset.testid) {
    return `[data-testid="${element.dataset.testid}"]`;
  }

  // Priority 2: unique ID
  if (element.id) {
    return `#${element.id}`;
  }

  // Priority 3: Build path
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    // Add classes if present (limit to 2 for readability)
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .split(' ')
        .filter((c) => c && !c.includes(':') && !c.includes('['))
        .slice(0, 2);
      if (classes.length) {
        selector += '.' + classes.join('.');
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (el) => el.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Get a text preview of an element's content
 */
export function getElementPreview(element: HTMLElement): string {
  const text = element.textContent?.trim().slice(0, 50);
  return text ? `"${text}${text.length >= 50 ? '...' : ''}"` : `<${element.tagName.toLowerCase()}>`;
}

/**
 * Get the DOM path of an element as an array
 */
export function getElementPath(element: HTMLElement): string[] {
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    path.unshift(current.tagName.toLowerCase());
    current = current.parentElement;
  }

  return path;
}

/**
 * Find element by selector safely
 */
export function findElementBySelector(selector: string): HTMLElement | null {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

