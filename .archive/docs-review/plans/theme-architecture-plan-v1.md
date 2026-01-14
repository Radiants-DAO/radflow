
---

## Questions

### Theme Structure

**Q1: What is the folder structure for a theme package?**

Example structure to validate:
```
@radflow/theme-phase/
├── package.json
├── index.css              # Main entry
├── tokens.css             # Brand colors + semantic mappings
├── dark.css               # Dark mode overrides
├── light.css              # Light mode (if not default)
├── fonts.css              # @font-face declarations
├── typography.css         # @layer base typography
├── components/            # Theme-specific components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
└── assets/
    ├── icons/
    └── images/
```

Is this correct? What's missing or should change?

**Your answer:**

not sure yet

---

**Q2: Should themes extend a base or be fully standalone?**

Options:
- A) Fully standalone - each theme has complete copies of everything
- B) Extend base - `@radflow/theme` provides skeleton, themes fill in values
- C) Hybrid - tokens extend base, components are standalone per theme
Which approach?

**Your answer:**
I have a question in response — what are the tradeoffs/benefits of each? I'm learning towards Extending the base + additional component libraries that can be imported (e.g. right now we have UI, RadOS and the soon to be depreciated Design System tab), but for other apps, they may develop their own components, which should be housed in their own tabs (and then potentiall moved into the core UI library)

---

**Q3: How do modes (light/dark/contrast) work within a theme?**

Current: `.dark` class toggles mode via CSS variable overrides

Options:
- A) Keep current approach - modes are CSS-only, same component code
- B) Modes can have component variations too (dark mode might use different component markup)
- C) Modes are purely token swaps, never affect components

Which approach?

**Your answer:**
Per theme, they will just be CSS-only modes. When creating a new theme [Create Theme +] button in the settings window, this will create a duplicate of the Core UI tab w/ a new theme name. Dark/light/modes will use the same component code, but themes are lower level full switches. 

---

### Theme Switching UI

**Q4: Where does the theme switcher live in DevTools?**

Options:
- A) Top bar, always visible (dropdown or button group)
- B) Settings cog menu (opens modal/panel with theme options)
- C) Dedicated "Themes" tab in the tab bar
- D) Combination (quick-switch in top bar + full management in settings)

Which approach?

**Your answer:**
Top bar quick switch, and move the settings cog to the left vertical tab bar (at the bottom), theme settings/creating new themes can be housed there. 
---

**Q5: What information shows in the theme switcher?**

Possible items:
- Theme name
- Theme icon/logo
- Author/source
- Default mode (light/dark) (all new themes should automatically have both)
- "Active" indicator

What should be visible at a glance vs. in expanded view?


**Your answer:**
- Theme name
- Theme icon/logo
- Author/source
- Default mode (light/dark) (all new themes should automatically have both)
- "Active" indicator
- Create/Delete actions — edit will be when a theme is "active"
- Link section for respective themes parent websites/twitters/githubs, author can be individual or organization.

---

**Q6: Can multiple themes be "open" for editing, or only one at a time?**

Options:
- A) Single active theme - switching themes closes the previous one
- B) Multiple open - can tab between themes being edited
- C) Single active + comparison mode (view two side-by-side, edit one)

Which approach?

**Your answer:**
Only a single active theme at a time. 
---

### Theme Creation

**Q7: What's the "Create New Theme" workflow?**

Proposed flow:
1. Click "Create Theme" button
2. Modal asks: Name, base theme to copy from, author
3. System duplicates the selected theme into new folder
4. New theme becomes active
5. User edits freely

Is this correct? What's missing?


**Your answer:**

This should be an AI-assisted setup, so, no complex programs, just comprehensive propmts for complex actions (editing CSS, )

1. Create Theme button
2. Modal asks: Name, base theme to copy from, author
3. Edit variables (colors/shadows/etc — if we need more variables in the variables panel then we should probably cover that first, e.g. border sizes/icon sizes/etc -> suggest typical convetions)
4. Example w/ colors for refinement, need to ensure that both dark and light mode generate the correct semantic tokens. 
5. Import icon library + remap all icons (also in the setup wizard, also should be a copyable comprehensive prompt)
6. New theme becomes active w/ some sort of "review theme" stage. This should be a back and forth between the user + AI, and we'll likely need to have some sort of question/response boilerplate. 
7. Prompt structure to confirm theme. 
---

**Q8: Where do new themes get created?**

