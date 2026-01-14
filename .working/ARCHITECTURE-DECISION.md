# Architecture Decision: Theme Development Location

## The Core Question

Where should theme-based client sites (RadOS, Phase, future themes) be developed?

---

## Option A: Monorepo (Current State)

```
radflow/
├── packages/
│   ├── devtools/           # Visual editor
│   ├── primitives/         # Headless hooks (new)
│   ├── theme-rad-os/       # RadOS theme + components + pages
│   └── theme-phase/        # Phase theme + components + pages
├── app/                    # Next.js routes (thin wrappers)
└── components/             # Shared project components
```

### Pros
- **Instant iteration**: Change devtools → see effect in theme immediately
- **No publishing**: Internal dependencies "just work" via pnpm workspace
- **Single repo to clone**: New contributors get everything
- **Easy refactoring**: Rename/move across packages in one commit

### Cons
- **Scaling issues**: RadOS will have 50+ pages, blog, docs, ecommerce—all in one repo
- **Noise**: Working on Phase? Still see all RadOS files
- **CI/CD complexity**: Deploy radflow.dev vs rad-os.com from same repo
- **Permission boundaries**: Hard to give theme owners limited access

### Best For
- Early development when iterating rapidly
- Small teams (1-3 people)
- Themes that share lots of code

---

## Option B: Separate Repos (Install RadFlow as Dependency)

```
# radflow/ repo (published to npm)
├── packages/
│   ├── devtools/           # @radflow/devtools
│   └── primitives/         # @radflow/primitives

# rad-os/ repo (separate)
├── package.json            # depends on @radflow/devtools, @radflow/primitives
├── theme/                  # theme CSS + components
├── app/                    # Next.js pages
└── content/                # Blog, docs, etc.

# phase/ repo (separate)
├── package.json            # depends on @radflow/devtools, @radflow/primitives
├── theme/                  # theme CSS + components
├── app/                    # Next.js pages
└── ...
```

### Pros
- **Clean separation**: Each product owns its repo, team, deploy pipeline
- **Independent versioning**: RadOS can stay on devtools@1.2 while Phase uses @2.0
- **Scale naturally**: Each repo grows with its product, not the whole ecosystem
- **Permission control**: Theme teams only access their repo

### Cons
- **Publishing overhead**: Must `npm publish` devtools for themes to get updates
- **Version drift**: Themes may fall behind on devtools updates
- **Local dev friction**: Need `pnpm link` or similar for cross-repo development
- **Harder refactoring**: Changes across repos = multiple PRs

### Best For
- Mature themes with dedicated teams
- Products with very different needs (RadOS = creative agency, Phase = Web3 SaaS)
- When you want theme owners to have full autonomy

---

## Option C: Hybrid (Linked Workspaces)

```
# radflow/ repo
├── packages/
│   ├── devtools/
│   └── primitives/
├── pnpm-workspace.yaml     # Can link external repos

# theme-rad-os/ repo (linked as workspace)
├── package.json            # "name": "@radflow/theme-rad-os"
├── theme/
└── app/

# theme-phase/ repo (linked as workspace)
├── package.json            # "name": "@radflow/theme-phase"
├── theme/
└── app/
```

To develop, clone all repos into a parent folder:
```bash
mkdir radflow-dev && cd radflow-dev
git clone radflow
git clone theme-rad-os
git clone theme-phase
# pnpm-workspace.yaml includes "../theme-*"
pnpm install  # Links everything
```

### Pros
- **Independent repos**: Each theme has its own git history, PRs, deploys
- **Local dev still works**: Linked workspaces = instant iteration
- **Publish when ready**: Themes can publish to npm or stay private
- **Gradual migration**: Move themes out of monorepo one at a time

### Cons
- **Setup complexity**: New contributors need to clone multiple repos
- **Workspace config**: pnpm-workspace.yaml needs careful management
- **CI complexity**: Theme repos need to reference devtools somehow

### Best For
- Teams that want separation but need fast iteration
- Transitioning from monorepo to separate repos

---

## Option D: Ejectable Pattern

Start in monorepo, eject when mature:

