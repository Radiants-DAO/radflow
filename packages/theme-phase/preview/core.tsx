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
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Divider,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HelpPanel,
  Input,
  Label,
  NumberField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  Tooltip,
  useToast
} from '../components/core';

// ============================================================================
// Phase Theme Colors (for reference in styling)
// ============================================================================
// Background: #14141e
// Text: #f3eed9 (cream)
// Border: rgba(243,238,217,0.2)
// Muted text: rgba(243,238,217,0.5) - rgba(243,238,217,0.8)

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
  const subsectionClasses = isSubsection ? 'p-4 border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)]' : '';
  const baseClasses = `${hasMarginOverride ? '' : 'mb-4'} ${subsectionClasses} rounded flex flex-col gap-4`.trim();
  return (
    <div
      className={`${baseClasses} ${className || ''}`}
      data-subsection-id={subsectionId}
      data-edit-scope={editScope}
      data-component={component}
      {...rest}
    >
      <HeadingTag className="font-audiowide text-content-primary">{title}</HeadingTag>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="text-[var(--color-content-tertiary)] text-xs font-kodemono">{props}</code>
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

// ============================================================================
// Button Interactive Demos
// ============================================================================

function LoadingButtonDemo() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleClick1 = () => {
    setLoading1(true);
    setTimeout(() => setLoading1(false), 2000);
  };

  const handleClick2 = () => {
    setLoading2(true);
    setTimeout(() => setLoading2(false), 2000);
  };

  const handleClick3 = () => {
    setLoading3(true);
    setTimeout(() => setLoading3(false), 2000);
  };

  return (
    <>
      <Button
        variant="purple"
        size="md"
        iconOnly={true}
        iconName="refresh"
        loading={loading1}
        onClick={handleClick1}
        data-edit-scope="component-definition"
        data-component="Button"
        data-edit-variant="purple"
      >
        {''}
      </Button>
      <Button
        variant="blue"
        size="md"
        iconOnly={true}
        iconName="download"
        loading={loading2}
        onClick={handleClick2}
        data-edit-scope="component-definition"
        data-component="Button"
        data-edit-variant="blue"
      >
        {''}
      </Button>
      <Button
        variant="default"
        size="md"
        iconName="copy"
        loading={loading3}
        onClick={handleClick3}
        data-edit-scope="component-definition"
        data-component="Button"
      >
        Copy
      </Button>
    </>
  );
}

function CopyButtonDemo() {
  const handleCopy = async () => {
    await navigator.clipboard.writeText('Copied text example!');
  };

  return (
    <>
      <Button
        variant="purple"
        size="md"
        copyButton={true}
        onCopy={handleCopy}
        data-edit-scope="component-definition"
        data-component="Button"
        data-edit-variant="purple"
      >
        Copy Text
      </Button>
      <Button
        variant="default"
        size="md"
        copyButton={true}
        onCopy={handleCopy}
        data-edit-scope="component-definition"
        data-component="Button"
      >
        Copy Code
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconOnly={true}
        copyButton={true}
        onCopy={handleCopy}
        data-edit-scope="component-definition"
        data-component="Button"
        data-edit-variant="ghost"
      >
        {''}
      </Button>
    </>
  );
}

// ============================================================================
// Button Content
// ============================================================================