Options:
- A) `packages/theme-{name}/` (monorepo sibling to theme-rad-os)
- B) `themes/{name}/` (separate themes folder in project root)
- C) User-configurable location
- D) Initially local, then "promote" to package when ready

Which approach?

**Your answer:**
Not sure, whatever approach allows for themes to have unique component libraries (i.e. RadFlow will eventually have UI, Solarium, Auctions, Rad Radio, and continuously expand. People may want to import all of these libraries or just some of them). This applies to clients as well, for example Phase will have PhaseUI + unique components for each of its apps (after we build the theme, ofc) 


---

**Q9: What gets copied when duplicating a theme?**

Proposed copy list:
- [ ] All CSS files (tokens, dark, typography, etc.)
- [ ] All components from source theme
- [ ] Font files
- [ ] Asset files (icons, images)
- [ ] package.json (with new name)
- [ ] Agent/skill files if any

What should/shouldn't be copied?


**Your answer:**
All of the above is correct except fonts, assets. We don't want to freely distribute paid fonts or other sensitive copyright data. Icon libraries should be imported/replace radiants icons during the theme setup.
---

**Q10: How are theme names validated?**

Constraints to enforce:
- npm package name rules (lowercase, no spaces, etc.)
- No duplicate names
- Reserved names (e.g., "base", "default")

Other validation rules?


**Your answer:**
Not that i can think of. 
---

### Component Handling

**Q11: When editing a component in DevTools, how does it know which theme's component to modify?**

Current: Components use `data-edit-scope` + `data-component` attributes

Proposed: Add `data-theme` attribute to identify source theme

```tsx
<Button
  data-edit-scope="component-definition"
  data-component="Button"
  data-theme="phase"  // NEW
/>
```

Is this the right approach?

**Your answer:**
Yes, I also think that perhaps there is a local write-lock on any unselected theme, if possible?


---

**Q12: How do theme-specific components get imported in user code?**

Options:
```tsx
// A) Theme-qualified import
import { Button } from '@radflow/theme-phase/components'

// B) Generic import, theme context determines which
import { Button } from '@radflow/ui'
// + ThemeProvider sets active theme

// C) Explicit theme wrapper
import { themed } from '@radflow/core'
const PhaseButton = themed('phase', Button)
```

Which pattern?

**Your answer:**
Probably theme-qualified import. But I'm not entirely sure which is the best. Additional context/knowing the tradeoffs would help.

---

**Q13: What happens to component previews when switching themes?**

Options:
- A) All previews re-render with new theme's components
- B) Previews show new theme's tokens but keep current component code
- C) Each preview panel can be pinned to a specific theme

Which approach?

**Your answer:**
- A. The current components tab will be defined be each theme, accessing it means accessing that theme's component folder. 

---

### Persistence & File System

**Q14: How does DevTools know which themes exist?**

Discovery options:
- A) Scan `packages/theme-*/` folders
- B) Read from a `radflow.config.js` themes array
- C) Scan `node_modules/@radflow/theme-*` + local folders
- D) Registry file (`themes.json`) that tracks all themes

Which approach?


**Your answer:**
Not sure what the best approach is. What do you think?
---

**Q15: How are edits persisted when multiple themes exist?**

Current: Writes to `app/globals.css`

Proposed: Each theme has its own CSS files, DevTools writes to the active theme's files

Is this correct? How do we handle the "global" app CSS vs theme CSS?

**Your answer:**
Yes, each theme has its own globals.css. 
---

**Q16: Should there be a "project theme" that's always local?**

Scenario: User has `@radflow/theme-rad-os` installed from npm but wants to customize it for their project without forking.

Options:
- A) No project theme - user must create a full new theme
- B) Project overrides layer - thin override file that patches any theme
- C) Auto-create project theme on first edit of an npm-installed theme

Which approach?


**Your answer:**
The default theme is Radiants, but the user will choose which they install, theoretically they don't have to install the Radiants one if they already have a theme made -> they could also uninstall the radiants theme if they have created a new one. 

As of right now, it will install w/ the Radiants/RadFlow theme. In the future, they could install with a different theme.
---

### DevTools Architecture

**Q17: How does the Zustand store change to support multi-theme?**

Current slices: `variablesSlice`, `typographySlice`, `componentsSlice`, etc.

Options:
- A) Add `themeSlice` with `activeTheme`, `availableThemes`, store state is theme-specific
- B) Store becomes `Record<ThemeId, ThemeState>` with active theme pointer
- C) Separate store per theme, switch which store is active

Which approach?

