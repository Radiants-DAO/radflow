#!/usr/bin/env node

/**
 * Generate UI Tab Component from @radflow/ui package
 * 
 * Parses component files and generates UITab.tsx and UITabSearchIndex.ts
 * matching the structure of DesignSystemTab.tsx
 */

import { Project, SyntaxKind, Node } from 'ts-morph';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Script is in packages/devtools/scripts/, so go up 3 levels to get to workspace root
const ROOT = join(__dirname, '../../..');
const UI_PACKAGE = join(ROOT, 'packages/ui');
const DEVTOOLS_PACKAGE = join(ROOT, 'packages/devtools');
const UI_SRC = join(UI_PACKAGE, 'src');
const OUTPUT_DIR = join(DEVTOOLS_PACKAGE, 'src/tabs/ComponentsTab');

// Load manifest if it exists
const manifestPath = join(UI_PACKAGE, 'devtools.manifest.json');
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf-8'))
  : { categories: {} };

interface ComponentInfo {
  name: string;
  file: string;
  variants?: string[];
  sizes?: string[];
  compound?: string[];
  section: string;
  interactive?: boolean;
  triggerComponent?: string;
  props?: string;
}

// Initialize TypeScript project
const tsConfigPath = join(UI_PACKAGE, 'tsconfig.json');
const project = existsSync(tsConfigPath)
  ? new Project({
      tsConfigFilePath: tsConfigPath,
    })
  : new Project({
      compilerOptions: {
        target: 5, // ES2020
        module: 1, // ES2015
        jsx: 2, // React
      },
    });

// Parse index.ts to get all exports
const indexFile = project.getSourceFile(join(UI_SRC, 'index.ts'));
if (!indexFile) {
  throw new Error('Could not find packages/ui/src/index.ts');
}

const components: ComponentInfo[] = [];

// Parse export declarations from index.ts
const exportDeclarations = indexFile.getExportDeclarations();

