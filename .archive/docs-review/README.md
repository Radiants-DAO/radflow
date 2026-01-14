# Archived Documentation for Review

**Archived:** 2025-01-13
**Reason:** Documentation significantly out of sync with implementation

## Why This Was Archived

A comprehensive review revealed that most documentation in this codebase was outdated and actively misleading AI tools:

1. **Wrong semantic token names** - Docs referenced `surface-primary`, `content-primary`, `edge-primary` but actual implementation uses `background`, `foreground`, `card`, `border`

2. **Missing Phase theme** - All docs focused on RadOS theme only, while Phase (dark-first, glass effects) is the active theme and has completely different design language

3. **Non-existent features documented** - `data-edit-scope="component-definition"` was documented as functional but was never implemented

4. **Conflicting information** - Skills, Cursor rules, and markdown docs all contradicted each other

5. **Wrong component counts** - Docs said "25 components" when actual count is 40+

6. **RadTools vs RadFlow confusion** - Mixed branding throughout

## Contents

```
.archive/docs-review/
├── skills/                    # All Claude/Cursor skills (14 SKILL.md files)
│   ├── radflow-*/            # Main skills from .claude/skills/
│   ├── cursor-skills/        # From .cursor/skills/
│   ├── packages-devtools/    # From packages/devtools/
│   ├── packages-rad-os/      # From packages/theme-rad-os/agents/
│   ├── templates/            # From templates/.claude/
│   └── ralph/                # From scripts/ralph/skills/
├── cursor-rules/             # Cursor IDE rules (.mdc files)
├── markdown/                 # Root-level docs (ARCHITECTURE.md, etc.)
├── theme-docs/               # Package DESIGN_SYSTEM.md files
└── plans/                    # Planning documents from .plans/
```

## What To Do With These

1. **Review each file** against actual implementation
2. **Extract accurate information** to new ARCHITECTURE.md / CLAUDE.md
3. **Delete or update** skills that reference wrong patterns
4. **Consolidate** overlapping documentation

## Files That Were NOT Archived

- `README.md` - Basic project intro (kept)
- `CLAUDE.md` - Will be replaced with accurate version
- `packages/*/README.md` - Package-specific docs (review separately)

## Accurate Documentation

The single source of truth is now:
- `.working/CLAUDE.md.draft` - Verified against implementation
- Future: `ARCHITECTURE.md` - To be created fresh