**Your answer:**
Hm, not sure which is best. 

---

**Q18: How do tabs (Variables, Typography, Components) relate to themes?**

Options:
- A) Tabs always show active theme's data
- B) Each tab can be independently set to show any theme
- C) Theme is global context, tabs inherit it

Which approach?

**Your answer:**

---

**Q19: Should the preview pane (where you see components) support split view for theme comparison?**

Use case: See how Button looks in RadOS vs PHASE side-by-side

Options:
- A) Yes, built-in split view
- B) No, open two browser windows if needed
- C) Future feature, not in initial scope

Which approach?

**Your answer:**
Future feature, not in initial scope. 

---

### Publishing & Distribution

**Q20: What's the workflow to publish a theme as an npm package?**

Proposed:
1. "Export Theme" button in DevTools
2. Validates package.json, checks all files present
3. Generates/updates README
4. User runs `npm publish` manually (or we provide button)

Is this correct? What's missing?

**Your answer:**
"export theme" prompt copied to clipboard that checks all files present/creates readme, etc, also makes a commit to the RadTools github for approved merging.
Prompts will largely replace complex programs within RadFlow when possible. 
---

**Q21: How do themes declare their peer dependencies?**

Example package.json:
```json
{
  "name": "@radflow/theme-phase",
  "peerDependencies": {
    "react": "^18 || ^19",
    "@radflow/theme": "^1.0.0"
  }
}
```

Should themes depend on `@radflow/theme` (base) or be fully standalone?

**Your answer:**

---

**Q22: How are theme updates handled?**

If user installed `@radflow/theme-rad-os@1.0.0` and `1.1.0` releases:
- A) Standard npm update, user decides when
- B) DevTools shows "update available" notification
- C) Theme is locked to version, must explicitly upgrade

Which approach?

**Your answer:**

---

### Edge Cases

**Q23: What happens if two themes have the same component name but different props?**

Example: RadOS Button has `variant: 'primary' | 'secondary'`
PHASE Button has `variant: 'solid' | 'outline' | 'ghost'`

How does DevTools handle this?

**Your answer:**
Is this an issue? Upon setup the theme's components and tabs will be unique to that theme. 

---

**Q24: Can a theme be deleted? What are the safeguards?**

Considerations:
- Prevent deleting if it's the only theme
- Prevent deleting npm-installed themes
- Confirmation modal
- What happens to code that imports deleted theme?

What safeguards?

**Your answer:**
Radiants Github is where themes are stored. Changes to themes require approved changes to the Radiants github.
If a user makes/deletes a theme w/o committing that's their fault. 
---

**Q25: How do fonts work across themes?**

Options:
- A) Each theme bundles its own fonts
- B) Shared font registry, themes reference by name
- C) Themes can depend on font packages (`@radflow/fonts-mondwest`)

Which approach?

**Your answer:**
— We cannot distrubute fonts, the Radiants fonts are fine except for Mondwest — this will not be sync'd to people's repos, instead, when installing, the will have to download the trial: https://pangrampangram.com/products/bitmap-mondwest.
---

### CSS Parser & API Routes

**Q26: How does the CSS parser change for multi-theme?**

Current: `parseGlobalsCSS()` reads a single `app/globals.css`

Options:
- A) Parser accepts theme path parameter, reads theme's CSS files
- B) Parser reads all themes into a combined data structure
- C) Each theme is parsed independently, results stored per-theme

Which approach?

**Your answer:**
- C. Themes globals.css will be setup w/ the "New Theme" Wizard. Does that explain enough?

---

**Q27: How do API routes change for multi-theme?**

Current routes assume single globals.css:
- `/api/devtools/read-css` → reads `app/globals.css`
- `/api/devtools/write-css` → writes `app/globals.css`

Proposed:
- `/api/devtools/themes` → list available themes
- `/api/devtools/themes/[themeId]/read-css` → read specific theme
- `/api/devtools/themes/[themeId]/write-css` → write specific theme

Is this the right pattern?

**Your answer:**
I think the proposed ones work. 

---

**Q28: Where does `app/globals.css` fit in multi-theme world?**

Current: `app/globals.css` is the single source of truth

Options:
- A) `globals.css` becomes just imports: `@import "@radflow/theme-phase";`
- B) `globals.css` is the "project theme" - always editable, themes are read-only
- C) `globals.css` is deprecated, themes are in `packages/theme-*/`
- D) `globals.css` contains shared base, themes add on top

Which approach?

