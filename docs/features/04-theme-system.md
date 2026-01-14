# Theme System

## Purpose

The Theme System defines what a theme IS and what it PROVIDES. A theme is the complete visual identity and component library for a project. The editor discovers and presents themes — it doesn't define them.

**The editor is the console. The theme is the game.**

---

## Theme Concept

### What is a Theme?
A theme is a complete, self-contained design system package.

**A theme provides:**
- Component library (Button, Card, Input, etc.)
- Design tokens (colors, spacing, shadows, radius)
- Typography system (fonts, scales, styles)
- Visual identity (the "look and feel")

### Theme as Product
The theme IS the product. The editor is just a tool to work with it.

**Theme Contains:**
- Everything needed to build UIs
- All components with their variants
- All styling decisions
- All visual patterns

**Editor Provides:**
- Discovery of what's in the theme
- Preview and inspection
- Visual editing interface
- Persistence to theme files

### Theme Independence
Each theme is self-contained.

**Principles:**
- Themes don't inherit from each other
- Changing one theme doesn't affect others
- Themes can be added/removed independently
- Projects can have multiple themes active

### Theme vs Color Mode
Themes and color modes are different concepts.

**Theme:** Complete visual identity (brand A vs brand B)
**Color Mode:** Light/dark variation within a theme

A theme contains both light and dark modes. Switching themes changes the entire visual identity. Switching modes changes light/dark within current theme.

---

## Theme Structure

### Theme Package
Each theme is a discrete package.

**Package Contains:**
- Token definitions (colors, spacing, etc.)
- Typography configuration
- Font assets (if custom)
- Component style overrides
- Theme metadata

### Theme Metadata
Information describing the theme.

**Metadata Fields:**
- Theme ID (unique identifier)
- Display name
- Description
- Version
- Author/maintainer
- Preview image

### File Organization
Standard file structure within a theme.

**Typical Structure:**
```
@radflow/theme-example/
├── components/           # Component library
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── tokens.css           # Design tokens
├── typography.css       # Typography system
├── fonts.css            # Font declarations
├── dark.css             # Dark mode overrides
├── base.css             # Base HTML styles
└── manifest.json        # Theme metadata + component info
```

---

## Component Library

### Theme Owns Components
Components are part of the theme, not the editor.

**Principle:**
- Each theme provides its own component implementations
- Components express the theme's visual identity
- Same component interface, different visual treatment
- Theme is responsible for component quality

### Component Requirements
What every theme component must have.

**Required:**
- Default export (named exports ignored)
- TypeScript props interface
- Default values for visual props
- Semantic token usage (no hardcoded colors)

**Recommended:**
- Variant prop (primary, secondary, etc.)
- Size prop (sm, md, lg)
- Consistent prop naming across components

### Variant System
Components support visual variants.

**Pattern:**
- `variant` prop controls visual style
- Each variant is a complete visual treatment
- Variants share structure, differ in appearance
- Theme defines which variants exist

**Example Variants:**
- Button: primary, secondary, ghost, destructive
- Card: default, elevated, outlined
- Input: default, filled, underlined

### Size System
Components support size scaling.

**Pattern:**
- `size` prop controls dimensions
- Sizes are relative, not absolute
- Theme defines the size scale
- Consistent sizing across components

**Typical Sizes:**
- sm — Compact, dense UIs
- md — Default, standard usage
- lg — Emphasized, touch-friendly

### Component Manifest
Optional metadata file for richer editor integration.

**Manifest Provides:**
- Component categorization (buttons, inputs, layout)
- Explicit variant enumeration
- Size options
- Compound component relationships
- Preview configuration
- Documentation hints

**Without Manifest:**
- Editor discovers via file scanning
- Infers props from code
- Groups by folder structure
- Basic preview only

---

## Theme Switching

### Active Theme
One theme is active at any time.

**Behavior:**
- Active theme's tokens are applied
- Components render with active theme styles
- Editor reflects active theme values
- Persistence targets active theme files

### Switch Action
Changing the active theme.

**Process:**
- Select new theme from available options
- System updates CSS import references
- Page refreshes with new theme
- Editor loads new theme's token values
- Components re-render with new styles

### Theme Persistence
Active theme selection is remembered.

**Storage:**
- Active theme ID saved to configuration
- Restored on project reload
- Per-project theme selection
- Default theme if none specified

---

## Theme Management

### Available Themes
View all themes installed in the project.

**Display:**
- Theme name and description
- Preview swatch/image
- Version information
- Active indicator

### Add Theme
Install a new theme to the project.

**Methods:**
- Install from package registry
- Import theme files
- Create from template
- Duplicate existing theme

### Remove Theme
Uninstall a theme from the project.

**Behavior:**
- Confirm before removal
- Cannot remove active theme
- Theme files deleted
- References updated

### Theme Settings
Configure theme-specific options.

**Options:**
- Display name override
- Default color mode
- Feature flags
- Custom metadata

---

## Theme Creation

### New Theme from Scratch
Create a completely new theme.

