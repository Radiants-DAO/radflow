---
aliases: [Components, Component Index, RadTools, UI Components]
tags: [moc, components, radtools]
---

# Components

RadTools is a design system framework. All UI components live in `@/components/ui`.

## Design Principles

- **Colors**: cream, sun-yellow, black, sky-blue
- **Typography**: [[Joystix]] (pixel) for headings, [[Mondwest]] for body
- **Shadows**: Pixel-perfect box shadows (2px buttons, 4px cards)
- **Borders**: 1-2px solid black
- **Disabled**: 50% opacity + cursor-not-allowed
- **No Transitions**: Instant state changes for retro feel

## Component Categories

### Core
| Component | Description | Links |
|-----------|-------------|-------|
| [[Button]] | Interactive button with lift effect | [[primitives/Button|API]] |
| [[Card]] | Container with consistent styling | [[primitives/Card|API]] |
| [[Tabs]] | Tabbed interface | [[primitives/Tabs|API]] |

### Form
| Component | Description | Links |
|-----------|-------------|-------|
| [[Input]] | Text input field | [[primitives/Input|API]] |
| [[Select]] | Dropdown select | [[primitives/Select|API]] |
| [[Checkbox]] | Checkbox control | [[primitives/Checkbox|API]] |
| [[Radio]] | Radio button | [[primitives/Radio|API]] |
| [[Switch]] | Toggle switch | [[primitives/Switch|API]] |
| [[Slider]] | Range slider | [[primitives/Slider|API]] |

### Feedback
| Component | Description | Links |
|-----------|-------------|-------|
| [[Badge]] | Small label/tag | [[primitives/Badge|API]] |
| [[Alert]] | Alert box | [[primitives/Alert|API]] |
| [[Progress]] | Progress bar | [[primitives/Progress|API]] |
| [[Spinner]] | Loading spinner | [[primitives/Spinner|API]] |
| [[Toast]] | Toast notifications | [[primitives/Toast|API]] |
| [[Tooltip]] | Hover tooltip | [[primitives/Tooltip|API]] |

### Overlay
| Component | Description | Links |
|-----------|-------------|-------|
| [[Dialog]] | Modal dialog | [[primitives/Dialog|API]] |
| [[Sheet]] | Slide-out panel | [[primitives/Sheet|API]] |
| [[DropdownMenu]] | Dropdown menu | [[primitives/DropdownMenu|API]] |
| [[ContextMenu]] | Right-click menu | [[primitives/ContextMenu|API]] |
| [[Popover]] | Popover panel | [[primitives/Popover|API]] |

### Navigation
| Component | Description | Links |
|-----------|-------------|-------|
| [[Accordion]] | Collapsible sections | [[primitives/Accordion|API]] |
| [[Breadcrumbs]] | Navigation breadcrumbs | [[primitives/Breadcrumbs|API]] |
| [[Divider]] | Visual separator | [[primitives/Divider|API]] |

## Needed Components

Components commonly needed by projects:

| Component | Use Case | Priority |
|-----------|----------|----------|
| VirtualList | Large lists | Medium |
| TreeView | Hierarchical data | Medium |
| DataGrid | Tabular data | Medium |

## Usage Patterns

### Import
```tsx
import { Button, Card, Tabs } from '@/components/ui';
```

### Common Patterns
- [[Form Pattern]] - Forms with validation
- [[Loading Pattern]] - Loading states
- [[Confirm Pattern]] - Confirmation dialogs

## Related
- [[Design Tokens]] - Color, typography, spacing
- [[Design System]] - Visual language principles
- [[radtools|RadTools Skill]] - Full API documentation
