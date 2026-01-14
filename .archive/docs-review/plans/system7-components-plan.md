# System 7 UI Components for RadOS

**Created:** 2026-01-11
**Status:** Planning
**Reference:** https://github.com/Kelsidavis/System7
**Purpose:** Implement all classic System 7 UI components with RadOS styling (Sun Yellow, Warm Cloud, hard pixel shadows)

---

## Overview

This plan defines the complete set of **Apple System 7 UI components** to be implemented in RadOS. Each component maintains the tactile, pixel-perfect aesthetic of System 7 while applying RadOS's warm color palette.

### Design Translation Principles

```
┌─────────────────────────────────────────────────────────────────┐
│  System 7 Original        →    RadOS Translation               │
├─────────────────────────────────────────────────────────────────┤
│  Gray window chrome       →    Warm Cloud surface              │
│  Black 1px borders        →    Black edge-primary              │
│  White content area       →    White surface-elevated          │
│  Blue highlight           →    Sky Blue accent                 │
│  Black text               →    Near-black content-primary      │
│  3D beveled edges         →    Hard pixel offset shadows       │
│  Chicago font             →    Joystix Monospace               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Tier 1: Core Controls (Priority)

These are the foundational interactive elements used everywhere. Based on System 7's `ControlManager.h`:

```c
/* Control Definitions (procIDs) from ControlTypes.h */
pushButProc     = 0,    /* Standard push button */
checkBoxProc    = 1,    /* Standard checkbox */
radioButProc    = 2,    /* Standard radio button */
scrollBarProc   = 16,   /* Standard scroll bar */
popupMenuProc   = 1008  /* Popup menu control */
```

| Component | System 7 procID | RadOS Implementation | Status |
|-----------|-----------------|---------------------|--------|
| **PushButton** | `pushButProc (0)` | Sun Yellow fill, hard shadow | To Build |
| **DefaultButton** | `pushButProc` + thick outline | Double border + Sky Blue pulse | To Build |
| **Checkbox** | `checkBoxProc (1)` | Square with checkmark icon | To Build |
| **RadioButton** | `radioButProc (2)` | Circle with filled dot | To Build |
| **Scrollbar** | `scrollBarProc (16)` | Cream thumb, dot pattern track | Exists (CSS) |
| **PopupMenu** | `popupMenuProc (1008)` | Dropdown trigger style | To Build |
| **EditText** | Text control | Sunken input with focus | Exists (basic) |
| **StaticText** | Text control | Label component | Exists |
| **Slider** | Custom | Horizontal track + thumb | To Build |

### Tier 2: Window System

The iconic System 7 window chrome.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **Window** | Title bar, content, frame | Card with window chrome | To Build |
| **TitleBar** | Striped pattern, centered title | Joystix title, drag handle | To Build |
| **CloseBox** | Square in top-left | X icon button | To Build |
| **ZoomBox** | Square in top-right | Maximize icon | To Build |
| **GrowBox** | Ridged corner resize handle | Diagonal lines pattern | To Build |
| **WindowContent** | White inner area | Elevated surface | To Build |

### Tier 3: Menu System

Classic Mac menu bar and dropdowns.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **MenuBar** | Horizontal bar with Apple logo | Fixed top bar | To Build |
| **Menu** | Dropdown container | Popover with shadow | To Build |
| **MenuItem** | Text + optional icon/shortcut | Row with hover state | To Build |
| **MenuSeparator** | Horizontal line | Dashed border | To Build |
| **MenuCheckmark** | Checkmark before item | Checkmark icon | To Build |
| **MenuShortcut** | Cmd+Key aligned right | Kbd component | To Build |
| **SubMenu** | Arrow indicating nested menu | Hierarchical dropdown | To Build |

### Tier 4: Dialog Types

Modal and alert dialogs with classic styling. Based on `DialogManager.h`:

```c
/* Alert dialog functions */
SInt16 Alert(SInt16 alertID, ModalFilterProcPtr filterProc);
SInt16 StopAlert(SInt16 alertID, ModalFilterProcPtr filterProc);
SInt16 NoteAlert(SInt16 alertID, ModalFilterProcPtr filterProc);
SInt16 CautionAlert(SInt16 alertID, ModalFilterProcPtr filterProc);