function ButtonsContent() {
  return (
    <div className="space-y-6">
      {/* Full Width Buttons with Icons (Figma Style) */}
      <Section title="Button Variants (Full Width with Icon)" variant="h4" subsectionId="button-variants-figma" className="mb-4">
        <Row props='variant="default" fullWidth iconName="arrow-right"'>
          <div className="w-96">
            <Button variant="default" size="md" fullWidth iconName="arrow-right" data-edit-scope="component-definition" data-component="Button">Default Button</Button>
          </div>
        </Row>
        <Row props='variant="blue" fullWidth iconName="arrow-right"'>
          <div className="w-96">
            <Button variant="blue" size="md" fullWidth iconName="arrow-right" data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">Blue Button</Button>
          </div>
        </Row>
        <Row props='variant="purple" fullWidth iconName="arrow-right"'>
          <div className="w-96">
            <Button variant="purple" size="md" fullWidth iconName="arrow-right" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Purple Button</Button>
          </div>
        </Row>
        <Row props='variant="green" fullWidth iconName="arrow-right"'>
          <div className="w-96">
            <Button variant="green" size="md" fullWidth iconName="arrow-right" data-edit-scope="component-definition" data-component="Button" data-edit-variant="green">Green Button</Button>
          </div>
        </Row>
        <Row props='variant="purple" disabled'>
          <div className="w-[537px]">
            <Button variant="purple" size="md" fullWidth disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Disabled</Button>
          </div>
        </Row>
      </Section>

      {/* Text Button Variant */}
      <Section title="Text Button" variant="h4" subsectionId="button-text" className="mb-4">
        <Row props='variant="text" iconName="arrow-right"'>
          <Button variant="text" size="md" iconName="arrow-right" data-edit-scope="component-definition" data-component="Button" data-edit-variant="text">Text Button!!!</Button>
        </Row>
      </Section>

      {/* Classic Variants */}
      <Section title="Button Variants (Inline)" variant="h4" subsectionId="button-variants" className="mb-4">
        <Row props='variant="default" | "blue" | "purple" | "green" | "gold" | "ghost"'>
          <Button variant="default" size="md" data-edit-scope="component-definition" data-component="Button">Default</Button>
          <Button variant="default" size="md" disabled data-edit-scope="component-definition" data-component="Button">Disabled</Button>
        </Row>
        <Row props='variant="blue"'>
          <Button variant="blue" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">Blue</Button>
          <Button variant="blue" size="md" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">Disabled</Button>
        </Row>
        <Row props='variant="purple"'>
          <Button variant="purple" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Purple</Button>
          <Button variant="purple" size="md" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Disabled</Button>
        </Row>
        <Row props='variant="green"'>
          <Button variant="green" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="green">Green</Button>
          <Button variant="green" size="md" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="green">Disabled</Button>
        </Row>
        <Row props='variant="gold"'>
          <Button variant="gold" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="gold">Gold</Button>
          <Button variant="gold" size="md" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="gold">Disabled</Button>
        </Row>
        <Row props='variant="ghost"'>
          <Button variant="ghost" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">Ghost</Button>
          <Button variant="ghost" size="md" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">Disabled</Button>
        </Row>
      </Section>

      {/* Sizes */}
      <Section title="Button Sizes" variant="h4" subsectionId="button-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Button variant="purple" size="sm" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Small</Button>
        </Row>
        <Row props='size="md"'>
          <Button variant="purple" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Medium</Button>
        </Row>
        <Row props='size="lg"'>
          <Button variant="purple" size="lg" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Large</Button>
        </Row>
      </Section>

      {/* With Icons */}
      <Section title="Button with Icon" variant="h4" subsectionId="button-with-icon">
        <Row props='iconName="..."'>
          <Button variant="purple" size="md" iconName="download" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">
            Download
          </Button>
          <Button variant="blue" size="md" iconName="copy" data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">
            Copy
          </Button>
          <Button variant="default" size="md" iconName="settings" data-edit-scope="component-definition" data-component="Button">
            Settings
          </Button>
        </Row>
        <Row props='iconOnly={true} iconName="..."'>
          <Button variant="purple" size="sm" iconOnly={true} iconName="close" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">{''}</Button>
          <Button variant="purple" size="md" iconOnly={true} iconName="copy" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">{''}</Button>
          <Button variant="purple" size="lg" iconOnly={true} iconName="settings" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">{''}</Button>
        </Row>
        <Row props='Icon-only variants'>
          <Button variant="default" size="md" iconOnly={true} iconName="add" data-edit-scope="component-definition" data-component="Button">{''}</Button>
          <Button variant="blue" size="md" iconOnly={true} iconName="edit" data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">{''}</Button>
          <Button variant="green" size="md" iconOnly={true} iconName="check" data-edit-scope="component-definition" data-component="Button" data-edit-variant="green">{''}</Button>
          <Button variant="ghost" size="md" iconOnly={true} iconName="close" data-edit-scope="component-definition" data-component="Button" data-edit-variant="ghost">{''}</Button>
        </Row>
      </Section>

      {/* Loading State */}
      <Section title="Loading State" variant="h4" subsectionId="button-loading">
        <Row props='loading={boolean} (click to toggle - only applies to buttons with icons)'>
          <LoadingButtonDemo />
        </Row>
      </Section>

      {/* Copy Button */}
      <Section title="Copy Button" variant="h4" subsectionId="button-copy">
        <Row props='copyButton={true} onCopy={fn} (click to see feedback)'>
          <CopyButtonDemo />
        </Row>
      </Section>

      {/* Full Width */}
      <Section title="Full Width" variant="h4" subsectionId="button-full-width">
        <Row props='fullWidth={true}'>
          <div className="w-64">
            <Button variant="purple" size="md" fullWidth={true} data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">Full Width Button</Button>
          </div>
        </Row>
        <Row props='fullWidth={true} iconName="..."'>
          <div className="w-64">
            <Button variant="blue" size="md" fullWidth={true} iconName="arrow-right" data-edit-scope="component-definition" data-component="Button" data-edit-variant="blue">Continue</Button>
          </div>
        </Row>
      </Section>

      {/* Polymorphic (as prop) */}
      <Section title="Polymorphic Rendering" variant="h4" subsectionId="button-polymorphic">
        <Row props='as="a" href="..."'>
          <Button as="a" href="#" variant="purple" size="md" data-edit-scope="component-definition" data-component="Button" data-edit-variant="purple">
            Link Button
          </Button>
          <Button as="a" href="#" variant="default" size="md" iconName="external" data-edit-scope="component-definition" data-component="Button">
            External Link
          </Button>
        </Row>
      </Section>
    </div>
  );
}

function CardsContent() {
  return (
    <div className="space-y-6">
      {/* Card Variants */}
      <Section title="Card Variants" variant="h4" subsectionId="card-variants">
        <Row props='variant="default" | "dark" | "raised"'>
          <div className="flex gap-4 flex-wrap">
            <Card className="w-48" data-edit-scope="component-definition" data-component="Card">
              <p className="text-[var(--color-content-medium)]">Default card with glass effect.</p>
            </Card>
            <Card variant="dark" className="w-48" data-edit-scope="component-definition" data-component="Card" data-edit-variant="dark">
              <p className="text-[var(--color-content-medium)]">Dark card with inverted colors.</p>
            </Card>
            <Card variant="raised" className="w-48" data-edit-scope="component-definition" data-component="Card" data-edit-variant="raised">
              <p className="text-[var(--color-content-medium)]">Raised card with shadow.</p>
            </Card>
          </div>
        </Row>
      </Section>

      {/* Card with Sub-components */}
      <Section title="Card with Sub-components" variant="h4" subsectionId="card-compound">
        <Row props='CardHeader, CardBody, CardFooter'>
          <Card noPadding className="w-80" data-edit-scope="component-definition" data-component="Card">
            <CardHeader><h4 className="font-audiowide text-content-primary">Card Header</h4></CardHeader>
            <CardBody><p className="text-[var(--color-content-soft)]">This is the card body content with some example text.</p></CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="md">Cancel</Button>
              <Button variant="purple" size="md">Confirm</Button>
            </CardFooter>
          </Card>
        </Row>
      </Section>

      {/* Card noPadding */}
      <Section title="Card without Padding" variant="h4" subsectionId="card-no-padding">
        <Row props='noPadding={true}'>
          <Card noPadding className="w-64" data-edit-scope="component-definition" data-component="Card">
            <div className="p-4 border-b border-[var(--glass-border-subtle)]">Custom header area</div>
            <div className="p-4">Custom content with manual padding</div>
          </Card>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Forms Interactive Demos
// ============================================================================

function SelectDemo() {
  const [value, setValue] = useState('');
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry', disabled: true },
    { value: 'date', label: 'Date' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select a fruit..."
      data-edit-scope="component-definition"
      data-component="Select"
    />
  );
}

function SelectGroupedDemo() {
  const [value, setValue] = useState('');
  const options = [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
      ],
    },
  ] as const;

  return (
    <Select
      options={options as unknown as Array<{ value: string; label: string }>}
      value={value}
      onChange={setValue}
      placeholder="Select food..."
      data-edit-scope="component-definition"
      data-component="Select"
    />
  );
}

function CheckboxDemo() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <>
      <Checkbox
        label="Unchecked"
        checked={checked1}
        onChange={(e) => setChecked1(e.target.checked)}
        data-edit-scope="component-definition"
        data-component="Checkbox"
      />
      <Checkbox
        label="Checked"
        checked={checked2}
        onChange={(e) => setChecked2(e.target.checked)}
        data-edit-scope="component-definition"
        data-component="Checkbox"
      />
      <Checkbox
        label="Disabled"
        disabled
        data-edit-scope="component-definition"
        data-component="Checkbox"
      />
    </>
  );
}

