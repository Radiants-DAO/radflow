'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  BadgeGroup,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Divider,
  HelpPanel,
  Input,
  Label,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  TabContent,
  TabList,
  TabTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TextArea,
  ToastProvider,
  Tooltip
} from '@radflow/ui';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@radflow/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@radflow/ui/DropdownMenu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@radflow/ui/Popover';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@radflow/ui/Sheet';

// ============================================================================
// Section Component
// ============================================================================

function Section({
  title,
  children,
  variant = 'h3',
  subsectionId,
  className,
  'data-edit-scope': editScope,
  'data-component': component,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'h3' | 'h4';
  subsectionId?: string;
  className?: string;
  'data-edit-scope'?: string;
  'data-component'?: string;
}) {
  const HeadingTag = variant === 'h4' ? 'h4' : 'h3';
  const hasMarginOverride = className?.includes('mb-');
  const isSubsection = variant === 'h4';
  const subsectionClasses = isSubsection ? 'p-4 border border-edge-primary bg-surface-secondary preview-light' : '';
  const baseClasses = `${hasMarginOverride ? '' : 'mb-4'} ${subsectionClasses} rounded flex flex-col gap-4`.trim();
  return (
    <div
      className={`${baseClasses} ${className || ''}`}
      data-subsection-id={subsectionId}
      data-edit-scope={editScope}
      data-component={component}
      {...rest}
    >
      <HeadingTag>{title}</HeadingTag>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="bg-content-primary/5 px-2 py-1 rounded-sm block mt-2">{props}</code>
  );
}