/* Keyboard navigation */
DM_HandleReturnKey()   // Default button activation
DM_HandleEscapeKey()   // Cancel button activation
DM_HandleTabKey()      // Focus traversal
DM_HandleSpaceKey()    // Button press when focused
```

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **ModalDialog** | Centered, no window chrome | Card with shadow, focus trap | Exists (basic) |
| **Alert** | Generic alert | Base alert component | To Build |
| **StopAlert** | Red hand icon (critical) | Sun Red icon, destructive style | To Build |
| **NoteAlert** | Info icon (note) | Sky Blue icon, info style | To Build |
| **CautionAlert** | Yellow triangle (warning) | Sun Yellow icon, warning style | To Build |
| **FileDialog** | Open/Save with file list | Full file picker UI | To Build |
| **ProgressDialog** | Progress bar + message | Determinate/indeterminate | To Build |
| **FocusRing** | Thick outline on focused control | Sky Blue ring animation | To Build |

### Tier 5: Text & Input

Text editing and input components.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **Label** | Chicago font text | Joystix label | Exists |
| **TextInput** | Inset text field | Sunken input with focus | Exists (basic) |
| **PasswordInput** | Bullet masked input | Dots for characters | To Build |
| **TextArea** | Multi-line TextEdit | Resizable textarea | To Build |
| **TextSelection** | Highlighted text | Sun Yellow highlight | Exists (CSS) |

### Tier 6: List Controls

List and collection displays.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **ListBox** | Scrollable list container | Bordered list with scroll | To Build |
| **ListItem** | Selectable row | Hover + selected states | To Build |
| **IconList** | Grid of icons | Icon grid view | To Build |
| **TreeView** | Expandable hierarchy | Disclosure triangles | To Build |

### Tier 7: Desktop Elements

Desktop and Finder-style elements.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **DesktopPattern** | Repeating tile pattern | CSS dot pattern | Exists (sunken pattern) |
| **Icon** | 32x32 pixel icon | SVG with pixel aesthetic | To Build |
| **IconLabel** | Text below icon | Editable label | To Build |
| **SelectionRect** | Marching ants animation | Animated dashed border | To Build |
| **DragGhost** | Semi-transparent drag preview | Opacity + shadow | To Build |

### Tier 8: Feedback & Status

System feedback components.

| Component | System 7 Original | RadOS Implementation | Status |
|-----------|-------------------|---------------------|--------|
| **ProgressBar** | Striped fill animation | Determinate bar | To Build |
| **IndeterminateProgress** | Barber pole animation | Animated stripes | To Build |
| **Tooltip** | Yellow sticky note | Warm Cloud popover | To Build |
| **FocusRing** | Thick outline | Sky Blue ring | Exists (ring-edge-focus) |
| **Cursor** | Arrow, hand, wait | Custom cursor set | Optional |

---

## Component Specifications

### PushButton

The standard System 7 push button.

```
System 7:                       RadOS:
┌──────────────────────┐       ╭──────────────────────╮
│░░░░░░░░░░░░░░░░░░░░░░│       │                      │
│░░    OK     ░░│       │       OK           │
│░░░░░░░░░░░░░░░░░░░░░░│       │                      │
├──────────────────────┤       ╰──────────────────────╯
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│         ████████████████████
└──────────────────────┘         Hard shadow (2px)

3D beveled edges                 Flat + hard shadow
Gray fill                        Sun Yellow fill
Chicago font                     Joystix font
```

**Props:**
```tsx
interface PushButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}
```

**States:**
```
Default:        Hover:           Active:          Disabled:
╭──────────╮   ╭──────────╮     ╭──────────╮     ╭──────────╮
│    OK    │   │    OK    │     │    OK    │     │    OK    │
╰──────────╯   ╰──────────╯     ╰──────────╯     ╰──────────╯
  ██████████     ↑ lifted         (pressed)        ░░░░░░░░░░
                 ████████████                       Muted, no shadow
```

---

### DefaultButton

The emphasized action button with double outline.

```
System 7:                       RadOS:
╔══════════════════════╗       ┏━━━━━━━━━━━━━━━━━━━━━━┓
║┌────────────────────┐║       ┃╭────────────────────╮┃
║│       OK           │║       ┃│       OK           │┃
║└────────────────────┘║       ┃╰────────────────────╯┃
╚══════════════════════╝       ┗━━━━━━━━━━━━━━━━━━━━━━┛
                                 ████████████████████████