```
# Phase 1: Develop in monorepo
radflow/
├── packages/theme-phase/   # Develop here initially

# Phase 2: Eject when ready
npx radflow eject theme-phase --output ../theme-phase

# Creates standalone repo:
theme-phase/
├── package.json            # Dependencies on @radflow/*
├── theme/                  # Copied from packages/theme-phase/
└── app/                    # Copied + adapted
```

### Pros
- **Best of both**: Fast iteration early, clean separation later
- **Low commitment**: Don't decide until you need to
- **Tooling opportunity**: CLI can automate the ejection

### Cons
- **Ejection is complex**: File moves, import updates, config changes
- **One-way door**: Hard to "un-eject" back to monorepo
- **Maintenance burden**: Must maintain ejection tooling

### Best For
- Uncertain timelines
- When you don't know how big themes will get

---

## Recommendation

Given RadFlow's current state (Phase is new, RadOS exists but may grow):

### Short Term (Now → 3 months)
**Stay in monorepo** but prepare for separation:
1. Create `packages/primitives/` with headless hooks
2. Move theme pages into their theme packages
3. Keep clear boundaries between themes (no cross-theme imports)

### Medium Term (When themes have dedicated teams/products)
**Migrate to linked workspaces (Option C)**:
1. Move `theme-rad-os/` to its own repo
2. Use pnpm workspace linking for local dev
3. Publish `@radflow/devtools` and `@radflow/primitives` to npm

### The Key Question for You

**How soon do you expect RadOS and Phase to diverge significantly?**

- If they'll share lots of patterns → stay monorepo longer
- If they're fundamentally different products → separate sooner
- If different people will own each theme → separate for permission boundaries

---

## DevTools Connection (For Separate Repos)

If/when themes become separate repos, DevTools needs to know where to write CSS.

### Option 1: pnpm link (Recommended for dev)
```bash
# In theme-phase repo:
pnpm link ../radflow/packages/devtools
# DevTools writes to ./theme/*.css in the theme repo
```

### Option 2: Environment variable
```bash
# .env.local in theme repo
RADFLOW_THEME_ROOT=./theme
```
DevTools reads this to find CSS files.

### Option 3: Config file
```json
// radflow.config.json in theme repo
{
  "theme": {
    "root": "./theme",
    "tokens": "./theme/tokens.css",
    "typography": "./theme/typography.css"
  }
}
```

**Recommendation**: Start with pnpm link, add config file for production flexibility.

---

---

# Outstanding Decisions

These questions need answers before finalizing the architecture.

---

## Decision 1: Theme Development Location

**Question**: Where should theme-based client sites be developed?

**Context from discussion**:
- RadOS = mimics an operating system with micro-frontends for complex apps
- Phase = Web3 SaaS, very different product

**Options**:

| Option | When to Choose | Tradeoff |
|--------|----------------|----------|
| **A: Monorepo** | Fast iteration matters most, small team | Will get messy as RadOS grows to 50+ pages |
| **B: Separate repos** | You want clean boundaries NOW, have publishing workflow | Need npm publish for every devtools change |
| **C: Linked workspaces** | Want separation + fast local dev | Setup complexity for new contributors |
| **D: Ejectable** | Uncertain about future, want to defer decision | Must build/maintain ejection tooling |

**Design Consideration**: Given RadOS and Phase are fundamentally different products, **separation makes sense eventually**. The question is timing:
- **Separate now** = more upfront work, cleaner long-term
- **Monorepo now, separate later** = faster short-term, migration cost later

**My lean**: Option C (Linked Workspaces) or Option D (Ejectable). Both give you monorepo benefits now with a path to separation.

---

## Decision 2: @radflow/ui Package Fate

**Question**: What should happen to the @radflow/ui package?

**Current state**: It just re-exports `@radflow/theme-rad-os/components/core`

**Options**:

| Option | Pros | Cons |
|--------|------|------|
| **Delete entirely** | Clean, no confusion | Breaking change for anything importing from it |
| **Rename to @radflow/primitives** | Reuses package slot, less packages | Semantic mismatch (was components, now hooks) |
| **Repurpose for primitives** | Smooth migration path | Package name doesn't match contents |
| **Keep as RadOS re-export** | Backwards compat | Perpetuates confusion about what it does |

**Design Consideration**: Since this is new software with no external users:
- No backwards compatibility needed
- Clean break is safe