function RadioGroupDemo() {
  const [value, setValue] = useState('option1');

  return (
    <RadioGroup
      name="demo-radio"
      value={value}
      onChange={setValue}
      orientation="vertical"
      data-edit-scope="component-definition"
      data-component="RadioGroup"
    >
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" disabled />
    </RadioGroup>
  );
}

function RadioGroupHorizontalDemo() {
  const [value, setValue] = useState('a');

  return (
    <RadioGroup
      name="demo-radio-h"
      value={value}
      onChange={setValue}
      orientation="horizontal"
      data-edit-scope="component-definition"
      data-component="RadioGroup"
    >
      <Radio value="a" label="A" />
      <Radio value="b" label="B" />
      <Radio value="c" label="C" />
    </RadioGroup>
  );
}

function SwitchDemo() {
  const [on1, setOn1] = useState(false);
  const [on2, setOn2] = useState(true);

  return (
    <>
      <Switch
        checked={on1}
        onChange={setOn1}
        label="Off"
        data-edit-scope="component-definition"
        data-component="Switch"
      />
      <Switch
        checked={on2}
        onChange={setOn2}
        label="On"
        data-edit-scope="component-definition"
        data-component="Switch"
      />
      <Switch
        checked={false}
        onChange={() => {}}
        label="Disabled"
        disabled
        data-edit-scope="component-definition"
        data-component="Switch"
      />
    </>
  );
}

function SliderDemo() {
  const [value, setValue] = useState(50);

  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      showValue
      label="Volume"
      data-edit-scope="component-definition"
      data-component="Slider"
    />
  );
}

// ============================================================================
// Forms Content
// ============================================================================

function FormsContent() {
  return (
    <div className="space-y-6">
      {/* Input */}
      <Section title="Input Sizes" variant="h4" subsectionId="input-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="w-64">
            <Input size="sm" placeholder="Small input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='size="md"'>
          <div className="w-64">
            <Input size="md" placeholder="Medium input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='size="lg"'>
          <div className="w-64">
            <Input size="lg" placeholder="Large input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
      </Section>

      <Section title="Input States" variant="h4" subsectionId="input-states">
        <Row props='error={true}'>
          <div className="w-64">
            <Label htmlFor="input-error" required>Error State</Label>
            <Input id="input-error" error placeholder="Invalid input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='disabled={true}'>
          <div className="w-64">
            <Label htmlFor="input-disabled">Disabled</Label>
            <Input id="input-disabled" disabled placeholder="Disabled input" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
      </Section>

      <Section title="Input with Icon" variant="h4" subsectionId="input-icon">
        <Row props='iconName="search"'>
          <div className="w-64">
            <Input iconName="search" placeholder="Search..." data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
        <Row props='iconName="email"'>
          <div className="w-64">
            <Input iconName="email" placeholder="Email address" data-edit-scope="component-definition" data-component="Input" />
          </div>
        </Row>
      </Section>

      {/* TextArea */}
      <Section title="TextArea" variant="h4" subsectionId="textarea">
        <Row props='placeholder, rows'>
          <div className="w-80">
            <Label htmlFor="textarea-default">Description</Label>
            <TextArea id="textarea-default" placeholder="Enter description..." rows={3} data-edit-scope="component-definition" data-component="TextArea" />
          </div>
        </Row>
        <Row props='error={true}'>
          <div className="w-80">
            <Label htmlFor="textarea-error" required>Error State</Label>
            <TextArea id="textarea-error" error placeholder="Invalid content" data-edit-scope="component-definition" data-component="TextArea" />
          </div>
        </Row>
        <Row props='iconName="pencil"'>
          <div className="w-80">
            <TextArea iconName="pencil" placeholder="With icon..." data-edit-scope="component-definition" data-component="TextArea" />
          </div>
        </Row>
      </Section>

      {/* Label */}
      <Section title="Label" variant="h4" subsectionId="label">
        <Row props='required={boolean}'>
          <Label data-edit-scope="component-definition" data-component="Label">Default Label</Label>
          <Label required data-edit-scope="component-definition" data-component="Label">Required Label</Label>
        </Row>
      </Section>

      {/* Select */}
      <Section title="Select" variant="h4" subsectionId="select">
        <Row props='options, value, onChange, placeholder'>
          <div className="w-64">
            <Label>Basic Select</Label>
            <SelectDemo />
          </div>
        </Row>
        <Row props='Grouped options'>
          <div className="w-64">
            <Label>Grouped Options</Label>
            <SelectGroupedDemo />
          </div>
        </Row>
        <Row props='error={true}'>
          <div className="w-64">
            <Label>Error State</Label>
            <Select
              options={[{ value: '1', label: 'Option 1' }]}
              error
              placeholder="Select..."
              data-edit-scope="component-definition"
              data-component="Select"
            />
          </div>
        </Row>
        <Row props='disabled={true}'>
          <div className="w-64">
            <Label>Disabled</Label>
            <Select
              options={[{ value: '1', label: 'Option 1' }]}
              disabled
              placeholder="Disabled"
              data-edit-scope="component-definition"
              data-component="Select"
            />
          </div>
        </Row>
      </Section>

      {/* Checkbox */}
      <Section title="Checkbox" variant="h4" subsectionId="checkbox">
        <Row props='label, checked, disabled'>
          <CheckboxDemo />
        </Row>
      </Section>

      {/* Radio & RadioGroup */}
      <Section title="RadioGroup" variant="h4" subsectionId="radiogroup">
        <Row props='orientation="vertical"'>
          <RadioGroupDemo />
        </Row>
        <Row props='orientation="horizontal"'>
          <RadioGroupHorizontalDemo />
        </Row>
      </Section>

      {/* Switch */}
      <Section title="Switch Sizes" variant="h4" subsectionId="switch-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Switch size="sm" checked={true} onChange={() => {}} label="Small" data-edit-scope="component-definition" data-component="Switch" />
          <Switch size="md" checked={true} onChange={() => {}} label="Medium" data-edit-scope="component-definition" data-component="Switch" />
          <Switch size="lg" checked={true} onChange={() => {}} label="Large" data-edit-scope="component-definition" data-component="Switch" />
        </Row>
      </Section>

      <Section title="Switch States" variant="h4" subsectionId="switch-states">
        <Row props='checked, disabled, labelPosition'>
          <SwitchDemo />
        </Row>
        <Row props='labelPosition="left"'>
          <Switch checked={true} onChange={() => {}} label="Label on left" labelPosition="left" data-edit-scope="component-definition" data-component="Switch" />
        </Row>
      </Section>

      {/* Slider */}
      <Section title="Slider Sizes" variant="h4" subsectionId="slider-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="w-64">
            <Slider value={30} onChange={() => {}} size="sm" data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='size="md"'>
          <div className="w-64">
            <Slider value={50} onChange={() => {}} size="md" data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='size="lg"'>
          <div className="w-64">
            <Slider value={70} onChange={() => {}} size="lg" data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
      </Section>

      <Section title="Slider with Label & Value" variant="h4" subsectionId="slider-label">
        <Row props='showValue={true} label="..."'>
          <div className="w-64">
            <SliderDemo />
          </div>
        </Row>
        <Row props='min, max, step'>
          <div className="w-64">
            <Slider value={5} onChange={() => {}} min={0} max={10} step={1} showValue label="Step: 1" data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
        <Row props='disabled={true}'>
          <div className="w-64">
            <Slider value={50} onChange={() => {}} disabled label="Disabled" data-edit-scope="component-definition" data-component="Slider" />
          </div>
        </Row>
      </Section>

      {/* Combobox */}
      <Section title="Combobox" variant="h4" subsectionId="combobox">
        <Row props='options, value, onChange, placeholder'>
          <div className="w-64">
            <ComboboxDemo />
          </div>
        </Row>
      </Section>

      <Section title="Combobox with Custom Value" variant="h4" subsectionId="combobox-custom">
        <Row props='allowCustomValue={true}'>
          <div className="w-64">
            <ComboboxCustomDemo />
          </div>
        </Row>
      </Section>

      <Section title="Combobox States" variant="h4" subsectionId="combobox-states">
        <Row props='error={true}, disabled={true}'>
          <div className="w-64">
            <Combobox
              options={[{ value: '1', label: 'Option 1' }]}
              error
              placeholder="Error state..."
              data-edit-scope="component-definition"
              data-component="Combobox"
            />
          </div>
          <div className="w-64">
            <Combobox
              options={[{ value: '1', label: 'Option 1' }]}
              disabled
              placeholder="Disabled..."
              data-edit-scope="component-definition"
              data-component="Combobox"
            />
          </div>
        </Row>
      </Section>

      {/* NumberField */}
      <Section title="NumberField" variant="h4" subsectionId="numberfield">
        <Row props='value, onChange, min, max, step'>
          <NumberFieldDemo />
        </Row>
      </Section>

      <Section title="NumberField Sizes" variant="h4" subsectionId="numberfield-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <NumberField defaultValue={10} size="sm" data-edit-scope="component-definition" data-component="NumberField" />
          <NumberField defaultValue={20} size="md" data-edit-scope="component-definition" data-component="NumberField" />
          <NumberField defaultValue={30} size="lg" data-edit-scope="component-definition" data-component="NumberField" />
        </Row>
      </Section>

      <Section title="NumberField States" variant="h4" subsectionId="numberfield-states">
        <Row props='error, disabled, showControls={false}'>
          <NumberField defaultValue={50} error data-edit-scope="component-definition" data-component="NumberField" />
          <NumberField defaultValue={50} disabled data-edit-scope="component-definition" data-component="NumberField" />
          <NumberField defaultValue={50} showControls={false} data-edit-scope="component-definition" data-component="NumberField" />
        </Row>
      </Section>

      <Section title="NumberField with Formatting" variant="h4" subsectionId="numberfield-format">
        <Row props='formatOptions (Intl.NumberFormat)'>
          <NumberField
            defaultValue={1234.56}
            formatOptions={{ style: 'currency', currency: 'USD' }}
            step={0.01}
            data-edit-scope="component-definition"
            data-component="NumberField"
          />
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Combobox & NumberField Demos
// ============================================================================

function ComboboxDemo() {
  const [value, setValue] = useState('');
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'SolidJS' },
  ];

  return (
    <Combobox
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Search frameworks..."
      data-edit-scope="component-definition"
      data-component="Combobox"
    />
  );
}

