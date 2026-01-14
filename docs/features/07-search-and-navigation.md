# Search & Navigation

## Purpose

Search and Navigation systems enable rapid discovery and access to any element within the design system. They provide keyboard-driven workflows and intelligent search across all content types.

---

## Global Search

### Search Scope
What global search covers.

**Searchable Content:**
- Components (by name)
- Icons (by name and tags)
- Design tokens (by name and value)
- Typography elements (by tag and properties)
- Assets (by name and path)
- Colors (by name and hex value)

### Search Activation
How to initiate search.

**Methods:**
- Keyboard shortcut (Cmd+K / Ctrl+K)
- Click search field
- Start typing when panel focused

### Search Input
The search interface.

**Features:**
- Single input field
- Placeholder text with shortcut hint
- Clear button
- Focus indicator

### Search Results
How results are displayed.

**Display:**
- Categorized by type (Components, Icons, Tokens, etc.)
- Result count per category
- Visual previews where applicable
- Relevance-sorted within categories

**Result Information:**
- Name/title
- Type indicator
- Path/location
- Preview thumbnail (for visual content)

### Result Navigation
Moving through search results.

**Keyboard:**
- Arrow up/down moves between results
- Arrow left/right switches categories (optional)
- Enter selects/navigates to result
- Escape closes search

**Mouse:**
- Click selects result
- Hover shows preview
- Click outside closes search

### Search Actions
What happens when selecting a result.

**Actions:**
- Navigate to containing tab
- Scroll result into view
- Highlight/spotlight result
- Expand containing section if collapsed
- Close search overlay

---

## Keyboard Shortcuts

### Panel Control
Shortcuts for panel management.

| Action | Shortcut |
|--------|----------|
| Toggle DevTools Panel | Cmd+Shift+K |
| Focus Search | Cmd+K |
| Open Settings | Cmd+Shift+. |
| Close/Exit | Escape |

### Tab Navigation
Quick access to tabs.

| Action | Shortcut |
|--------|----------|
| Variables Tab | 1 |
| Typography Tab | 2 |
| Components Tab | 3 |
| Assets Tab | 4 |
| AI Tab | 5 |
| Mock States Tab | 6 |

### Mode Toggles
Shortcuts for modes.

| Action | Shortcut |
|--------|----------|
| Toggle Component ID Mode | Cmd+Shift+I |
| Toggle Text Edit Mode | Cmd+Shift+T |
| Toggle Help Mode | Cmd+Shift+? |

### Editing Shortcuts
Shortcuts while editing.

| Action | Shortcut |
|--------|----------|
| Save/Commit Change | Enter |
| Cancel Change | Escape |
| Undo (if supported) | Cmd+Z |

### Shortcut Discovery
How users learn shortcuts.

**Methods:**
- Displayed in tooltips
- Listed in settings/help
- Shown next to menu items
- Accessible via help mode

---

## Tab Navigation

### Tab Bar
Primary navigation between feature areas.

**Display:**
- Horizontal or vertical tab bar
- Tab name or icon
- Active tab indicator
- Badge for pending changes (if applicable)

### Tab Switching
Moving between tabs.

**Methods:**
- Click tab
- Keyboard number keys
- Swipe gesture (touch)
- Search result navigation

### Tab State
What's preserved when switching tabs.

**Preserved:**
- Scroll position within tab
- Expanded/collapsed sections
- Search filters
- Selection state

**Not Preserved:**
- Temporary highlights
- Active inline edits
- Mode states (some modes)

### Tab Memory
Return to previous position.

**Behavior:**
- Switching back to tab returns to previous scroll
- Recently viewed items remembered
- Collapsed state remembered

---

## Panel Navigation

### Section Expansion
Collapsible sections within tabs.

**Behavior:**
- Click header to expand/collapse
- Indicator shows expanded state
- Smooth animation
- Multiple sections can be open

### Scroll Behavior
Navigating long content.

**Features:**
- Smooth scrolling
- Scroll to section (via internal links)
- Back to top shortcut
- Scroll position indicator

### Breadcrumbs
Path indication for nested content.

**Display:**
- Show navigation path
- Click to navigate back
- Current location highlighted

---

## Spotlight System

### Purpose
Draw attention to specific elements.

### Visual Treatment
How spotlight appears.

**Spotlight Effect:**
- Target element highlighted
- Surrounding content dimmed
- Outline or glow on target
- Smooth transition animation

### Spotlight Triggers
What causes spotlight.

**Triggers:**
- Search result selection
- Component ID click
- External navigation (link to element)
- Help context (showing what's relevant)

### Spotlight Duration
How long spotlight lasts.

**Behavior:**
- Automatic fade after timeout
- Click anywhere dismisses
- New selection replaces old spotlight
- Option for persistent highlight

---

## Navigation Integration

### Cross-Tab Navigation
Navigation that crosses tab boundaries.

**Examples:**
- Click token → navigate to Variables tab
- Click component → navigate to Components tab
- Search result → navigate to relevant tab

**Behavior:**
- Tab switches automatically
- Section expands if needed
- Element scrolled into view
- Spotlight applied

### External Navigation
Navigation from outside DevTools.

**Methods:**
- URL parameters (link to specific view)
- Console commands (developer use)
- API calls (integration with other tools)

### Navigation History
Track navigation within session.

**Features:**
- Back/forward navigation
- Recent locations list
- Quick return to previous view

---

## Filter Systems

### Per-Tab Filters
Filtering specific to each tab.

**Examples:**
- Assets: filter by type (icon, logo, image)
- Components: filter by category
- Variables: filter by token type (color, shadow, radius)

### Filter Persistence
Filter state is remembered.

**Behavior:**
- Filters persist within session
- Return to tab shows previous filter
- Clear filters button available
- Default state on new session

### Combined Filtering
Multiple filters work together.

**Behavior:**
- Filters combine (AND logic)
- Show active filter count
- Clear all filters option
- Individual filter removal

---

## Ideal Behaviors

### Fuzzy Search
Forgive typos and partial matches. "butn" finds "Button". Score by relevance.

### Recent History
Show recently accessed items. Quick access without searching. Clear recent history option.

### Favorites/Bookmarks
Save frequently accessed items. Quick access list. Custom organization.

### Command Palette
Cmd+Shift+P for command search. Search actions, not just content. Execute commands from search.

### Search Filters Inline
Type-to-filter syntax: "type:icon search" or "in:components button". Power user feature.

### Deep Linking
URLs that link to specific states. Share links to specific components, tokens. Restore view from URL.

### Vim-Style Navigation
Optional vim key bindings. j/k for navigation. / for search. Power user mode.

### Quick Actions
Keyboard shortcuts for common actions. Single key access when panel focused. Customizable shortcuts.

### Smart Suggestions
Suggest searches based on context. Recently viewed. Related items.

### Navigation Graph
Visualize relationships between items. Click to navigate. See what's connected.