function Row({ children, props }: { children: React.ReactNode; props?: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}

function ButtonsContent() {
  return (
    <div className="space-y-6">
      <Section title="Button Variants" variant="h4" subsectionId="button-variants">
        <Row props='variant="primary" | "secondary" | "outline" | "ghost"'>
          <Button variant="primary" data-edit-scope="component-definition" data-component="Button" data-edit-variant="primary">Primary</Button>
          <Button variant="secondary" data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Secondary</Button>
          <Button variant="outline" data-edit-scope="component-definition" data-component="Button" data-edit-variant="outline">Outline</Button>
          <Button variant="ghost" data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">Ghost</Button>
        </Row>
      </Section>

      <Section title="Button Sizes" variant="h4" subsectionId="button-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Button size="sm" data-edit-scope="component-definition" data-component="Button">Sm</Button>
          <Button data-edit-scope="component-definition" data-component="Button">Md</Button>
          <Button size="lg" data-edit-scope="component-definition" data-component="Button">Lg</Button>
        </Row>
      </Section>

    </div>
  );
}

function CardsContent() {
  return (
    <div className="space-y-6">
      <Section title="Card with Sub-components" variant="h4" subsectionId="card-compound">
        <Row props='CardHeader, CardBody, CardFooter'>
          <Card data-edit-scope="component-definition" data-component="Card">
            <CardHeader><h4>Card Header</h4></CardHeader>
            <CardBody><p>This is the card body content.</p></CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="md">Cancel</Button>
              <Button variant="primary" size="md">Confirm</Button>
            </CardFooter>
          </Card>
        </Row>
      </Section>

    </div>
  );
}

function FormsContent() {
  return (
    <div className="space-y-6">
      {/* Input: Requires manual curation - see DesignSystemTab for reference */}
      {/* TextArea: Requires manual curation - see DesignSystemTab for reference */}
      {/* Label: Requires manual curation - see DesignSystemTab for reference */}
      {/* Select: Requires manual curation - see DesignSystemTab for reference */}
      {/* Checkbox: Requires manual curation - see DesignSystemTab for reference */}
      {/* Radio: Requires manual curation - see DesignSystemTab for reference */}
      {/* RadioGroup: Requires manual curation - see DesignSystemTab for reference */}
      {/* Switch: Requires manual curation - see DesignSystemTab for reference */}
      {/* Slider: Requires manual curation - see DesignSystemTab for reference */}
    </div>
  );
}

function FeedbackContent() {
  return (
    <div className="space-y-6">
      <Section title="Badge Variants" variant="h4" subsectionId="badge-variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info"'>
          <Badge data-edit-scope="component-definition" data-component="Badge">Default</Badge>
          <Badge variant="success" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="success">Success</Badge>
          <Badge variant="warning" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="warning">Warning</Badge>
          <Badge variant="error" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="error">Error</Badge>
          <Badge variant="info" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="info">Info</Badge>
        </Row>
      </Section>

      <Section title="Badge Sizes" variant="h4" subsectionId="badge-sizes">
        <Row props='size="sm" | "md"'>
          <Badge size="sm" data-edit-scope="component-definition" data-component="Badge">Sm</Badge>
          <Badge data-edit-scope="component-definition" data-component="Badge">Md</Badge>
        </Row>
      </Section>

      {/* Progress: Requires manual curation - see DesignSystemTab for reference */}
      {/* Spinner: Requires manual curation - see DesignSystemTab for reference */}
      {/* Skeleton: Requires manual curation - see DesignSystemTab for reference */}
      {/* Tooltip: Requires manual curation - see DesignSystemTab for reference */}
      <Section title="Alert Variants" variant="h4" subsectionId="alert-variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info"'>
          <Alert data-edit-scope="component-definition" data-component="Alert">Default</Alert>
          <Alert variant="success" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="success">Success</Alert>
          <Alert variant="warning" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="warning">Warning</Alert>
          <Alert variant="error" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="error">Error</Alert>
          <Alert variant="info" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="info">Info</Alert>
        </Row>
      </Section>

      {/* ToastProvider: Requires manual curation - see DesignSystemTab for reference */}
    </div>
  );
}

function DatadisplayContent() {
  return (
    <div className="space-y-6">
      {/* Avatar: Requires manual curation - see DesignSystemTab for reference */}
      <Section title="Table with Sub-components" variant="h4" subsectionId="table-compound">
        <Row props='TableHeader, TableBody, TableRow, TableHead, TableCell'>
          <Table data-edit-scope="component-definition" data-component="Table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Row>
      </Section>

    </div>
  );
}

function NavigationContent() {
  return (
    <div className="space-y-6">
      <Section title="Tabs with Sub-components" variant="h4" subsectionId="tabs-compound">
        <Row props='TabList, TabTrigger, TabContent'>
          <Tabs data-edit-scope="component-definition" data-component="Tabs">
          </Tabs>
        </Row>
      </Section>

      {/* Divider: Requires manual curation - see DesignSystemTab for reference */}
      <Section title="Accordion with Sub-components" variant="h4" subsectionId="accordion-compound">
        <Row props='AccordionItem, AccordionTrigger, AccordionContent'>
          <Accordion data-edit-scope="component-definition" data-component="Accordion">
          </Accordion>
        </Row>
      </Section>

      {/* Breadcrumbs: Requires manual curation - see DesignSystemTab for reference */}
    </div>
  );
}

function OverlaysContent() {
  return (
    <div className="space-y-6">
      <Section title="Dialog with Sub-components" variant="h4" subsectionId="dialog-compound">
        <Row props='DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose'>
          <Dialog data-edit-scope="component-definition" data-component="Dialog">
            <DialogTrigger asChild>
              <Button variant="primary" size="md">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a description.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Dialog content goes here.</p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="md">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="primary" size="md">Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      <Section title="Sheet with Sub-components" variant="h4" subsectionId="sheet-compound">
        <Row props='SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose'>
          <Sheet data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="primary" size="md">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>This is a description.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Sheet content goes here.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      <Section title="Popover with Sub-components" variant="h4" subsectionId="popover-compound">
        <Row props='PopoverTrigger, PopoverContent'>
          <Popover data-edit-scope="component-definition" data-component="Popover">
          </Popover>
        </Row>
      </Section>

      <Section title="DropdownMenu with Sub-components" variant="h4" subsectionId="dropdown-menu-compound">
        <Row props='DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel'>
          <DropdownMenu data-edit-scope="component-definition" data-component="DropdownMenu">
          </DropdownMenu>
        </Row>
      </Section>

      <Section title="ContextMenu with Sub-components" variant="h4" subsectionId="context-menu-compound">
        <Row props='ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator'>
          <ContextMenu data-edit-scope="component-definition" data-component="ContextMenu">
          </ContextMenu>
        </Row>
      </Section>

      <Section title="HelpPanel" variant="h4" subsectionId="help-panel">
        <Row>
          <HelpPanel data-edit-scope="component-definition" data-component="HelpPanel">HelpPanel</HelpPanel>
        </Row>
      </Section>

    </div>
  );
}

// ============================================================================
// Component Sections
// ============================================================================

const COMPONENT_SECTIONS = [
  { id: 'buttons', title: 'Buttons', content: <ButtonsContent /> },
  { id: 'cards', title: 'Cards', content: <CardsContent /> },
  { id: 'forms', title: 'Forms', content: <FormsContent /> },
  { id: 'feedback', title: 'Feedback', content: <FeedbackContent /> },
  { id: 'data-display', title: 'Data display', content: <DatadisplayContent /> },
  { id: 'navigation', title: 'Navigation', content: <NavigationContent /> },
  { id: 'overlays', title: 'Overlays', content: <OverlaysContent /> },
];

interface UITabProps {
  searchQuery?: string;
}

export function UITab({ searchQuery: propSearchQuery = '' }: UITabProps) {
  const searchQuery = propSearchQuery;

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? COMPONENT_SECTIONS.filter((section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMPONENT_SECTIONS;

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-surface-primary border border-edge-primary rounded">
      <div className="space-y-0">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-6">
              <Section title={section.title}>{section.content}</Section>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-content-primary/60 font-mondwest text-base">
            No components match "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

export default UITab;