function ComboboxCustomDemo() {
  const [value, setValue] = useState('');
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  return (
    <Combobox
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Type or select fruit..."
      allowCustomValue
      emptyMessage="Press Enter to add custom value"
      data-edit-scope="component-definition"
      data-component="Combobox"
    />
  );
}

function NumberFieldDemo() {
  const [value, setValue] = useState(50);

  return (
    <NumberField
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      step={5}
      data-edit-scope="component-definition"
      data-component="NumberField"
    />
  );
}

// ============================================================================
// Feedback Interactive Demos
// ============================================================================

function ToastDemo() {
  const { addToast } = useToast();

  const showToast = (variant: 'default' | 'success' | 'warning' | 'error' | 'info') => {
    addToast({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: 'This is a toast notification message.',
      variant,
      duration: 3000,
    });
  };

  return (
    <>
      <Button variant="default" size="sm" onClick={() => showToast('default')}>Default</Button>
      <Button variant="green" size="sm" onClick={() => showToast('success')}>Success</Button>
      <Button variant="gold" size="sm" onClick={() => showToast('warning')}>Warning</Button>
      <Button variant="default" size="sm" onClick={() => showToast('error')}>Error</Button>
      <Button variant="blue" size="sm" onClick={() => showToast('info')}>Info</Button>
    </>
  );
}

function AlertClosableDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="purple" size="sm" onClick={() => setVisible(true)}>
        Show Alert
      </Button>
    );
  }

  return (
    <Alert
      variant="info"
      title="Closable Alert"
      closable
      onClose={() => setVisible(false)}
      data-edit-scope="component-definition"
      data-component="Alert"
    >
      Click the X to dismiss this alert.
    </Alert>
  );
}

function SpinnerDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Spinner size={24} completed={!loading} />
      <Button variant="purple" size="sm" onClick={() => setLoading(!loading)}>
        {loading ? 'Complete' : 'Reset'}
      </Button>
    </>
  );
}

// ============================================================================
// Feedback Content
// ============================================================================

