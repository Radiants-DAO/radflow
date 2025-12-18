# RadTools

A Webflow-like visual editing dev tools system for Next.js + Tailwind v4 projects.

## Features

- **Variables Tab** - Manage design tokens (brand colors, semantic tokens, color modes, border radius)
- **Components Tab** - Auto-discover components from `/components/` directory with prop information
- **Assets Tab** - Upload, organize, and optimize images in `public/assets/`
- **Comments Tab** - Pin comments to DOM elements for feedback
- **Mock States Tab** - Simulate auth, wallet, subscription states during development
- **Changelog Tab** - Track project changes with categorized entries

## Quick Start

1. Press `⇧⌘K` (Mac) or `⇧Ctrl+K` (Windows/Linux) to toggle the dev tools panel
2. The panel is draggable - move it wherever you like
3. Switch between tabs to access different features

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⇧⌘K` / `⇧Ctrl+K` | Toggle dev tools panel |
| `Esc` | Exit comment mode / close modals |

## Tab Guide

### Variables Tab
Edit your design tokens visually:
- Add/edit/delete brand colors and neutrals
- Create semantic tokens that reference brand colors
- Toggle color modes (dark mode preview)
- Adjust border radius values
- Click "Save to CSS" to write changes to `app/globals.css`

### Components Tab
Discover all components in your `/components/` directory:
- Auto-scans for default exports
- Displays prop types, required status, and default values
- Click "Refresh" to rescan after adding new components

### Assets Tab
Manage files in `public/assets/`:
- Drag and drop to upload images
- Organize into folders (icons, images, logos, backgrounds)
- Select images and click "Optimize" for Sharp-based compression
- Delete assets directly from the UI

### Comments Tab
Add feedback comments pinned to DOM elements:
- Click "Add Comment" to enter comment mode
- Click any element on the page to add a comment
- View all comments in a filterable list
- Toggle pins on/off
- Reply to and resolve comments

### Mock States Tab
Simulate different app states:
- Pre-configured presets for auth, wallet, and subscription states
- Create custom mock states with JSON values
- Use `useMockState('category')` hook in components to consume mock data
- Only one state per category can be active at a time

### Changelog Tab
Track project changes:
- Add entries with type (feature, fix, refactor, style, chore)
- List affected files
- Entries persist across sessions
- Export or clear the changelog

## Using Mock States in Components

```tsx
import { useMockState } from '@/devtools';

function UserProfile() {
  const mockAuth = useMockState('auth');
  const realAuth = useRealAuthHook();
  
  // In development with mock active: use mock
  // In development without mock: use real
  // In production: mock is undefined, use real
  const auth = mockAuth ?? realAuth;
  
  if (!auth?.isAuthenticated) return <LoginPrompt />;
  return <Profile user={auth.user} />;
}
```

## Adding Changelog Entries Programmatically

```tsx
import { useDevToolsStore } from '@/devtools';

// After completing a feature
useDevToolsStore.getState().addChangelogEntry({
  type: 'feature',
  description: 'Added responsive navigation menu',
  files: ['components/layout/Nav.tsx', 'app/globals.css'],
  author: 'Your Name',
});
```

## Production Safety

- Dev tools are automatically excluded from production builds
- `NODE_ENV === 'production'` check prevents rendering
- API routes return 403 in production
- `useMockState()` returns `undefined` in production

## File Structure

```
/devtools/
├── index.ts              # Public exports
├── DevToolsProvider.tsx  # Main provider
├── DevToolsPanel.tsx     # Panel with tabs
├── store/                # Zustand store
├── tabs/                 # Tab components
├── components/           # Shared UI components
├── hooks/                # Custom hooks
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## Dependencies

- `zustand` - State management
- `react-draggable` - Draggable panel
- `sharp` - Image optimization (API routes)