**Process:**
- Provide theme metadata
- Define base color palette
- Map semantic tokens
- Configure typography
- Set up size scales
- Test with components

### New Theme from Template
Start from a pre-built template.

**Templates:**
- Minimal (bare essentials)
- Standard (common patterns)
- Rich (full feature set)
- Clone (copy of existing theme)

### Theme Customization
Modify an existing theme.

**Workflow:**
- Select theme to customize
- Edit token values
- Adjust typography
- Preview changes
- Save modifications

---

## Theme Preview

### Theme Comparison
View components across different themes.

**Features:**
- Side-by-side theme rendering
- Same component, different themes
- Quick visual comparison
- Identify inconsistencies

### Preview Mode
Temporarily preview a different theme.

**Behavior:**
- Apply theme visually without switching
- Editor stays on current theme
- Quick look at other themes
- Exit returns to active theme

### Theme Showcase
Dedicated view for theme presentation.

**Display:**
- All color tokens visualized
- Typography scale displayed
- Component samples rendered
- Shadow and radius previews

---

## Theme Tokens

### Token Consistency
All themes implement the same token interface.

**Requirement:**
- Same semantic token names across themes
- Same token categories
- Different values, same structure
- Components work with any theme

### Token Coverage
Themes must define all required tokens.

**Validation:**
- Missing tokens flagged
- Warnings for incomplete themes
- Suggestions for required values
- Fallback behavior defined

### Token Documentation
Each token's purpose is documented.

**Documentation Includes:**
- Token name
- Category
- Expected usage
- Example applications

---

## Theme Integration

### Component Compatibility
Components work across all themes.

**Requirements:**
- Components use semantic tokens
- No hardcoded color values
- Theme-agnostic structure
- Graceful handling of missing tokens

### Theme-Specific Components
Some components may be theme-specific.

**Handling:**
- Clearly marked as theme-specific
- Fallback for other themes
- Documentation of restrictions
- Alternative suggestions

### Build Output
Themes compile to standard CSS.

**Output Options:**
- Single CSS file per theme
- CSS custom properties
- Separate light/dark files
- Optimized for production

---

## Persistence

### Theme File Updates
Theme changes write to theme package files.

**Saved To:**
- Token definition files
- Typography configuration
- Font declarations
- Component overrides

### Configuration Updates
Theme selection persists to project config.

**Saved To:**
- Project configuration file
- CSS import statements
- Build configuration

### Version Control
Theme changes tracked in version control.

**Best Practices:**
- Commit theme changes separately
- Document theme modifications
- Tag theme versions
- Review theme changes in PRs

---

## Ideal Behaviors

### Theme Migration Tools
When updating themes, automatically migrate token values. Map old tokens to new structure. Preserve customizations.

### Theme Validation
Comprehensive validation that theme meets all requirements. Accessibility checking across all tokens. Component compatibility verification.

### Theme Marketplace
Browse and install community themes. Share themes publicly. Rate and review themes.

### Theme Variables Export
Export theme as CSS custom properties, JSON tokens, Tailwind config, or other formats. Import from design tools.

### Live Theme Preview
Preview theme changes across the entire application, not just components. Navigate the app while previewing.

### Theme A/B Testing
Support for theme experiments. Toggle between themes for user testing. Analytics on theme preference.

### Theme Scheduling
Automatically switch themes based on time, season, or events. Support for temporary promotional themes.

### Multi-Brand Support
Manage multiple brand themes in one project. Share base components, differ in theme values. White-label support.

---

## Research Notes

### Complexity Assessment
**Medium** — Mostly file operations and configuration management.

### Research Required

**Theme Package Structure**
- Standard patterns for design system packages
- How Tailwind, Chakra, Radix structure their themes
- Component library packaging best practices

**Theme Switching Mechanisms**
- CSS custom property scoping
- Runtime theme switching without page reload
- CSS layer ordering for theme precedence

**Token Export Formats**
- Design Tokens Community Group (DTCG) format
- Figma Tokens plugin format
- Style Dictionary format
- Tailwind config generation

### Search Terms
```
"design tokens community group format"
"css custom properties theme switching"
"figma tokens export format"
"style dictionary config"
"tailwind config from design tokens"
"theme package structure npm"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| Theme Scanner | Discover installed themes |
| Theme Config | Read/write theme metadata |
| Theme Switcher | Update active theme references |
| Export Module | Convert tokens to various formats |

**Commands Needed:**
- `list_themes()` → Available themes with metadata
- `switch_theme(id)` → Update active theme
- `export_theme(id, format)` → Tokens in requested format
- `create_theme(template, name)` → New theme from template

### Existing Standards to Review
- **DTCG Spec**: https://design-tokens.github.io/community-group/format/
- **Style Dictionary**: https://amzn.github.io/style-dictionary/
- **Figma Tokens**: Plugin format and schema

### Open Questions
- Follow DTCG format or create RadFlow-specific format?
- Theme inheritance: allow themes to extend other themes?
- How to handle theme-specific components vs shared components?