function FeedbackContent() {
  return (
    <div className="space-y-6">
      {/* Badge */}
      <Section title="Badge Variants" variant="h4" subsectionId="badge-variants">
        <Row props='variant="default" | "outline" | "success" | "warning" | "error" | "info"'>
          <Badge data-edit-scope="component-definition" data-component="Badge">Default</Badge>
          <Badge variant="outline" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="outline">Outline</Badge>
          <Badge variant="success" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="success">Success</Badge>
          <Badge variant="warning" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="warning">Warning</Badge>
          <Badge variant="error" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="error">Error</Badge>
          <Badge variant="info" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="info">Info</Badge>
        </Row>
      </Section>

      <Section title="Badge Sizes" variant="h4" subsectionId="badge-sizes">
        <Row props='size="sm" | "md"'>
          <Badge size="sm" data-edit-scope="component-definition" data-component="Badge">Small</Badge>
          <Badge size="md" data-edit-scope="component-definition" data-component="Badge">Medium</Badge>
        </Row>
      </Section>

      <Section title="Badge with Icon & Click" variant="h4" subsectionId="badge-icon">
        <Row props='icon, onClick'>
          <Badge icon="⭐" data-edit-scope="component-definition" data-component="Badge">With Icon</Badge>
          <Badge icon="🔥" variant="warning" data-edit-scope="component-definition" data-component="Badge" data-edit-variant="warning">Hot</Badge>
          <Badge onClick={() => alert('Clicked!')} data-edit-scope="component-definition" data-component="Badge">Clickable</Badge>
          <Badge onClick={() => {}} disabled data-edit-scope="component-definition" data-component="Badge">Disabled</Badge>
        </Row>
      </Section>

      <Section title="BadgeGroup" variant="h4" subsectionId="badge-group">
        <Row props='gap="sm" | "md" wrap={boolean}'>
          <BadgeGroup gap="md">
            <Badge variant="success">React</Badge>
            <Badge variant="info">TypeScript</Badge>
            <Badge variant="warning">Tailwind</Badge>
            <Badge>Phase</Badge>
          </BadgeGroup>
        </Row>
      </Section>

      {/* Alert */}
      <Section title="Alert Variants" variant="h4" subsectionId="alert-variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info"'>
          <div className="w-full space-y-2">
            <Alert data-edit-scope="component-definition" data-component="Alert">Default alert message</Alert>
            <Alert variant="success" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="success">Success! Operation completed.</Alert>
            <Alert variant="warning" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="warning">Warning! Check your input.</Alert>
            <Alert variant="error" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="error">Error! Something went wrong.</Alert>
            <Alert variant="info" data-edit-scope="component-definition" data-component="Alert" data-edit-variant="info">Info: Here&apos;s some helpful information.</Alert>
          </div>
        </Row>
      </Section>

      <Section title="Alert with Title" variant="h4" subsectionId="alert-title">
        <Row props='title="..."'>
          <div className="w-full">
            <Alert variant="success" title="Payment Successful" data-edit-scope="component-definition" data-component="Alert">
              Your payment of $49.99 has been processed successfully.
            </Alert>
          </div>
        </Row>
      </Section>

      <Section title="Closable Alert" variant="h4" subsectionId="alert-closable">
        <Row props='closable={true} onClose={fn}'>
          <div className="w-full">
            <AlertClosableDemo />
          </div>
        </Row>
      </Section>

      {/* Progress */}
      <Section title="Progress Variants" variant="h4" subsectionId="progress-variants">
        <Row props='variant="default" | "success" | "warning" | "error"'>
          <div className="w-64 space-y-2">
            <Progress value={60} data-edit-scope="component-definition" data-component="Progress" />
            <Progress value={80} variant="success" data-edit-scope="component-definition" data-component="Progress" data-edit-variant="success" />
            <Progress value={50} variant="warning" data-edit-scope="component-definition" data-component="Progress" data-edit-variant="warning" />
            <Progress value={30} variant="error" data-edit-scope="component-definition" data-component="Progress" data-edit-variant="error" />
          </div>
        </Row>
      </Section>

      <Section title="Progress Sizes" variant="h4" subsectionId="progress-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="w-64 space-y-2">
            <Progress value={50} size="sm" data-edit-scope="component-definition" data-component="Progress" />
            <Progress value={50} size="md" data-edit-scope="component-definition" data-component="Progress" />
            <Progress value={50} size="lg" data-edit-scope="component-definition" data-component="Progress" />
          </div>
        </Row>
      </Section>

      <Section title="Progress with Label" variant="h4" subsectionId="progress-label">
        <Row props='showLabel={true}'>
          <div className="w-64">
            <Progress value={75} showLabel data-edit-scope="component-definition" data-component="Progress" />
          </div>
        </Row>
      </Section>

      {/* Spinner */}
      <Section title="Spinner" variant="h4" subsectionId="spinner">
        <Row props='size={number} completed={boolean}'>
          <SpinnerDemo />
        </Row>
        <Row props='size="16" | "24" | "32"'>
          <Spinner size={16} data-edit-scope="component-definition" data-component="Spinner" />
          <Spinner size={24} data-edit-scope="component-definition" data-component="Spinner" />
          <Spinner size={32} data-edit-scope="component-definition" data-component="Spinner" />
        </Row>
      </Section>

      {/* Skeleton */}
      <Section title="Skeleton Variants" variant="h4" subsectionId="skeleton-variants">
        <Row props='variant="text" | "circular" | "rectangular"'>
          <Skeleton variant="text" width={200} height={16} data-edit-scope="component-definition" data-component="Skeleton" />
          <Skeleton variant="circular" width={48} height={48} data-edit-scope="component-definition" data-component="Skeleton" />
          <Skeleton variant="rectangular" width={100} height={60} data-edit-scope="component-definition" data-component="Skeleton" />
        </Row>
      </Section>

      <Section title="Skeleton Loading State" variant="h4" subsectionId="skeleton-loading">
        <Row props='width, height'>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="space-y-1">
                <Skeleton variant="text" width={120} height={14} />
                <Skeleton variant="text" width={80} height={12} />
              </div>
            </div>
          </div>
        </Row>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip Positions" variant="h4" subsectionId="tooltip-positions">
        <Row props='position="top" | "bottom" | "left" | "right"'>
          <Tooltip content="Top tooltip" position="top" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" position="left" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" position="right" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Right</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Tooltip Sizes" variant="h4" subsectionId="tooltip-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Tooltip content="Small tooltip" size="sm" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Small</Button>
          </Tooltip>
          <Tooltip content="Medium tooltip" size="md" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Medium</Button>
          </Tooltip>
          <Tooltip content="Large tooltip" size="lg" data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">Large</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Tooltip with Delay" variant="h4" subsectionId="tooltip-delay">
        <Row props='delay={ms}'>
          <Tooltip content="Instant tooltip" delay={0} data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">No Delay</Button>
          </Tooltip>
          <Tooltip content="Delayed tooltip" delay={500} data-edit-scope="component-definition" data-component="Tooltip">
            <Button variant="default" size="sm">500ms Delay</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* Toast */}
      <Section title="Toast (click to trigger)" variant="h4" subsectionId="toast">
        <Row props='addToast({ title, description, variant, duration })'>
          <ToastDemo />
        </Row>
      </Section>
    </div>
  );
}