**My lean**: Delete @radflow/ui, create fresh @radflow/primitives. Clear naming, no baggage.

---

## Decision 3: Root Route Purpose

**Question**: What should `app/page.tsx` (the `/` route) display?

**Options**:

| Option | When to Choose | Tradeoff |
|--------|----------------|----------|
| **Active theme's landing** | RadFlow IS the product | Couples root route to theme system |
| **Theme selector/switcher** | RadFlow is a framework showcase | Need to maintain neutral landing |
| **RadFlow explainer/docs** | RadFlow is a tool, themes are separate products | RadFlow.dev vs rad-os.com vs phase.xyz = 3 deploys |
| **Redirect to active theme** | Clean separation, `/` → `/phase` | Extra redirect, URL changes |

**Design Consideration**: This depends on how you deploy:
- **Single domain** (radflow.dev/phase, radflow.dev/rad-os) → need router/selector at root
- **Separate domains** (phase.xyz, rad-os.com) → root route is theme's landing

**My lean**: RadFlow explainer at root, themes at subpaths. Later, themes get their own domains.

---

## Decision 4: Theme Package Internal Structure

**Question**: How should a theme package be organized internally?

**Current Phase structure**:
```
packages/theme-phase/
├── index.css               # CSS entry
├── tokens.css              # Design tokens
├── components/
│   ├── core/               # 30 components
│   └── landing/            # 11 page-specific components
└── (no pages yet)
```

**Proposed structure with pages**:
```
packages/theme-phase/
├── index.css
├── tokens.css
├── components/
│   ├── core/               # Shared components
│   └── landing/            # Landing page components
├── pages/
│   ├── landing/            # Landing page export
│   ├── pricing/            # Pricing page export
│   └── dashboard/          # Dashboard page export
├── skills/                 # Theme-specific Claude skills
└── agents/                 # Theme-specific agents
```

**Options**:

| Structure | Pros | Cons |
|-----------|------|------|
| **Flat (current)** | Simple, familiar | Pages scattered across app/ |
| **pages/ folder** | Self-contained themes | Need export strategy for Next.js |
| **app/ inside theme** | Full Next.js structure per theme | Complexity, how to merge? |

**My lean**: `pages/` folder with component exports. App router has thin wrappers:
```tsx
// app/phase/page.tsx
export { default } from '@radflow/theme-phase/pages/landing';
```

---

## Decision 5: Skills/Agents Ownership (Partially Answered)

**Question**: Where do skills and agents live?

**Your answer**: Hybrid - Theme owns design, root owns tools

**Clarification needed**:

| Skill Type | Location | Example |
|------------|----------|---------|
| Design skills | `packages/theme-*/skills/` | "Generate Phase-styled component" |
| Tool skills | `.claude/skills/` (root) | "Create commit", "Run compliance check" |
| Theme CLI | `packages/theme-*/cli/` ? | "radflow phase:init" |

**My lean**: This seems right. Design knowledge lives with themes, tooling lives at root.

---

## All Decisions - FINAL

| Decision | Answer | Rationale |
|----------|--------|-----------|
| **Theme location** | Linked workspaces | Separate repos, pnpm links for dev. Allows separate licensing. |
| **@radflow/ui** | Delete | No backwards compat needed, create fresh @radflow/primitives |
| **Root route** | RadFlow explainer | Develop later after core is solid |
| **Theme package structure** | Pages folder | `packages/theme-*/pages/` with component exports |
| **Skills location** | AI tab → install to theme | Browse in DevTools, install to theme, persists after unlink |
| **Component contribution** | PR workflow | Theme devs submit PRs to add components to primitives |
| **RadFlow deployment** | No public site | npm packages only. Docs in README/GitHub. |
| **DevTools theming** | Config file mapping | `radflow.config.json` specifies icons, fonts, SREF codes |
| **Skills browsing** | RadFlow skill library | Central list of skills, theme picks which to install |
| **Theme detection** | Environment variable | `NEXT_PUBLIC_THEME` or similar, detect installed themes |
| **Primitives package** | Create `@radflow/primitives` | Extract complex component logic |
| **Primitives priority** | All complex at once | Dialog, Sheet, Toast, Select, Button, Tabs, Popover, DropdownMenu |
| **Route wrappers** | Thin exports | `app/phase/page.tsx` → re-exports theme page |
| **Theme divergence** | Very different | RadOS ≠ Phase, design for separation |

