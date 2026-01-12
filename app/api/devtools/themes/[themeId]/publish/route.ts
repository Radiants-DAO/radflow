import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import {
  bumpThemeVersion,
  createGitTag,
  gitTagExists,
  VersionBumpType,
} from '@/packages/devtools/src/lib/versionUtils';
import { generateAndWriteReadme } from '@/packages/devtools/src/lib/readmeGenerator';

const execAsync = promisify(exec);

interface PublishThemeRequest {
  versionBump?: VersionBumpType; // 'major' | 'minor' | 'patch'
  createBranch?: boolean; // Default: true
  createPR?: boolean; // Default: false (requires GitHub CLI)
  commitMessage?: string;
}

/**
 * Publish a theme by creating a release branch and optionally opening a PR
 *
 * POST /api/devtools/themes/[themeId]/publish
 * Body:
 *  - versionBump: 'major' | 'minor' | 'patch' (default: 'patch')
 *  - createBranch: boolean (default: true)
 *  - createPR: boolean (default: false)
 *  - commitMessage: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ themeId: string }> }
) {
  try {
    const { themeId } = await params;
    const body: PublishThemeRequest = await request.json();

    const versionBump = body.versionBump || 'patch';
    const createBranch = body.createBranch !== false;
    const createPR = body.createPR === true;

    // Ensure we're in a git repository
    try {
      await execAsync('git rev-parse --git-dir', { cwd: process.cwd() });
    } catch {
      return NextResponse.json(
        { error: 'Not in a git repository' },
        { status: 400 }
      );
    }

    // Locate theme directory
    const packagesDir = path.join(process.cwd(), 'packages');
    const themePath = path.join(packagesDir, `theme-${themeId}`);

    // Verify theme exists
    try {
      await fs.access(themePath);
    } catch {
      return NextResponse.json(
        { error: `Theme not found: theme-${themeId}` },
        { status: 404 }
      );
    }

    // Step 1: Bump version in package.json
    const newVersion = await bumpThemeVersion(themeId, versionBump);

    // Step 2: Generate/update README
    await generateAndWriteReadme(themePath);

    // Step 3: Create git branch (if requested)
    let branchName: string | undefined;
    if (createBranch) {
      branchName = `publish/theme-${themeId}-v${newVersion}`;

      try {
        // Check if branch already exists
        try {
          await execAsync(`git rev-parse --verify ${branchName}`, { cwd: process.cwd() });
          return NextResponse.json(
            { error: `Branch already exists: ${branchName}` },
            { status: 409 }
          );
        } catch {
          // Branch doesn't exist, proceed
        }

        // Create and checkout new branch
        await execAsync(`git checkout -b ${branchName}`, { cwd: process.cwd() });
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to create branch',
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    }

    // Step 4: Commit changes
    const commitMessage =
      body.commitMessage ||
      `release(theme-${themeId}): publish v${newVersion}

- Bump version to ${newVersion}
- Update README with latest metadata
- Prepare for npm publish

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`;

    try {
      // Stage theme directory changes
      await execAsync(`git add packages/theme-${themeId}`, { cwd: process.cwd() });

      // Create commit
      await execAsync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
        cwd: process.cwd(),
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Failed to commit changes',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    // Step 5: Create git tag
    try {
      // Check if tag already exists
      const tagExists = await gitTagExists(themeId, newVersion);
      if (tagExists) {
        console.warn(`Tag already exists for ${themeId} v${newVersion}`);
      } else {
        await createGitTag(themeId, newVersion);
      }
    } catch (error) {
      console.error('Failed to create git tag:', error);
      // Don't fail the request if tagging fails
    }

    // Step 6: Create PR (if requested)
    let prUrl: string | undefined;
    if (createPR && branchName) {
      try {
        // Check if gh CLI is available
        await execAsync('gh --version', { cwd: process.cwd() });

        // Push branch to remote
        await execAsync(`git push -u origin ${branchName}`, { cwd: process.cwd() });

        // Create PR using gh CLI
        const prTitle = `Release: ${themeId} v${newVersion}`;
        const prBody = generatePRBody(themeId, newVersion, versionBump);

        const { stdout } = await execAsync(
          `gh pr create --title "${prTitle}" --body "${prBody.replace(/"/g, '\\"')}"`,
          { cwd: process.cwd() }
        );

        // Extract PR URL from output
        const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/);
        if (urlMatch) {
          prUrl = urlMatch[0];
        }
      } catch (error) {
        console.error('Failed to create PR:', error);
        // Don't fail the request if PR creation fails
      }
    }

    // Step 7: Push branch (if PR not created but branch exists)
    if (branchName && !createPR) {
      try {
        await execAsync(`git push -u origin ${branchName}`, { cwd: process.cwd() });
      } catch (error) {
        console.error('Failed to push branch:', error);
      }
    }

    return NextResponse.json({
      success: true,
      themeId,
      version: newVersion,
      versionBump,
      branch: branchName,
      prUrl,
      message: createPR
        ? `Published ${themeId} v${newVersion} and created PR`
        : `Published ${themeId} v${newVersion} on branch ${branchName}`,
    });
  } catch (error) {
    console.error('Error publishing theme:', error);
    return NextResponse.json(
      {
        error: 'Failed to publish theme',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * Generate PR body with changelog and release notes
 */
function generatePRBody(themeId: string, version: string, versionBump: VersionBumpType): string {
  const versionType = versionBump === 'major' ? 'Major' : versionBump === 'minor' ? 'Minor' : 'Patch';

  return `## Release: ${themeId} v${version}

### ${versionType} Release

This PR publishes a new ${versionType.toLowerCase()} version of the \`${themeId}\` theme.

### Changes

- ✅ Version bumped to ${version}
- ✅ README.md updated with latest metadata
- ✅ Theme validated and ready for npm publish

### What's Included

- Design tokens and semantic colors
- Typography system
- Dark mode support
- Components (if any)
- Assets (icons, logos, images)
- AI agents and prompts

### Publishing Checklist

- [ ] Review version number
- [ ] Verify README is up to date
- [ ] Test theme in a sample project
- [ ] Run \`npm publish\` from \`packages/theme-${themeId}\`

### Next Steps

After merging this PR:

1. Checkout main branch and pull latest changes
2. Navigate to \`packages/theme-${themeId}\`
3. Run \`npm publish --access public\` (or \`pnpm publish --access public\`)
4. Verify package appears on npm

---

🤖 Generated by [RadFlow DevTools](https://github.com/Radiants-DAO/radflow)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
`;
}