Thick outer border               Double border + shadow
Pulsing animation                Focus ring animation
```

**Implementation:**
- Outer border: 3px solid black
- Inner button: standard PushButton
- Focus: pulsing Sky Blue glow
- Enter key activates

---

### Checkbox

Square checkbox with check mark.

```
System 7:                       RadOS:
┌──┐                           ╭──╮
│  │  Unchecked                │  │  Unchecked
└──┘                           ╰──╯

┌──┐                           ╭──╮
│╳ │  Checked                  │✓ │  Checked (Sun Yellow bg)
└──┘                           ╰──╯

┌──┐                           ╭──╮
│▒▒│  Mixed                    │─ │  Mixed (dash)
└──┘                           ╰──╯
```

**Props:**
```tsx
interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
}
```

---

### RadioButton

Circular radio button with dot.

```
System 7:                       RadOS:
(  )  Unchecked                ○  Unchecked

(● )  Checked                  ◉  Checked (Sun Yellow fill)
```

**Implementation:**
- Outer ring: 1px black border
- Inner dot: Sun Yellow when selected
- Group behavior: only one selected

---

### Window

The classic System 7 window with title bar and controls.

```
System 7:
┌─╳───════════════════════════════════════╤─═─┐
│ ║▓▓▓▓▓▓▓▓▓▓▓ Window Title ▓▓▓▓▓▓▓▓▓▓▓║   ║
├─╨───────────────────────────────────────┴───┤
│                                             │
│              Content Area                   │
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────╔═══╣
                                          ║░░░║
                                          ╚═══╝

RadOS:
╭─[×]════════════════════════════════════[□]─╮
│ ░░░░░░░░░░░░░ Window Title ░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────┤
│                                            │
│              Content Area                  │
│                                            │
│                                            │
│                                            │
╰────────────────────────────────────────[⋰]─╯
  ████████████████████████████████████████████
```

**Subcomponents:**
- `<Window.TitleBar>` - Draggable header
- `<Window.CloseBox>` - Close button (×)
- `<Window.ZoomBox>` - Maximize button (□)
- `<Window.Content>` - Main content area
- `<Window.GrowBox>` - Resize handle (⋰)

**Props:**
```tsx
interface WindowProps {
  title: string;
  closable?: boolean;
  zoomable?: boolean;
  resizable?: boolean;
  modal?: boolean;
  children: React.ReactNode;
}
```

---

### MenuBar

Horizontal menu bar across the top.

```
System 7:
┌──────────────────────────────────────────────────────────────┐
│ 🍎 │ File │ Edit │ View │ Special │                         │
└──────────────────────────────────────────────────────────────┘

RadOS:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ☀️ │ File │ Edit │ View │ Special │                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  (Sun Yellow bar, black text, Joystix font)
```

---

### Menu (Dropdown)

Dropdown menu with items.

```
System 7:                       RadOS:
┌─────────────────────┐        ╭─────────────────────╮
│ New           ⌘N    │        │ New           ⌘N    │
│ Open...       ⌘O    │        │ Open...       ⌘O    │
│ Close         ⌘W    │        │ Close         ⌘W    │
├─────────────────────┤        ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Save          ⌘S    │        │ Save          ⌘S    │
│ Save As...    ⇧⌘S   │        │ Save As...    ⇧⌘S   │
├─────────────────────┤        ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Quit          ⌘Q    │        │ Quit          ⌘Q    │
└─────────────────────┘        ╰─────────────────────╯
                                 █████████████████████
```

**MenuItem Props:**
```tsx
interface MenuItemProps {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  submenu?: React.ReactNode;
}
```

---

### AlertDialog

Classic alert with icon and message.

```
System 7:
┌─────────────────────────────────────────────┐
│  ┌────┐                                     │
│  │STOP│  The disk "Macintosh HD" could     │
│  │ ✋ │  not be opened because it is not   │
│  └────┘  available.                         │
│                                             │
│               [ OK ]                        │
└─────────────────────────────────────────────┘

RadOS:
╭─────────────────────────────────────────────╮
│  ╭────╮                                     │
│  │ ⚠️ │  The disk "Macintosh HD" could     │
│  │    │  not be opened because it is not   │
│  ╰────╯  available.                         │
│                                             │
│               [  OK  ]                      │
╰─────────────────────────────────────────────╯
  █████████████████████████████████████████████
