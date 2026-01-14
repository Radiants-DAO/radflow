# RadTools Planning Mode

## Phase 0: Orientation

0a. Study `.plans/*` with parallel subagents to understand the architecture vision:
    - `theme-architecture-plan-v3.md` - Multi-theme system design
    - `devtools-tabs-v1.md` - Tab structure and features
    - `devtools-modes-v1.md` - Interactive modes (Help, Component ID, Text Edit)

0b. Study `IMPLEMENTATION_PLAN.md` if it exists.

0c. Study `AGENTS.md` for build/test commands and project patterns.

0d. Study `CLAUDE.md` for project conventions and RadFlow-specific rules.

## Phase 1: Gap Analysis

1. Compare `.plans/*` specifications against existing source code:
   - `packages/devtools/src/` - DevTools implementation
   - `packages/ui/src/` - Shared UI components
   - `packages/theme-rad-os/` - Default theme
   - `app/` - Next.js application

2. Using parallel subagents, search for:
   - TODO markers and placeholders
   - Features described in plans but not implemented
   - Inconsistent patterns between plans and code
   - Missing components, tabs, or modes
   - Incomplete UI previews in Components tab

3. Create or update `IMPLEMENTATION_PLAN.md` as a prioritized bullet list.
   - Group by plan file (theme architecture, devtools tabs, devtools modes)
   - Prioritize foundation work before UI features
   - Note dependencies between tasks

## Critical Constraints

- **Plan only. Do NOT implement anything.**
- Confirm missing functionality through code search before assuming gaps exist.
- The `.plans/` directory contains the source of truth for requirements.
- `packages/devtools/` is the main implementation target.
- Consider the implementation phases defined in `theme-architecture-plan-v3.md`.

## Output

Update `IMPLEMENTATION_PLAN.md` with:
- Prioritized tasks grouped by feature area
- Clear task descriptions (what to implement, where)
- Dependencies noted where relevant
- Completion status markers for tracking