for (const exportDecl of exportDeclarations) {
  const moduleSpecifier = exportDecl.getModuleSpecifierValue();
  if (!moduleSpecifier || !moduleSpecifier.startsWith('./')) continue;
  
  // Resolve the module path
  const modulePath = moduleSpecifier.replace(/^\.\//, '');
  let filePath = join(UI_SRC, modulePath + '.tsx');
  if (!existsSync(filePath)) {
    filePath = join(UI_SRC, modulePath + '.ts');
    if (!existsSync(filePath)) continue;
  }
  
  const componentFile = project.getSourceFile(filePath);
  if (!componentFile) continue;
  
  // Get all named exports from this declaration
  const namedExports = exportDecl.getNamedExports();
  
  for (const namedExport of namedExports) {
    const exportName = namedExport.getName();
    
    // Skip type exports, hooks, and non-component exports
    if (exportName.startsWith('use') || 
        exportName.includes('Props') || 
        exportName.includes('Variant') || 
        exportName.includes('Size') || 
        exportName === 'Icon' || 
        exportName === 'ICON_SIZES' ||
        exportName.includes('Type') ||
        exportName.includes('Orientation') ||
        exportName.includes('Layout') ||
        exportName.includes('Position') ||
        exportName.includes('Data') ||
        exportName.includes('Item') && !['AccordionItem', 'ContextMenuItem', 'DropdownMenuItem'].includes(exportName) ||
        exportName.includes('Option') ||
        exportName === 'createSafeContext' ||
        exportName === 'useToast' ||
        exportName === 'useEscapeKey' ||
        exportName === 'useClickOutside' ||
        exportName === 'useLockBodyScroll') {
      continue;
    }

    // Get component info from manifest or infer
    const manifestInfo = manifest.categories[exportName] || {};

  // Extract variants and sizes from type aliases
  let variants: string[] | undefined;
  let sizes: string[] | undefined;

  const typeAliases = componentFile.getTypeAliases();
  for (const typeAlias of typeAliases) {
    const name = typeAlias.getName();
    if (name.includes('Variant')) {
      const type = typeAlias.getTypeNode();
      if (type && Node.isUnionTypeNode(type)) {
        variants = type.getTypeNodes()
          .map(n => {
            const text = n.getText();
            return text.replace(/['"]/g, '');
          })
          .filter(Boolean);
      }
    }
    if (name.includes('Size')) {
      const type = typeAlias.getTypeNode();
      if (type && Node.isUnionTypeNode(type)) {
        sizes = type.getTypeNodes()
          .map(n => {
            const text = n.getText();
            return text.replace(/['"]/g, '');
          })
          .filter(Boolean);
      }
    }
  }

  // Extract from Record types
  const variables = componentFile.getVariableDeclarations();
  for (const variable of variables) {
    const name = variable.getName();
    if (name.includes('variantStyles') && !variants) {
      const init = variable.getInitializer();
      if (init && Node.isObjectLiteralExpression(init)) {
        variants = init.getProperties()
          .map(p => p.getName?.())
          .filter(Boolean) as string[];
      }
    }
    if (name.includes('sizeStyles') && !sizes) {
      const init = variable.getInitializer();
      if (init && Node.isObjectLiteralExpression(init)) {
        sizes = init.getProperties()
          .map(p => p.getName?.())
          .filter(Boolean) as string[];
      }
    }
  }

  // Determine section from manifest or infer
  let section = manifestInfo.section || 'components';
  if (!manifestInfo.section) {
    // Infer section from component name/type
    if (['Button'].includes(exportName)) section = 'buttons';
    else if (['Card'].includes(exportName)) section = 'cards';
    else if (['Input', 'TextArea', 'Label', 'Select', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'Slider'].includes(exportName)) section = 'forms';
    else if (['Alert', 'Badge', 'Progress', 'Spinner', 'Skeleton', 'Tooltip', 'Toast'].includes(exportName)) section = 'feedback';
    else if (['Avatar', 'Table'].includes(exportName)) section = 'data-display';
    else if (['Tabs', 'Accordion', 'Breadcrumbs', 'Divider'].includes(exportName)) section = 'navigation';
    else if (['Dialog', 'Sheet', 'Popover', 'DropdownMenu', 'ContextMenu', 'HelpPanel'].includes(exportName)) section = 'overlays';
  }

    components.push({
      name: exportName,
      file: filePath,
      variants: manifestInfo.variants || variants,
      sizes: manifestInfo.sizes || sizes,
      compound: manifestInfo.compound,
      section,
      interactive: manifestInfo.interactive,
      triggerComponent: manifestInfo.triggerComponent,
    });
  }
}

// Group components by section
const componentsBySection: Record<string, ComponentInfo[]> = {};
for (const comp of components) {
  if (!componentsBySection[comp.section]) {
    componentsBySection[comp.section] = [];
  }
  componentsBySection[comp.section].push(comp);
}

// Generate JSX code
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateComponentJSX(comp: ComponentInfo): string {
  const kebabName = kebabCase(comp.name);
  const lines: string[] = [];

  // Variants section
  if (comp.variants && comp.variants.length > 0) {
    const subsectionId = `${kebabName}-variants`;
    lines.push(`      <Section title="${comp.name} Variants" variant="h4" subsectionId="${subsectionId}">`);
    lines.push(`        <Row props='variant="${comp.variants.join('" | "')}"'>`);
    
    for (const variant of comp.variants) {
      const variantProp = variant !== 'default' ? ` variant="${variant}"` : '';
      const dataVariant = variant !== 'default' ? ` data-edit-variant="${variant}"` : '';
      lines.push(`          <${comp.name}${variantProp} data-edit-scope="component-definition" data-component="${comp.name}"${dataVariant}>${capitalize(variant)}</${comp.name}>`);
    }
    
    lines.push(`        </Row>`);
    lines.push(`      </Section>`);
    lines.push(``);
  }

  // Sizes section
  if (comp.sizes && comp.sizes.length > 0) {
    const subsectionId = `${kebabName}-sizes`;
    lines.push(`      <Section title="${comp.name} Sizes" variant="h4" subsectionId="${subsectionId}">`);
    lines.push(`        <Row props='size="${comp.sizes.join('" | "')}"'>`);
    
    for (const size of comp.sizes) {
      const sizeProp = size !== 'md' ? ` size="${size}"` : '';
      lines.push(`          <${comp.name}${sizeProp} data-edit-scope="component-definition" data-component="${comp.name}">${capitalize(size)}</${comp.name}>`);
    }
    
    lines.push(`        </Row>`);
    lines.push(`      </Section>`);
    lines.push(``);
  }

  // Default/Simple section if no variants/sizes
  if ((!comp.variants || comp.variants.length === 0) && (!comp.sizes || comp.sizes.length === 0)) {
    const subsectionId = kebabName;
    lines.push(`      <Section title="${comp.name}" variant="h4" subsectionId="${subsectionId}">`);
    lines.push(`        <Row>`);
    lines.push(`          <${comp.name} data-edit-scope="component-definition" data-component="${comp.name}">${comp.name}</${comp.name}>`);
    lines.push(`        </Row>`);
    lines.push(`      </Section>`);
    lines.push(``);
  }

  return lines.join('\n');
}

function generateCompoundComponentJSX(comp: ComponentInfo): string {
  const kebabName = kebabCase(comp.name);
  const lines: string[] = [];

  if (comp.compound && comp.compound.length > 0) {
    const subsectionId = `${kebabName}-compound`;
    const compoundList = comp.compound.join(', ');
    lines.push(`      <Section title="${comp.name} with Sub-components" variant="h4" subsectionId="${subsectionId}">`);
    lines.push(`        <Row props='${compoundList}'>`);
    lines.push(`          <${comp.name} data-edit-scope="component-definition" data-component="${comp.name}">`);
    
    if (comp.name === 'Card') {
      lines.push(`            <CardHeader><h4>${comp.name} Header</h4></CardHeader>`);
      lines.push(`            <CardBody><p>This is the ${comp.name.toLowerCase()} body content.</p></CardBody>`);
      lines.push(`            <CardFooter className="flex justify-end gap-2">`);
      lines.push(`              <Button variant="ghost" size="md">Cancel</Button>`);
      lines.push(`              <Button variant="primary" size="md">Confirm</Button>`);
      lines.push(`            </CardFooter>`);
    } else if (comp.name === 'Table') {
      lines.push(`            <TableHeader>`);
      lines.push(`              <TableRow>`);
      lines.push(`                <TableHead>Name</TableHead>`);
      lines.push(`                <TableHead>Status</TableHead>`);
      lines.push(`                <TableHead>Role</TableHead>`);
      lines.push(`              </TableRow>`);
      lines.push(`            </TableHeader>`);
      lines.push(`            <TableBody>`);
      lines.push(`              <TableRow>`);
      lines.push(`                <TableCell>John Doe</TableCell>`);
      lines.push(`                <TableCell>Active</TableCell>`);
      lines.push(`                <TableCell>Admin</TableCell>`);
      lines.push(`              </TableRow>`);
      lines.push(`            </TableBody>`);
    } else if (comp.name === 'Dialog') {
      lines.push(`            <DialogTrigger asChild>`);
      lines.push(`              <Button variant="primary" size="md">Open Dialog</Button>`);
      lines.push(`            </DialogTrigger>`);
      lines.push(`            <DialogContent>`);
      lines.push(`              <DialogHeader>`);
      lines.push(`                <DialogTitle>Dialog Title</DialogTitle>`);
      lines.push(`                <DialogDescription>This is a description.</DialogDescription>`);
      lines.push(`              </DialogHeader>`);
      lines.push(`              <DialogBody>`);
      lines.push(`                <p>Dialog content goes here.</p>`);
      lines.push(`              </DialogBody>`);
      lines.push(`              <DialogFooter>`);
      lines.push(`                <DialogClose asChild>`);
      lines.push(`                  <Button variant="ghost" size="md">Cancel</Button>`);
      lines.push(`                </DialogClose>`);
      lines.push(`                <DialogClose asChild>`);
      lines.push(`                  <Button variant="primary" size="md">Confirm</Button>`);
      lines.push(`                </DialogClose>`);
      lines.push(`              </DialogFooter>`);
      lines.push(`            </DialogContent>`);
    } else if (comp.name === 'Sheet') {
      lines.push(`            <SheetTrigger asChild>`);
      lines.push(`              <Button variant="primary" size="md">Open Sheet</Button>`);
      lines.push(`            </SheetTrigger>`);
      lines.push(`            <SheetContent>`);
      lines.push(`              <SheetHeader>`);
      lines.push(`                <SheetTitle>Sheet Title</SheetTitle>`);
      lines.push(`                <SheetDescription>This is a description.</SheetDescription>`);
      lines.push(`              </SheetHeader>`);
      lines.push(`              <SheetBody>`);
      lines.push(`                <p>Sheet content goes here.</p>`);
      lines.push(`              </SheetBody>`);
      lines.push(`            </SheetContent>`);
    }
    
    lines.push(`          </${comp.name}>`);
    lines.push(`        </Row>`);
    lines.push(`      </Section>`);
    lines.push(``);
  }

  return lines.join('\n');
}

// Generate content functions for each section
function generateSectionContent(sectionName: string, sectionComponents: ComponentInfo[]): string {
  const capitalizedSection = capitalize(sectionName.replace(/-/g, ' '));
  const functionName = `${capitalizedSection.replace(/\s+/g, '')}Content`;
  
  const lines: string[] = [];
  lines.push(`function ${functionName}() {`);
  lines.push(`  return (`);
  lines.push(`    <div className="space-y-6">`);

  for (const comp of sectionComponents) {
    // Skip compound components in main listing, they get special treatment
    if (comp.compound && comp.compound.length > 0) {
      lines.push(generateCompoundComponentJSX(comp));
    } else {
      lines.push(generateComponentJSX(comp));
    }
  }

  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  return lines.join('\n');
}

// Generate imports
function generateImports(): string {
  const allComponentNames = components.map(c => c.name);
  const compoundComponents = components.filter(c => c.compound).flatMap(c => c.compound || []);
  const allExports = [...new Set([...allComponentNames, ...compoundComponents])].sort();

  const mainImports: string[] = [];
  const dialogImports: string[] = [];
  const dropdownImports: string[] = [];
  const popoverImports: string[] = [];
  const sheetImports: string[] = [];

  for (const name of allExports) {
    if (name.startsWith('Dialog')) {
      if (!dialogImports.includes(name)) dialogImports.push(name);
    } else if (name.startsWith('DropdownMenu')) {
      if (!dropdownImports.includes(name)) dropdownImports.push(name);
    } else if (name.startsWith('Popover')) {
      if (!popoverImports.includes(name)) popoverImports.push(name);
    } else if (name.startsWith('Sheet')) {
      if (!sheetImports.includes(name)) sheetImports.push(name);
    } else {
      if (!mainImports.includes(name)) mainImports.push(name);
    }
  }

  const lines: string[] = [];
  lines.push(`'use client';`);
  lines.push(``);
  lines.push(`import React, { useState } from 'react';`);
  lines.push(`import {`);
  lines.push(`  ${mainImports.join(',\n  ')}`);
  lines.push(`} from '@radflow/ui';`);

  if (dialogImports.length > 0) {
    lines.push(`import {`);
    lines.push(`  ${dialogImports.join(',\n  ')}`);
    lines.push(`} from '@radflow/ui/Dialog';`);
  }

  if (dropdownImports.length > 0) {
    lines.push(`import {`);
    lines.push(`  ${dropdownImports.join(',\n  ')}`);
    lines.push(`} from '@radflow/ui/DropdownMenu';`);
  }

  if (popoverImports.length > 0) {
    lines.push(`import {`);
    lines.push(`  ${popoverImports.join(',\n  ')}`);
    lines.push(`} from '@radflow/ui/Popover';`);
  }

  if (sheetImports.length > 0) {
    lines.push(`import {`);
    lines.push(`  ${sheetImports.join(',\n  ')}`);
    lines.push(`} from '@radflow/ui/Sheet';`);
  }

  lines.push(``);

  return lines.join('\n');
}

// Generate the full UITab.tsx file
function generateUITab(): string {
  const lines: string[] = [];

  lines.push(generateImports());

  // Add helper components (Section, Row, PropsDisplay)
  lines.push(`// ============================================================================`);
  lines.push(`// Section Component`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`function Section({`);
  lines.push(`  title,`);
  lines.push(`  children,`);
  lines.push(`  variant = 'h3',`);
  lines.push(`  subsectionId,`);
  lines.push(`  className,`);
  lines.push(`  'data-edit-scope': editScope,`);
  lines.push(`  'data-component': component,`);
  lines.push(`  ...rest`);
  lines.push(`}: {`);
  lines.push(`  title: string;`);
  lines.push(`  children: React.ReactNode;`);
  lines.push(`  variant?: 'h3' | 'h4';`);
  lines.push(`  subsectionId?: string;`);
  lines.push(`  className?: string;`);
  lines.push(`  'data-edit-scope'?: string;`);
  lines.push(`  'data-component'?: string;`);
  lines.push(`}) {`);
  lines.push(`  const HeadingTag = variant === 'h4' ? 'h4' : 'h3';`);
  lines.push(`  const hasMarginOverride = className?.includes('mb-');`);
  lines.push(`  const isSubsection = variant === 'h4';`);
  lines.push(`  const subsectionClasses = isSubsection ? 'p-4 border border-black bg-[var(--color-cream)]' : '';`);
  lines.push(`  const baseClasses = \`\${hasMarginOverride ? '' : 'mb-4'} \${subsectionClasses} rounded flex flex-col gap-4\`.trim();`);
  lines.push(`  return (`);
  lines.push(`    <div`);
  lines.push(`      className={\`\${baseClasses} \${className || ''}\`}`);
  lines.push(`      data-subsection-id={subsectionId}`);
  lines.push(`      data-edit-scope={editScope}`);
  lines.push(`      data-component={component}`);
  lines.push(`      {...rest}`);
  lines.push(`    >`);
  lines.push(`      <HeadingTag>{title}</HeadingTag>`);
  lines.push(`      <div className="flex flex-col gap-4">{children}</div>`);
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`function PropsDisplay({ props }: { props: string }) {`);
  lines.push(`  return (`);
  lines.push(`    <code className="bg-black/5 px-2 py-1 rounded-sm block mt-2">{props}</code>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`function Row({ children, props }: { children: React.ReactNode; props?: string }) {`);
  lines.push(`  return (`);
  lines.push(`    <div>`);
  lines.push(`      <div className="flex flex-wrap items-center gap-2">{children}</div>`);
  lines.push(`      {props && <PropsDisplay props={props} />}`);
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  // Generate content functions
  const sectionOrder = ['buttons', 'cards', 'forms', 'feedback', 'data-display', 'navigation', 'overlays'];
  for (const section of sectionOrder) {
    if (componentsBySection[section]) {
      lines.push(generateSectionContent(section, componentsBySection[section]));
    }
  }

  // Generate COMPONENT_SECTIONS
  lines.push(`// ============================================================================`);
  lines.push(`// Component Sections`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`const COMPONENT_SECTIONS = [`);

  for (const section of sectionOrder) {
    if (componentsBySection[section]) {
      const capitalizedSection = capitalize(section.replace(/-/g, ' '));
      const functionName = `${capitalizedSection.replace(/\s+/g, '')}Content`;
      lines.push(`  { id: '${section}', title: '${capitalizedSection}', content: <${functionName} /> },`);
    }
  }

  lines.push(`];`);
  lines.push(``);

  // Generate main component
  lines.push(`interface UITabProps {`);
  lines.push(`  searchQuery?: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function UITab({ searchQuery: propSearchQuery = '' }: UITabProps) {`);
  lines.push(`  const searchQuery = propSearchQuery;`);
  lines.push(``);
  lines.push(`  // Filter sections based on search query`);
  lines.push(`  const filteredSections = searchQuery`);
  lines.push(`    ? COMPONENT_SECTIONS.filter((section) =>`);
  lines.push(`        section.title.toLowerCase().includes(searchQuery.toLowerCase())`);
  lines.push(`      )`);
  lines.push(`    : COMPONENT_SECTIONS;`);
  lines.push(``);
  lines.push(`  return (`);
  lines.push(`    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded">`);
  lines.push(`      <div className="space-y-0">`);
  lines.push(`        {filteredSections.length > 0 ? (`);
  lines.push(`          filteredSections.map((section) => (`);
  lines.push(`            <div key={section.id} className="mb-6">`);
  lines.push(`              <Section title={section.title}>{section.content}</Section>`);
  lines.push(`            </div>`);
  lines.push(`          ))`);
  lines.push(`        ) : (`);
  lines.push(`          <div className="text-center py-8 text-black/60 font-mondwest text-base">`);
  lines.push(`            No components match "{searchQuery}"`);
  lines.push(`          </div>`);
  lines.push(`        )}`);
  lines.push(`      </div>`);
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export default UITab;`);

  return lines.join('\n');
}

// Generate search index
function generateSearchIndex(): string {
  const lines: string[] = [];
  lines.push(`import type { SearchableItem } from './DesignSystemTab';`);
  lines.push(``);
  lines.push(`export const UI_SEARCH_INDEX: SearchableItem[] = [`);

  const sectionOrder = ['buttons', 'cards', 'forms', 'feedback', 'data-display', 'navigation', 'overlays'];
  
  for (const section of sectionOrder) {
    if (!componentsBySection[section]) continue;
    
    const capitalizedSection = capitalize(section.replace(/-/g, ' '));
    lines.push(`  // ${capitalizedSection} section`);
    lines.push(`  { text: '${capitalizedSection}', sectionId: '${section}', type: 'section' },`);

    for (const comp of componentsBySection[section]) {
      const kebabName = kebabCase(comp.name);
      
      // Add component name
      lines.push(`  { text: '${comp.name}', sectionId: '${section}', type: 'button' },`);

      // Add variant subsections
      if (comp.variants && comp.variants.length > 0) {
        lines.push(`  { text: '${comp.name} Variants', sectionId: '${section}', subsectionTitle: '${comp.name} Variants', type: 'subsection' },`);
        for (const variant of comp.variants) {
          lines.push(`  { text: '${capitalize(variant)}', sectionId: '${section}', type: 'button' },`);
        }
      }

      // Add size subsections
      if (comp.sizes && comp.sizes.length > 0) {
        lines.push(`  { text: '${comp.name} Sizes', sectionId: '${section}', subsectionTitle: '${comp.name} Sizes', type: 'subsection' },`);
        for (const size of comp.sizes) {
          lines.push(`  { text: '${capitalize(size)}', sectionId: '${section}', type: 'button' },`);
        }
      }

      // Add compound subsection
      if (comp.compound && comp.compound.length > 0) {
        lines.push(`  { text: '${comp.name} with Sub-components', sectionId: '${section}', subsectionTitle: '${comp.name} with Sub-components', type: 'subsection' },`);
      }
    }
    
    lines.push(``);
  }

  lines.push(`];`);

  return lines.join('\n');
}

// Write files
const uiTabContent = generateUITab();
const searchIndexContent = generateSearchIndex();

writeFileSync(join(OUTPUT_DIR, 'UITab.tsx'), uiTabContent);
writeFileSync(join(OUTPUT_DIR, 'UITabSearchIndex.ts'), searchIndexContent);

console.log('✓ Generated UITab.tsx');
console.log('✓ Generated UITabSearchIndex.ts');
console.log(`\nFound ${components.length} components across ${Object.keys(componentsBySection).length} sections`);