function DataDisplayContent() {
  return (
    <div className="space-y-6">
      {/* Avatar Sizes */}
      <Section title="Avatar Sizes" variant="h4" subsectionId="avatar-sizes">
        <Row props='size="sm" | "md" | "lg" | "xl"'>
          <Avatar size="sm" fallback="SM" data-edit-scope="component-definition" data-component="Avatar" />
          <Avatar size="md" fallback="MD" data-edit-scope="component-definition" data-component="Avatar" />
          <Avatar size="lg" fallback="LG" data-edit-scope="component-definition" data-component="Avatar" />
          <Avatar size="xl" fallback="XL" data-edit-scope="component-definition" data-component="Avatar" />
        </Row>
      </Section>

      {/* Avatar Variants */}
      <Section title="Avatar Variants" variant="h4" subsectionId="avatar-variants">
        <Row props='variant="circle" | "square"'>
          <Avatar variant="circle" fallback="AB" data-edit-scope="component-definition" data-component="Avatar" />
          <Avatar variant="square" fallback="CD" data-edit-scope="component-definition" data-component="Avatar" data-edit-variant="square" />
        </Row>
      </Section>

      {/* Avatar with Image */}
      <Section title="Avatar with Image" variant="h4" subsectionId="avatar-image">
        <Row props='src, alt, fallback'>
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"
            alt="User avatar"
            fallback="JD"
            data-edit-scope="component-definition"
            data-component="Avatar"
          />
          <Avatar
            src="invalid-url.jpg"
            alt="Fallback demo"
            fallback="FB"
            data-edit-scope="component-definition"
            data-component="Avatar"
          />
        </Row>
      </Section>

      {/* Table with Sub-components */}
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
                <TableCell><Badge variant="success" size="sm">Active</Badge></TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell><Badge variant="warning" size="sm">Pending</Badge></TableCell>
                <TableCell>Editor</TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell>Bob Wilson</TableCell>
                <TableCell><Badge variant="error" size="sm">Inactive</Badge></TableCell>
                <TableCell>Viewer</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Row>
      </Section>

      {/* Table Row States */}
      <Section title="Table Row States" variant="h4" subsectionId="table-row-states">
        <Row props='selected={boolean} (hover for highlight)'>
          <Table data-edit-scope="component-definition" data-component="Table">
            <TableBody>
              <TableRow>
                <TableCell>Normal row - hover me</TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell>Selected row</TableCell>
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
      {/* Tabs Variants */}
      <Section title="Tabs Variants" variant="h4" subsectionId="tabs-variants">
        <Row props='variant="pill" (default)'>
          <Tabs variant="pill" defaultValue="pill1" data-edit-scope="component-definition" data-component="Tabs">
            <TabList>
              <TabTrigger value="pill1">Overview</TabTrigger>
              <TabTrigger value="pill2">Settings</TabTrigger>
              <TabTrigger value="pill3">Analytics</TabTrigger>
            </TabList>
            <TabContent value="pill1" className="p-4">Pill variant content</TabContent>
            <TabContent value="pill2" className="p-4">Settings content</TabContent>
            <TabContent value="pill3" className="p-4">Analytics content</TabContent>
          </Tabs>
        </Row>
        <Row props='variant="manila"'>
          <div className="w-full">
            <Tabs variant="manila" defaultValue="manila1" data-edit-scope="component-definition" data-component="Tabs" data-edit-variant="manila">
              <TabList>
                <TabTrigger value="manila1">Files</TabTrigger>
                <TabTrigger value="manila2">Edit</TabTrigger>
                <TabTrigger value="manila3">View</TabTrigger>
              </TabList>
              <TabContent value="manila1" className="p-4">Manila folder style tabs</TabContent>
              <TabContent value="manila2" className="p-4">Edit content</TabContent>
              <TabContent value="manila3" className="p-4">View content</TabContent>
            </Tabs>
          </div>
        </Row>
      </Section>

      {/* Tabs with Icons */}
      <Section title="Tabs with Icons" variant="h4" subsectionId="tabs-icons">
        <Row props='layout="icon-text" iconName="..."'>
          <Tabs defaultValue="home" layout="icon-text" data-edit-scope="component-definition" data-component="Tabs">
            <TabList>
              <TabTrigger value="home" iconName="home">Home</TabTrigger>
              <TabTrigger value="settings" iconName="settings">Settings</TabTrigger>
              <TabTrigger value="user" iconName="user">Profile</TabTrigger>
            </TabList>
            <TabContent value="home" className="p-4">Home content</TabContent>
            <TabContent value="settings" className="p-4">Settings content</TabContent>
            <TabContent value="user" className="p-4">Profile content</TabContent>
          </Tabs>
        </Row>
        <Row props='layout="icon" (icon-only with tooltip)'>
          <Tabs defaultValue="icon1" layout="icon" data-edit-scope="component-definition" data-component="Tabs">
            <TabList>
              <TabTrigger value="icon1" iconName="home" tooltip="Home">Home</TabTrigger>
              <TabTrigger value="icon2" iconName="settings" tooltip="Settings">Settings</TabTrigger>
              <TabTrigger value="icon3" iconName="star" tooltip="Favorites">Favorites</TabTrigger>
            </TabList>
            <TabContent value="icon1" className="p-4">Icon-only tabs with tooltips</TabContent>
            <TabContent value="icon2" className="p-4">Settings</TabContent>
            <TabContent value="icon3" className="p-4">Favorites</TabContent>
          </Tabs>
        </Row>
      </Section>

      {/* Tabs Orientation */}
      <Section title="Tabs Orientation" variant="h4" subsectionId="tabs-orientation">
        <Row props='orientation="vertical"'>
          <Tabs defaultValue="v1" orientation="vertical" data-edit-scope="component-definition" data-component="Tabs">
            <div className="flex gap-4">
              <TabList className="w-32">
                <TabTrigger value="v1">First</TabTrigger>
                <TabTrigger value="v2">Second</TabTrigger>
                <TabTrigger value="v3">Third</TabTrigger>
              </TabList>
              <div className="flex-1">
                <TabContent value="v1" className="p-4 border border-[var(--glass-border)] rounded">Vertical tabs content 1</TabContent>
                <TabContent value="v2" className="p-4 border border-[var(--glass-border)] rounded">Vertical tabs content 2</TabContent>
                <TabContent value="v3" className="p-4 border border-[var(--glass-border)] rounded">Vertical tabs content 3</TabContent>
              </div>
            </div>
          </Tabs>
        </Row>
      </Section>

      {/* Divider Variants */}
      <Section title="Divider Variants" variant="h4" subsectionId="divider-variants">
        <Row props='variant="solid" | "dashed" | "decorated"'>
          <div className="w-64 space-y-4">
            <div>
              <p className="text-sm text-[var(--color-content-subtle)] mb-2">Solid</p>
              <Divider variant="solid" data-edit-scope="component-definition" data-component="Divider" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-content-subtle)] mb-2">Dashed</p>
              <Divider variant="dashed" data-edit-scope="component-definition" data-component="Divider" data-edit-variant="dashed" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-content-subtle)] mb-2">Decorated</p>
              <Divider variant="decorated" data-edit-scope="component-definition" data-component="Divider" data-edit-variant="decorated" />
            </div>
          </div>
        </Row>
      </Section>

      {/* Divider Orientation */}
      <Section title="Divider Orientation" variant="h4" subsectionId="divider-orientation">
        <Row props='orientation="horizontal" | "vertical"'>
          <div className="flex items-center gap-4 h-12">
            <span>Left</span>
            <Divider orientation="vertical" data-edit-scope="component-definition" data-component="Divider" />
            <span>Center</span>
            <Divider orientation="vertical" variant="dashed" data-edit-scope="component-definition" data-component="Divider" />
            <span>Right</span>
          </div>
        </Row>
      </Section>

      {/* Accordion with Sub-components */}
      <Section title="Accordion Single" variant="h4" subsectionId="accordion-single">
        <Row props='type="single" (only one open at a time)'>
          <div className="w-80">
            <Accordion type="single" defaultValue="item-1" data-edit-scope="component-definition" data-component="Accordion">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Phase?</AccordionTrigger>
                <AccordionContent>Phase is a dark theme with glass effects and warm cream aesthetics.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>Install the package and import components from @radflow/theme-phase.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I customize themes?</AccordionTrigger>
                <AccordionContent>Yes! Use the Variables tab to customize colors and tokens.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Row>
      </Section>

      <Section title="Accordion Multiple" variant="h4" subsectionId="accordion-multiple">
        <Row props='type="multiple" (multiple can be open)'>
          <div className="w-80">
            <Accordion type="multiple" defaultValue={['multi-1', 'multi-2']} data-edit-scope="component-definition" data-component="Accordion">
              <AccordionItem value="multi-1">
                <AccordionTrigger>Section 1</AccordionTrigger>
                <AccordionContent>Multiple sections can be expanded at once.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="multi-2">
                <AccordionTrigger>Section 2</AccordionTrigger>
                <AccordionContent>This section is also open by default.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="multi-3">
                <AccordionTrigger>Section 3</AccordionTrigger>
                <AccordionContent>Click to expand this section.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Row>
      </Section>

      {/* Breadcrumbs */}
      <Section title="Breadcrumbs" variant="h4" subsectionId="breadcrumbs">
        <Row props='items={[{ label, href? }]}'>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'Products', href: '#' },
              { label: 'Category', href: '#' },
              { label: 'Current Page' },
            ]}
            data-edit-scope="component-definition"
            data-component="Breadcrumbs"
          />
        </Row>
      </Section>

      <Section title="Breadcrumbs Separator" variant="h4" subsectionId="breadcrumbs-separator">
        <Row props='separator=">" | "→" | "/"'>
          <div className="space-y-2">
            <Breadcrumbs
              items={[{ label: 'Home', href: '#' }, { label: 'Section' }, { label: 'Page' }]}
              separator=">"
              data-edit-scope="component-definition"
              data-component="Breadcrumbs"
            />
            <Breadcrumbs
              items={[{ label: 'Home', href: '#' }, { label: 'Section' }, { label: 'Page' }]}
              separator="→"
              data-edit-scope="component-definition"
              data-component="Breadcrumbs"
            />
          </div>
        </Row>
      </Section>
    </div>
  );
}

function HelpPanelDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="purple" size="md" onClick={() => setIsOpen(true)}>
        Open Help Panel
      </Button>
      <HelpPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Help"
        data-edit-scope="component-definition"
        data-component="HelpPanel"
      >
        <div className="space-y-4">
          <p>This is a help panel that slides in from the right.</p>
          <p>It&apos;s useful for contextual help, documentation, or additional information.</p>
          <div className="p-3 bg-[var(--glass-bg)] rounded border border-[var(--glass-border-subtle)]">
            <p className="text-sm">Press Escape or click outside to close.</p>
          </div>
        </div>
      </HelpPanel>
    </>
  );
}

function OverlaysContent() {
  return (
    <div className="space-y-6">
      {/* Dialog */}
      <Section title="Dialog" variant="h4" subsectionId="dialog-compound">
        <Row props='DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose'>
          <Dialog data-edit-scope="component-definition" data-component="Dialog">
            <DialogTrigger asChild>
              <Button variant="purple" size="md">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>Are you sure you want to proceed with this action?</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>This action cannot be undone. Please review your changes before confirming.</p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="md">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="purple" size="md">Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      {/* Sheet Sides */}
      <Section title="Sheet Sides" variant="h4" subsectionId="sheet-sides">
        <Row props='side="left" | "right" | "top" | "bottom"'>
          <Sheet side="right" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="purple" size="sm">Right</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
                <SheetDescription>Slides in from the right side.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>This is the default side for sheets.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Sheet side="left" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="blue" size="sm">Left</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Left Sheet</SheetTitle>
                <SheetDescription>Slides in from the left side.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Good for navigation drawers.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Sheet side="top" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="default" size="sm">Top</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Top Sheet</SheetTitle>
                <SheetDescription>Slides down from the top.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Good for notifications or alerts.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Sheet side="bottom" data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">Bottom</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
                <SheetDescription>Slides up from the bottom.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Good for mobile action sheets.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      {/* Sheet with Footer */}
      <Section title="Sheet with Footer" variant="h4" subsectionId="sheet-footer">
        <Row props='SheetFooter, SheetClose'>
          <Sheet data-edit-scope="component-definition" data-component="Sheet">
            <SheetTrigger asChild>
              <Button variant="purple" size="md">Sheet with Actions</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Settings</SheetTitle>
                <SheetDescription>Make changes to your preferences.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Enter name..." />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="Enter email..." />
                  </div>
                </div>
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="ghost" size="md">Cancel</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="purple" size="md">Save Changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      {/* Popover Positions */}
      <Section title="Popover Positions" variant="h4" subsectionId="popover-positions">
        <Row props='position="top" | "bottom" | "left" | "right"'>
          <Popover position="top" data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">Top</Button>
            </PopoverTrigger>
            <PopoverContent className="p-3">
              <p className="text-sm">Popover appears above</p>
            </PopoverContent>
          </Popover>
          <Popover position="bottom" data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">Bottom</Button>
            </PopoverTrigger>
            <PopoverContent className="p-3">
              <p className="text-sm">Popover appears below</p>
            </PopoverContent>
          </Popover>
          <Popover position="left" data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">Left</Button>
            </PopoverTrigger>
            <PopoverContent className="p-3">
              <p className="text-sm">Popover on left</p>
            </PopoverContent>
          </Popover>
          <Popover position="right" data-edit-scope="component-definition" data-component="Popover">
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">Right</Button>
            </PopoverTrigger>
            <PopoverContent className="p-3">
              <p className="text-sm">Popover on right</p>
            </PopoverContent>
          </Popover>
        </Row>
      </Section>

      {/* DropdownMenu */}
      <Section title="DropdownMenu" variant="h4" subsectionId="dropdown-menu-compound">
        <Row props='DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel'>
          <DropdownMenu data-edit-scope="component-definition" data-component="DropdownMenu">
            <DropdownMenuTrigger asChild>
              <Button variant="purple" size="md" iconName="menu">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>File Actions</DropdownMenuLabel>
              <DropdownMenuItem iconName="copy">Copy</DropdownMenuItem>
              <DropdownMenuItem iconName="edit">Edit</DropdownMenuItem>
              <DropdownMenuItem iconName="download">Download</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem iconName="trash" destructive>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      {/* DropdownMenu Positions */}
      <Section title="DropdownMenu Positions" variant="h4" subsectionId="dropdown-positions">
        <Row props='position="bottom-start" | "bottom-end" | "top-start" | "top-end"'>
          <DropdownMenu position="bottom-start" data-edit-scope="component-definition" data-component="DropdownMenu">
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">Bottom Start</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu position="bottom-end" data-edit-scope="component-definition" data-component="DropdownMenu">
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">Bottom End</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      {/* ContextMenu */}
      <Section title="ContextMenu" variant="h4" subsectionId="context-menu-compound">
        <Row props='Right-click to trigger'>
          <ContextMenu data-edit-scope="component-definition" data-component="ContextMenu">
            <ContextMenuTrigger>
              <div className="p-6 border border-dashed border-[var(--glass-border-tertiary)] rounded-sm text-center bg-[var(--glass-bg-subtle)]">
                Right-click this area
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem iconName="copy">Copy</ContextMenuItem>
              <ContextMenuItem iconName="cut">Cut</ContextMenuItem>
              <ContextMenuItem iconName="paste">Paste</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem iconName="trash" destructive>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Row>
      </Section>

      {/* HelpPanel */}
      <Section title="HelpPanel" variant="h4" subsectionId="help-panel">
        <Row props='isOpen, onClose, title, children'>
          <HelpPanelDemo />
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Layout Content
// ============================================================================

function LayoutContent() {
  return (
    <div className="space-y-6">
      {/* ScrollArea */}
      <Section title="ScrollArea" variant="h4" subsectionId="scrollarea">
        <Row props='maxHeight, orientation="vertical"'>
          <div className="w-64">
            <ScrollArea maxHeight={150} className="border border-edge-primary rounded-sm" data-edit-scope="component-definition" data-component="ScrollArea">
              <div className="p-3 space-y-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="p-2 bg-[var(--glass-bg)] rounded text-sm">
                    Scrollable item {i + 1}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Row>
      </Section>

      <Section title="ScrollArea Horizontal" variant="h4" subsectionId="scrollarea-horizontal">
        <Row props='orientation="horizontal"'>
          <ScrollArea maxWidth={300} orientation="horizontal" className="border border-edge-primary rounded-sm" data-edit-scope="component-definition" data-component="ScrollArea">
            <div className="flex gap-2 p-3 w-max">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-24 h-16 flex-shrink-0 bg-[var(--glass-bg)] rounded flex items-center justify-center text-sm">
                  Item {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Row>
      </Section>

      <Section title="ScrollArea Hidden Scrollbar" variant="h4" subsectionId="scrollarea-hidden">
        <Row props='hideScrollbar={true}'>
          <div className="w-64">
            <ScrollArea maxHeight={100} hideScrollbar className="border border-edge-primary rounded-sm" data-edit-scope="component-definition" data-component="ScrollArea">
              <div className="p-3 space-y-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="p-2 bg-[var(--glass-bg)] rounded text-sm">
                    Hidden scrollbar item {i + 1}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
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
  { id: 'data-display', title: 'Data Display', content: <DataDisplayContent /> },
  { id: 'navigation', title: 'Navigation', content: <NavigationContent /> },
  { id: 'overlays', title: 'Overlays', content: <OverlaysContent /> },
  { id: 'layout', title: 'Layout', content: <LayoutContent /> },
];

interface PhaseUITabProps {
  searchQuery?: string;
}

export function PhaseUITab({ searchQuery: propSearchQuery = '' }: PhaseUITabProps) {
  const searchQuery = propSearchQuery;

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? COMPONENT_SECTIONS.filter((section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMPONENT_SECTIONS;

  return (
    <ToastProvider>
      <div className="flex flex-col h-full overflow-auto bg-surface-primary font-outfit text-content-primary">
        <div className="space-y-0 p-6">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div key={section.id} className="mb-6">
                <Section
                  title={section.title}
                  className={section.title === 'Buttons' ? 'mb-2' : undefined}
                >
                  {section.content}
                </Section>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[var(--color-content-subtle)] font-audiowide text-base">
              No components match &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
}

export default PhaseUITab;