**Your answer:**
I'm not sure. I think globals.css should be hot swapped (or something like it) per theme/on theme change. 
---

### Store Architecture

**Q29: How do the existing slices (variables, typography, components) change?**

Current: Single set of data per slice

Options:
- A) Add `activeThemeId` to store, slices filter by it
- B) Slices become `Record<ThemeId, SliceData>`
- C) Create new `themeSlice`, existing slices unchanged but scoped by themeSlice
- D) Complete refactor: `themeSlice` contains all theme-specific data

Which approach?

**Your answer:**
A sounds the cleanes but I am open to suggestions. 

---

**Q30: What state is shared across themes vs. theme-specific?**

| State | Shared or Per-Theme? |
|-------|---------------------|
| Panel position/width | ? |
| Active tab | ? |
| Mock states | ? |
| Search query | ? |
| Help mode on/off | ? |
| Text edit pending changes | ? |

Fill in the table:

**Your answer:**
| State | Shared or Per-Theme? |
|-------|---------------------|
| Panel position/width | shared |
| Active tab | shared |
| Mock states | per-theme |
| Search query | shared |
| Help mode on/off | shared |
| Text edit pending changes | shared |

---

### Tab Behavior

**Q31: How does the Assets tab work with multiple themes?**

Options:
- A) Assets are always shared (one icon library for all themes)
- B) Assets are per-theme (each theme has its own icons)
- C) Core assets shared, themes can add/override

Which approach?

**Your answer:**
Assets are per-theme/per project and will show the assets from an installed repo. The paths may need to be updated depending on each project's setup.
---

**Q32: Are AI tab prompts/Midjourney styles theme-specific?**

Options:
- A) Shared across all themes (prompts are generic)
- B) Per-theme (each theme has its own prompt library)
- C) Base prompts shared, themes can add theme-specific prompts

Which approach?

**Your answer:**
Per-theme.

---

**Q33: Are Mock States theme-specific?**

Current: Mock states like "authenticated", "wallet connected" are global

Options:
- A) Keep global (mock states apply to all themes)
- B) Per-theme (each theme might mock different things)

Which approach?

**Your answer:**
Per-theme. Default to having a few functional examples (logged in, logged out, wallet connected, wallet disconnected, and any other common "states" that apps might have (max 10)))
---

### Agents & AI Integration

**Q34: Do themes have their own AI agents/skills?**

Current: `theme-rad-os` has `agents/.claude/skills/rad-os-theme/SKILL.md`

Options:
- A) Yes, each theme can bundle its own skills
- B) No, agents are DevTools-level only
- C) Base agents + theme-specific extensions

Which approach?

**Your answer:**
We'll probably make a global skill registry of some sort that gets periodically updated, but, similar to the mock states, each theme should be able to have its own as well. Same w/ the AI tab. There will be globally installed Radflow-relevant prompts, and then the ability to add custom prompts. Eventually we may build out claude code commands for RadFlow.

---

**Q35: How do agents know which theme is active?**

When Claude/Cursor helps edit code, they need to know which theme's components/tokens to use.

Options:
- A) Agent reads from a config file (`.radflow/active-theme.json`)
- B) Agent is passed context via DevTools
- C) Each theme's agent is separate, user invokes theme-specific agent

Which approach?

**Your answer:**
I'm not sure, if we can do a write-lock on other themes while one is active, that'd be amazing, but i'm not sure how that's possible if RadTools is mostly in the dom. Open to suggestions. We probably need to keep claude/cursor rules very simple, perhaps some sort of "YOU MUST PASTE THIS IN YOUR CLAUDE/CURSOR/AGENT rules or something" as well. 

---

### Tailwind Integration

**Q36: How do multiple themes work with Tailwind v4's @theme?**

Current: Single `@theme` block defines tokens for Tailwind

Options:
- A) Only active theme's `@theme` is loaded at runtime
- B) All themes' tokens are loaded, prefixed by theme name
- C) Tailwind config switches based on build target

Which approach?

**Your answer:**
Not sure, open to suggestions and need to understand the tradeoffs. My initial thoughts is that the Tailwind v4's @theme might be best stored inside of each theme (for light and dark mode for example, not sure though — maybe its actually better for the project to define @themes and have one big phat massive CSS file for all themes, what do you think?)
---

**Q37: Can a project use components from multiple themes simultaneously?**

Example: RadOS Button + PHASE Card on same page

Options:
- A) Yes, each component carries its theme's tokens
- B) No, one theme active at a time (components inherit from active theme)
- C) Possible but discouraged (theming conflicts)

