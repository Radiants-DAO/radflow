# RadFlow Feature Specifications

## What is RadFlow?

RadFlow is a visual design system editor for web applications. It provides a real-time interface for editing design tokens, typography, and components directly in the browser, with changes persisting to source files.

RadFlow treats the visual editor as the source of truth. Designers and developers make changes visually, and those changes flow directly to code.

---

## Core Philosophy

### Visual-First Editing
Every design decision should be made visually, not by editing code. RadFlow provides immediate visual feedback for all changes, eliminating the edit-save-refresh cycle.

### Direct Persistence
Changes made in RadFlow write directly to source files. There is no export step, no copy-paste, no intermediary format. The visual editor and the codebase are always in sync.

### Non-Destructive Editing
All changes are tracked as pending until explicitly saved. Users can experiment freely and discard changes without risk. The system never auto-saves without user intent.

### Context-Aware Targeting
RadFlow understands the structure of design systems. It knows the difference between a base color and a semantic token, between a typography rule and a component style. Edits target the appropriate location automatically.

---

## Architecture

**The editor is the console. The theme is the game.**

RadFlow Editor is a tool for working with themes. Themes contain everything — components, tokens, typography, visual identity. The editor discovers and presents what themes provide.

---

## Feature Areas

| Area | Description |
|------|-------------|
| [Variables Editor](./01-variables-editor.md) | Design tokens: colors, shadows, spacing, border radius |
| [Typography Editor](./02-typography-editor.md) | Font management, text styles, fluid scaling |
| [Component Browser](./03-component-browser.md) | Discover, preview, and edit theme components |
| [Theme System](./04-theme-system.md) | Theme structure, component library, tokens, switching |
| [Assets Manager](./05-assets-manager.md) | Icons, logos, images, media file management |
| [Tools & Modes](./06-tools-and-modes.md) | Component ID, text editing, help system |
| [Search & Navigation](./07-search-and-navigation.md) | Global search, keyboard shortcuts, navigation |
| [Canvas Editor](./08-canvas-editor.md) | System-level view, multi-select, layers panel (future) |

---

## Design Principles

### Immediate Feedback
Every interaction produces visible results within 16ms. No spinners for local operations. Users should feel they are manipulating the design directly, not waiting for a system to respond.

### Minimal UI, Maximum Function
The interface stays out of the way. Tools appear when needed and disappear when not. The user's design is always the focus, not the editor chrome.

### Keyboard-First Power Users
Every action has a keyboard shortcut. Power users should never need to reach for the mouse. The interface rewards learning with increased speed.

### Graceful Degradation
If a feature cannot determine the correct target, it fails visibly with clear guidance. No silent failures. No corrupted state. Users always know what happened and why.

### Undo Everything
No action is permanent until explicitly saved. Even after saving, the source control integration allows reverting any change. Users should feel safe to experiment.

---

## Research Notes

### Research Required
**None** — This is an architectural overview document. Individual features have their own research sections.

### Rust Backend Integration
**None** — This is an index file. See `10-tauri-architecture.md` for backend architecture.
