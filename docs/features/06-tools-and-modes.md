# Tools & Modes

## Purpose

Tools and Modes provide specialized interaction paradigms for specific tasks. They transform how the user interacts with the page, enabling inspection, editing, and exploration that wouldn't be possible in the default state.

---

## Component ID Mode

### Purpose
Inspect and identify any component or element on the page. Understand what something is and where it comes from.

### Activation
Enter Component ID Mode through toolbar or keyboard shortcut.

**Indicators:**
- Cursor changes to crosshair
- Mode indicator visible in toolbar
- Optional overlay tint on page

### Hover Behavior
Information appears as user hovers over elements.

**Displayed Information:**
- Component name (React component or HTML element)
- File path and line number
- Theme association (if applicable)
- Props summary

**Tooltip Behavior:**
- Appears after brief delay (avoid flicker)
- Positioned to not obscure target
- Follows cursor near target
- Dismisses on mouse move

### Click Behavior
Clicking an element performs actions.

**Actions:**
- Copy component information to clipboard
- Navigate to component in Components tab
- Open component file in editor (if integrated)
- Highlight component in component tree

**Feedback:**
- Toast confirms copy action
- Visual pulse on successful selection
- Auto-navigation to relevant panel

### Element Highlighting
Visual feedback shows what will be selected.

**Highlighting:**
- Outline appears on hover
- Background tint optional
- Padding/margin visualization
- Nested element boundaries visible

### Exit Behavior
Leave Component ID Mode cleanly.

**Exit Methods:**
- Press Escape key
- Click toolbar toggle
- Activate different mode
- Close DevTools panel

---

## Text Edit Mode

### Purpose
Edit text content directly on the page. Quick way to explore copy changes without editing source files.

### Activation
Enter Text Edit Mode through toolbar or keyboard shortcut.

**Indicators:**
- Mode indicator in toolbar
- Cursor changes over editable text
- Editable elements subtly highlighted

### Editable Elements
Which elements can be edited in this mode.

**Supported Elements:**
- Headings (h1-h6)
- Paragraphs (p)
- Spans
- Labels
- Button text
- Link text

**Not Editable:**
- Images
- Icons
- Inputs (use their native editing)
- Non-text elements

### Click-to-Edit
Clicking editable text enters edit state.

**Behavior:**
- Element becomes contenteditable
- Existing text selected
- Cursor positioned in text
- Keyboard input captured

### Editing Experience
While editing text content.

**Features:**
- Standard text editing (select, delete, type)
- No formatting controls (plain text only)
- Enter completes edit
- Escape cancels edit
- Click away completes edit

### Context Menu
Right-click provides additional options.

**Options:**
- Change element tag (h1 → h2, p → span, etc.)
- Copy original text
- Reset to original
- Mark as changed

### Change Tracking
All text modifications are tracked.

**Tracking:**
- Changed elements marked visually
- Original text preserved
- Change count displayed
- Changes listed in summary

### Exit Behavior
Leaving Text Edit Mode handles changes.

**On Exit:**
- All changes compiled into summary
- Summary copied to clipboard automatically
- Toast shows change count
- Page returns to original state (changes not persisted to source)

**Note:** Text Edit Mode is for exploration and copy review. Changes are not saved to source files. The clipboard export allows sharing proposed changes with content editors.

---

## Help Mode

### Purpose
Provide contextual guidance for the current state of the interface.

### Activation
Enter Help Mode through toolbar or keyboard shortcut.

**Behavior:**
- Help content appears for current context
- Context = active tab + active tool
- Overlay or panel displays help

### Contextual Help
Help content adapts to current state.

**Contexts:**
- Variables Tab — explain token editing workflow
- Typography Tab — explain typography controls
- Components Tab — explain component preview system
- Assets Tab — explain asset management
- Component ID Mode — explain inspection workflow
- Text Edit Mode — explain text editing workflow

### Help Content
What help includes.

**Content:**
- Feature title
- Brief description
- Key actions/shortcuts
- Tips and best practices
- Common workflows

### Display
How help is presented.

**Presentation:**
- Non-intrusive overlay or bar
- Readable without blocking content
- Dismissible
- Links to detailed documentation

### Exit Behavior
Leave Help Mode.

**Exit Methods:**
- Press Escape
- Click close button
- Click outside help content
- Activate different mode

---

## Preview Mode

### Purpose
View the page without DevTools chrome. See the design as users will see it.

### Activation
Toggle preview mode on/off.

**Behavior:**
- DevTools panel hides
- All overlays removed
- Page renders clean
- Keyboard shortcut still active for exit

### Page State
What happens to the page in preview.

**Preserved:**
- Current theme
- Any pending (unsaved) changes
- Current viewport
- Scroll position

**Removed:**
- DevTools panel
- Mode indicators
- Inspection overlays
- Help displays

### Exit Behavior
Return to editing mode.

**Methods:**
- Keyboard shortcut
- Edge trigger (mouse to screen edge)
- Auto-timeout (optional)

---

## Mode Interaction

### Mode Exclusivity
Only one mode active at a time.

**Behavior:**
- Activating a mode deactivates others
- Clear indication of current mode
- Easy to identify active mode
- Default state when no mode active

### Mode Persistence
Modes don't persist across sessions.

**Behavior:**
- Page refresh exits all modes
- Panel close exits all modes
- Tab switch may or may not exit mode (context-dependent)

### Mode + Tab Interaction
How modes work with tabs.

**Behavior:**
- Component ID Mode works across all tabs (it's about the page, not the panel)
- Text Edit Mode works across all tabs
- Help Mode content changes with active tab
- Some modes may restrict tab switching

---

## Ideal Behaviors

### Component ID Enhancements

**Tree View**
Show component hierarchy tree alongside inspection. Hovering in tree highlights on page. Click in tree selects element.

**Props Inspector**
Show full props for selected component. Live values, not just defaults. Update as state changes.

**Source Preview**
Inline preview of component source code. Scroll to relevant line. One-click open in editor.

**History**
Remember recently inspected components. Quick navigation to previous selections.

### Text Edit Enhancements

**Rich Text Support**
Support bold, italic, links in edit mode. Format preservation on edit.

**Spell Check**
Highlight spelling errors while editing. Suggest corrections.

**Character Count**
Show character/word count while editing. Helpful for constrained text areas.

**Multi-language Preview**
Preview text at different lengths (for i18n). Test with longer/shorter translations.

### New Modes to Consider

**Spacing Mode**
Visualize all spacing in the design. Click elements to see margin/padding. Drag to adjust spacing values.

**Color Mode**
Highlight all instances of a color. Click to see where a color is used. Bulk change color across page.

**Accessibility Mode**
Highlight accessibility issues. Show focus order. Display ARIA attributes. Contrast ratio indicators.

**Responsive Mode**
Quick viewport size switching. See breakpoint boundaries. Preview at common device sizes.

**Animation Mode**
Highlight animated elements. Pause/play animations. Adjust animation timing. Preview transitions.