Which approach?


**Your answer:**
- B) No, one theme active at a time (components inherit from active theme) — in fact, most projects should likely only have a single theme installed. Only the RadFlow parent project needs to be able to access multiple at any given time (to edit the themes/merge stuff/etc). Perhaps that means that Radflow's installed version may differ from the version that is used to actually edit RadFlow/themes itself. Not entirely sure that difference though. 
---

### Development Workflow

**Q38: What's the hot-reload experience when editing a theme?**

Options:
- A) Changes apply instantly (CSS injection, like current preview mode)
- B) Changes require rebuild
- C) Instant for tokens, rebuild for components

Which approach?

**Your answer:**
We could theoretically require a prompt for theme-switching or provide some sort of direct-linking to a file so that a user can switch easily. 
---

**Q39: How do you preview the same page with different themes?**

Options:
- A) Theme switcher dropdown, page re-renders with new theme
- B) Open multiple browser windows with different theme params
- C) Split view in DevTools (side-by-side comparison)
- D) DevTools "theme carousel" for quick switching

Which approach?

**Your answer:**

---

**Q40: What's the workflow for testing theme changes across components?**

Example: Change `--color-surface-primary`, see all components update

Options:
- A) Components tab shows live preview with current token values
- B) Separate "Theme Preview" mode with component gallery
- C) Use the actual app page as the preview surface

Which approach?

**Your answer:**
Not sure i understand the question. I require more context.

---

### Build & Package

**Q41: How are theme packages built?**

Options:
- A) CSS-only (no build step, just import)
- B) tsup for components, CSS passthrough
- C) Full build with TypeScript, CSS processing

Which approach?

**Your answer:**
Not sure, need to understand the tradeoffs. 

---

**Q42: What's the theme package.json structure?**

```json
{
  "name": "@radflow/theme-phase",
  "version": "1.0.0",
  "exports": {
    ".": "./index.css",
    "./components": "./dist/components/index.js",
    "./tokens": "./tokens.css"
    // What else?
  },
  "peerDependencies": {
    // What goes here?
  }
}
```

Fill in the structure:

**Your answer:**
Need you to explain further what the package.json will do, tradeoffs, etc. 

---

### Migration & Compatibility

**Q43: What happens to existing projects using single-theme setup?**

Options:
- A) Breaking change, must migrate
- B) Backwards compatible, single-theme is default
- C) Migration script provided

Which approach?

**Your answer:**
There are no existing projects except RadOS, which I will update manually. 

---

**Q44: Can themes depend on other themes?**

Example: `theme-phase` extends `theme-rad-os`, only overriding tokens

Options:
- A) Yes, themes can extend other themes
- B) No, themes must be standalone
- C) Only token inheritance, not component inheritance

Which approach?

**Your answer:**
B — we don't need this at this time. 

---

### LeftRail Integration

**Q45: How does theme indicator fit into the LeftRail?**

Current LeftRail (from devtools-modes-v1.md):
```
┌──┐
│🔍│  Component ID
│✏️│  Text Edit
│❓│  Help
├──┤
│📊│  Variables
│🔤│  Typography
│🧩│  Components
│📁│  Assets
│🤖│  AI
│⚙️│  Mock States
└──┘
```

Options:
- A) Add theme switcher at top of LeftRail
- B) Add theme indicator in top bar (above LeftRail)
- C) Theme lives in a settings cog (separate from LeftRail)
- D) Theme is a new tab in the tab section

Which approach?

**Your answer:**
The theme creation wizard(w/ switcher and more info)lives in a settings cog at the bottom of the left rail, this will house radtools settings. In the top bar we'll have a theme indicator and small dropdown menu to choose the theme. This will live next to the other dropdowns (breakpoint + panel position, which should be seperated). 
---

**Q46: What does the theme indicator show at a glance?**

Options:
- A) Theme icon/logo only
- B) Theme name only
- C) Theme name + current mode (e.g., "PHASE · dark")
- D) Just a colored dot indicating active theme

Which approach?

**Your answer:**

[Logo + Theme Name | mode]
---

## Summary

After answering all questions, we'll synthesize into:
1. Final folder structure
2. DevTools UI wireframes/requirements
3. Zustand store schema
4. API route changes
5. CSS parser changes
6. Component discovery changes
7. Build configuration
8. Migration guide
9. Implementation phases
10. Updates to related plans

---

## Notes

(Space for additional thoughts during discussion)