```

**Alert Types:**
- `stop` - Red hand, critical error
- `caution` - Yellow warning triangle
- `note` - Blue info icon

---

### Scrollbar

Vertical/horizontal scrollbar with thumb and track.

```
System 7:                       RadOS:
  ┌─┐                            ╭─╮
  │▲│ Up arrow                   │ │ (no arrows)
  ├─┤                            │ │
  │░│                            │░│ Dot pattern track
  │░│                            │░│
  ├─┤                            ├─┤
  │█│ Thumb                      │█│ Cream thumb
  │█│                            │█│
  ├─┤                            ├─┤
  │░│                            │░│
  │░│                            │░│
  ├─┤                            │ │
  │▼│ Down arrow                 │ │
  └─┘                            ╰─╯
```

**Already implemented in globals.css** - uses dot pattern for track.

---

### ProgressBar

Determinate progress indicator.

```
System 7:                       RadOS:
┌────────────────────────────┐  ╭────────────────────────────╮
│▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░│  │████████████░░░░░░░░░░░░░░░│
└────────────────────────────┘  ╰────────────────────────────╯

Striped fill animation          Sun Yellow fill, black track
```

**Props:**
```tsx
interface ProgressBarProps {
  value: number; // 0-100
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Icon

Desktop icon with pixel aesthetic.

```
System 7 32x32:                 RadOS 32x32:
  ┌────────────────┐            ╭────────────────╮
  │ ╔════════════╗ │            │ ╔════════════╗ │
  │ ║   ████     ║ │            │ ║   ████     ║ │
  │ ║  ██████    ║ │            │ ║  ██████    ║ │
  │ ║ ████████   ║ │            │ ║ ████████   ║ │
  │ ╚════════════╝ │            │ ╚════════════╝ │
  │    Folder      │            │    Folder      │
  └────────────────┘            ╰────────────────╯
```

**Icon Types:**
- Generic document
- Folder (closed)
- Folder (open)
- Application
- Disk
- Trash (empty)
- Trash (full)

---

## Implementation Phases

### Phase 1: Core Controls
- [ ] PushButton (primary, secondary, ghost variants)
- [ ] DefaultButton (with focus animation)
- [ ] Checkbox (checked, unchecked, indeterminate)
- [ ] RadioButton (with RadioGroup)
- [ ] PopupMenu (dropdown trigger)
- [ ] Slider (horizontal track + thumb)

### Phase 2: Window System
- [ ] Window container component
- [ ] TitleBar with drag behavior
- [ ] CloseBox, ZoomBox buttons
- [ ] GrowBox resize handle
- [ ] Window layering/stacking context

### Phase 3: Menu System
- [ ] MenuBar fixed header
- [ ] Menu dropdown container
- [ ] MenuItem with variants
- [ ] MenuSeparator
- [ ] SubMenu (hierarchical)
- [ ] MenuShortcut display

### Phase 4: Dialogs
- [ ] AlertDialog with icon types
- [ ] Alert icons (stop, caution, note)
- [ ] ConfirmDialog (OK/Cancel)
- [ ] ProgressDialog
- [ ] FileDialog (basic)

### Phase 5: Lists & Trees
- [ ] ListBox container
- [ ] ListItem with selection
- [ ] IconList grid view
- [ ] TreeView with disclosure

### Phase 6: Desktop Elements
- [ ] Icon component with types
- [ ] IconLabel editable
- [ ] SelectionRect (marching ants)
- [ ] DesktopGrid layout

### Phase 7: Feedback
- [ ] ProgressBar (determinate)
- [ ] IndeterminateProgress
- [ ] Tooltip
- [ ] Custom cursors (optional)

---

## File Structure

```
packages/ui/src/components/
├── system7/
│   ├── PushButton.tsx
│   ├── DefaultButton.tsx
│   ├── Checkbox.tsx
│   ├── RadioButton.tsx
│   ├── RadioGroup.tsx
│   ├── PopupMenu.tsx
│   ├── Slider.tsx
│   ├── Window/
│   │   ├── Window.tsx
│   │   ├── TitleBar.tsx
│   │   ├── CloseBox.tsx
│   │   ├── ZoomBox.tsx
│   │   ├── GrowBox.tsx
│   │   └── index.ts
│   ├── Menu/
│   │   ├── MenuBar.tsx
│   │   ├── Menu.tsx
│   │   ├── MenuItem.tsx
│   │   ├── MenuSeparator.tsx
│   │   ├── SubMenu.tsx
│   │   └── index.ts
│   ├── Dialog/
│   │   ├── AlertDialog.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ProgressDialog.tsx
│   │   ├── AlertIcon.tsx
│   │   └── index.ts
│   ├── List/
│   │   ├── ListBox.tsx
│   │   ├── ListItem.tsx
│   │   ├── IconList.tsx
│   │   ├── TreeView.tsx
│   │   └── index.ts
│   ├── Desktop/
│   │   ├── Icon.tsx
│   │   ├── IconLabel.tsx
│   │   ├── SelectionRect.tsx
│   │   └── index.ts
│   ├── Feedback/
│   │   ├── ProgressBar.tsx
│   │   ├── Tooltip.tsx
│   │   └── index.ts
│   └── index.ts
```

---

## Styling Guidelines

### Shadow Values (Light Mode)
```css
--shadow-sys7-btn: 0 2px 0 0 var(--color-black);
--shadow-sys7-btn-hover: 0 4px 0 0 var(--color-black);
--shadow-sys7-window: 4px 4px 0 0 var(--color-black);
--shadow-sys7-menu: 2px 2px 0 0 var(--color-black);
```

### Border Patterns
```css
/* Title bar stripes */
.titlebar-stripes {
  background: repeating-linear-gradient(
    90deg,
    var(--color-black) 0px,
    var(--color-black) 1px,
    transparent 1px,
    transparent 3px
  );
}

/* Grow box ridges */
.growbox-ridges {
  background: repeating-linear-gradient(
    -45deg,
    var(--color-black) 0px,
    var(--color-black) 1px,
    transparent 1px,
    transparent 3px
  );
}
```

### Focus States
```css
/* Default button pulsing */
@keyframes default-button-pulse {
  0%, 100% { box-shadow: 0 0 0 3px var(--color-sky-blue); }
  50% { box-shadow: 0 0 0 5px var(--color-sky-blue); }
}
```

---

## Success Criteria

The implementation is complete when:

1. All Tier 1 controls are functional and styled
2. Window system supports drag, resize, close, zoom
3. Menu system supports dropdowns and keyboard nav
4. Dialogs match System 7 appearance with RadOS colors
5. Components work in both light and dark mode
6. All components use semantic tokens (no hardcoded colors)
7. Components are documented in Storybook
8. Components pass accessibility audit (keyboard nav, ARIA)

---

## References

### Local Source Files (Downloaded)

```
/Users/rivermassey/Downloads/System7-main/
├── include/
│   ├── ControlManager/
│   │   ├── ControlManager.h      # Full control API
│   │   ├── ControlTypes.h        # Control type constants
│   │   └── StandardControls.h    # Standard control defs
│   ├── DialogManager/
│   │   └── DialogManager.h       # Dialog & alert API
│   ├── MenuManager/
│   │   └── MenuManager.h         # Menu system API
│   ├── WindowManager/
│   │   ├── WindowManager.h       # Window API
│   │   └── WindowTypes.h         # Window type defs
│   └── ListManager/              # List controls
├── src/
│   ├── ControlManager/           # Control implementations
│   ├── DialogManager/            # Dialog implementations
│   ├── MenuManager/              # Menu implementations
│   └── WindowManager/            # Window implementations
└── docs/                         # Component documentation
```

### External References

- [Kelsidavis/System7](https://github.com/Kelsidavis/System7) - Reference implementation
- [Inside Macintosh: Toolbox Essentials](https://developer.apple.com/library/archive/documentation/mac/pdf/Macintosh_Toolbox_Essentials/MTbx_Controls.pdf) - Original Apple documentation
- [GUIdebook: System 7](https://guidebookgallery.org/screenshots/macos7) - System 7 screenshots
- [512pixels Mac OS Gallery](https://512pixels.net/projects/default-mac-wallpapers-in-5k/) - High-res references
- [System 7 Human Interface Guidelines](https://developer.apple.com/library/archive/documentation/mac/pdf/HIGuidelines.pdf) - Apple HIG

---

## Notes

{Space for implementation notes and decisions}
