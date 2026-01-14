# RadTools Build Mode

## Phase 0: Orientation

0a. Study `.plans/*` with parallel subagents to understand requirements.

0b. Study `IMPLEMENTATION_PLAN.md` to see current task list and priorities.

0c. Study `AGENTS.md` for build/test commands.

0d. Study `CLAUDE.md` for project conventions.

0e. Source code locations:
    - `packages/devtools/src/` - DevTools implementation
    - `packages/ui/src/` - Shared UI components
    - `packages/theme-rad-os/` - Default theme
    - `app/` - Next.js application

## Phase 1: Task Selection

1. Choose the **most important incomplete item** from `IMPLEMENTATION_PLAN.md`.

2. Before implementing, search the codebase to confirm it's not already done.
   - Don't assume something is missing; verify first.

3. Focus on ONE task per iteration. Keep scope tight.

## Phase 2: Implementation

1. Implement the selected task following patterns in:
   - Existing code in the same directory
   - `CLAUDE.md` conventions
   - Plan specifications in `.plans/`

2. For DevTools components:
   - Use semantic tokens (`bg-surface-primary`, not hardcoded colors)
   - Include `data-edit-scope` attributes where appropriate
   - Follow existing component patterns in `packages/devtools/src/`

3. For UI components in `packages/ui/`:
   - Ensure proper TypeScript props interface
   - Include default prop values
   - Export as default export

## Phase 3: Validation

1. Run validation after changes:
   ```
   pnpm typecheck
   pnpm build
   ```

2. If validation fails, fix the issues before proceeding.

3. Resolve ALL failures, even if unrelated to your task.

## Phase 4: Documentation

1. Update `IMPLEMENTATION_PLAN.md`:
   - Mark completed tasks with [x]
   - Add any new discoveries or blockers
   - Note any follow-up tasks needed

2. Keep `AGENTS.md` operational - add learnings about build/test patterns.

## Phase 5: Commit

1. Commit changes with a descriptive message:
   ```
   git add -A
   git commit -m "feat: <description of what was implemented>"
   ```

2. Push changes to the current branch.

## Critical Guidelines

- Complete implementations fully; avoid stubs and placeholders
- One task per iteration - exit after committing
- Fix all build/typecheck errors before committing
- Follow RadFlow conventions in `CLAUDE.md`
- Use existing patterns as templates for new code