---

---

# Theme Separation Audit

Functionality found in the repo that would benefit from theme separation.

## Critical: Must Move to Theme Packages

### 1. Phase Route & Layout (`app/phase/`)

| File | Lines | Issue |
|------|-------|-------|
| `app/phase/page.tsx` | 884 | Entire Phase landing page - hardcoded Phase tokens, branding, content |
| `app/phase/layout.tsx` | ~50 | Phase-specific metadata, font classes |

**Hardcoded Phase values found:**
- `--color-gold`, `--glass-bg`, `--glass-border` (Phase tokens)
- `font-outfit`, `font-audiowide`, `font-kodemono` (Phase fonts)
- Phase branding: "STAKE // DELEGATE // TAX", partner logos (Solana, Jito, etc.)

**Action**: Move to `packages/theme-phase/pages/landing/`

### 2. Public Assets (Not Theme-Organized)

```
/public/assets/
├── logos/          # RadOS only (rad-mark, radsun, wordmark)
├── images/         # RadOS branding
├── icons/          # 168 shared icons (keep shared)
└── (missing)       # Phase assets referenced but don't exist!
```

**Missing Phase assets** (referenced in page but not present):
- `/assets/icons/stake-services.svg`
- `/assets/icons/usdsol-token.png`, `/assets/icons/pdsol-token.png`
- `/assets/avatars/devour.avif`, etc.

**Proposed structure:**
```
/public/assets/
├── shared/              # System icons, shared images
└── themes/
    ├── phase/           # Phase logos, tokens, avatars
    └── rad-os/          # RadOS logos, images
```

### 3. globals.css (Static Theme Import)

```css
/* Current - hardcoded */
@import "@radflow/theme-phase";
```

**Issue**: No way to switch themes without editing file. DevTools can detect but not change active theme at runtime.

**Options**:
- Environment variable: `NEXT_PUBLIC_THEME=phase`
- Build-time substitution
- Keep as manual (themes are products, not switchable)

---

## Good: Already Theme-Separated

| Location | Status |
|----------|--------|
| `packages/theme-phase/components/core/` | ✅ 30 components |
| `packages/theme-phase/components/landing/` | ✅ 11 components |
| `packages/theme-phase/*.css` | ✅ All CSS files |
| `packages/theme-rad-os/components/core/` | ✅ 30 components |
| `app/layout.tsx` (root) | ✅ Theme-agnostic |
| DevTools API routes | ✅ Theme-aware |

---

## API Routes: Partially Theme-Aware

| Route | Status | Issue |
|-------|--------|-------|
| `/api/devtools/themes/[themeId]/write-css` | ✅ Theme-scoped | Good |
| `/api/devtools/themes/current` | ✅ Detects theme | Good |
| `/api/devtools/logos` | ⚠️ Hardcoded path | Reads `/public/assets/logos/` (RadOS only) |
| `/api/devtools/assets` | ⚠️ Single directory | No theme scoping |

**Recommendation**: Add theme parameter to asset routes, or organize assets by theme.

---

## Summary: Theme Separation Work

| Priority | Item | Current Location | Target Location |
|----------|------|------------------|-----------------|
| 🔴 High | Phase landing page | `app/phase/page.tsx` | `packages/theme-phase/pages/` |
| 🔴 High | Phase layout | `app/phase/layout.tsx` | `packages/theme-phase/pages/` |
| 🟡 Medium | Phase assets | (missing) | `public/assets/themes/phase/` |
| 🟡 Medium | RadOS assets | `public/assets/logos/` | `public/assets/themes/rad-os/` |
| 🟢 Low | Logo API | `/api/devtools/logos` | Add theme param |
| 🟢 Low | Asset API | `/api/devtools/assets` | Add theme scoping |

---

## Next Steps

Once you answer Decisions 1-4:

1. Create the target architecture diagram
2. Write ARCHITECTURE.md
3. Update CLAUDE.md from working draft
4. Begin implementation (primitives package first)
5. Move Phase page to theme package
6. Reorganize public assets by theme
