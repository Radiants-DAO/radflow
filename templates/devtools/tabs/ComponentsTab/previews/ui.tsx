'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Divider,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  HelpPanel,
  Input,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Progress,
  Radio,
  Select,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  TextArea,
  Tooltip,
  useToast,
} from '@/components/ui';

// ============================================================================
// Section Components
// ============================================================================

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-4 border border-edge-primary bg-surface-primary rounded flex flex-col gap-4 mb-4 ${className || ''}`}>
      <h3 className="font-joystix text-sm uppercase text-content-primary">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function PropsDisplay({ props }: { props: string }) {
  return (
    <code className="font-mono text-xs bg-black/5 px-2 py-1 rounded-sm block mt-2 text-content-primary/70">
      {props}
    </code>
  );
}

function Row({ children, props, direction = 'column' }: { children: React.ReactNode; props?: string; direction?: 'row' | 'column' }) {
  const flexDirection = direction === 'row' ? 'flex-row' : 'flex-col';
  return (
    <div>
      <div className={`flex ${flexDirection} items-start justify-start gap-1`}>{children}</div>
      {props && <PropsDisplay props={props} />}
    </div>
  );
}

// ============================================================================
// Button
// ============================================================================

function ButtonContent() {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Button">
      <Section title="Button Variants">
        <Row props='variant="primary" | "secondary" | "outline" | "ghost"' direction="row">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
        <Row direction="row">
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </Row>
        <Row direction="row">
          <Button variant="outline">Outline</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </Row>
        <Row direction="row">
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </Row>
      </Section>

      <Section title="Button Sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
      </Section>

      <Section title="Button with Icon">
        <Row props='iconName="..."' direction="row">
          <Button iconName="download">Download</Button>
          <Button variant="secondary" iconName="copy-to-clipboard">Copy</Button>
        </Row>
        <Row props='iconOnly iconName="..."' direction="row">
          <Button iconOnly iconName="home" />
          <Button iconOnly iconName="settings" />
          <Button iconOnly iconName="search" />
        </Row>
      </Section>

      <Section title="Button Loading">
        <Row props='loading={boolean}'>
          <Button iconName="refresh" loading={loading} onClick={handleLoadingClick}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button variant="secondary" loading disabled>
            Always Loading
          </Button>
        </Row>
      </Section>

      <Section title="Button Full Width">
        <Row props='fullWidth={true}'>
          <div className="w-64">
            <Button fullWidth>Full Width Button</Button>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Card
// ============================================================================

function CardContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Card">
      <Section title="Card Variants">
        <Row props='variant="default" | "dark" | "raised"'>
          <div className="grid grid-cols-3 gap-4 w-full">
            <Card variant="default">
              <p className="font-joystix text-xs mb-2">Default Card</p>
              <p>Warm-cloud background with black border</p>
            </Card>
            <Card variant="dark">
              <p className="font-joystix text-xs mb-2">Dark Card</p>
              <p>Black background with warm-cloud text</p>
            </Card>
            <Card variant="raised">
              <p className="font-joystix text-xs mb-2">Raised Card</p>
              <p>Pixel shadow effect</p>
            </Card>
          </div>
        </Row>
      </Section>

      <Section title="Card with Header/Footer">
        <Row props="CardHeader, CardBody, CardFooter">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h4 className="font-joystix text-sm">Card Title</h4>
            </CardHeader>
            <CardBody>
              <p>This is the card body content. It can contain any content you need.</p>
            </CardBody>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </Row>
      </Section>

      <Section title="Card No Padding">
        <Row props='noPadding={true}'>
          <Card noPadding className="w-full max-w-md">
            <div className="p-4 bg-sun-yellow/20">Custom padded content</div>
          </Card>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Input & TextArea
// ============================================================================

function InputContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Input">
      <Section title="Input Default">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Default Input</Label>
          <Input placeholder="Enter text..." />
        </div>
        <PropsDisplay props='placeholder="..."' />
      </Section>

      <Section title="Input Sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="max-w-md w-full space-y-2">
            <div className="flex flex-col gap-1">
              <Label>Small Input</Label>
              <Input size="sm" placeholder="Small" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Medium Input</Label>
              <Input size="md" placeholder="Medium" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Large Input</Label>
              <Input size="lg" placeholder="Large" />
            </div>
          </div>
        </Row>
      </Section>

      <Section title="Input States">
        <div className="max-w-md w-full space-y-2">
          <div className="flex flex-col gap-1">
            <Label required>Error State</Label>
            <Input error placeholder="Error input" />
          </div>
          <PropsDisplay props='error={true}' />
          <div className="flex flex-col gap-1">
            <Label>Disabled</Label>
            <Input disabled placeholder="Disabled input" />
          </div>
          <PropsDisplay props='disabled={true}' />
        </div>
      </Section>

      <Section title="Input with Icon">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Search Input</Label>
          <Input iconName="search" placeholder="Search..." />
        </div>
        <PropsDisplay props='iconName="search"' />
      </Section>

      <Section title="TextArea">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Description</Label>
          <TextArea placeholder="Enter description..." rows={4} />
        </div>
        <PropsDisplay props='rows={4}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Select
// ============================================================================

function SelectContent() {
  const [value, setValue] = useState('');
  const [valueWithIcon, setValueWithIcon] = useState('');

  const options = [
    { value: 'option1', label: 'Option One' },
    { value: 'option2', label: 'Option Two' },
    { value: 'option3', label: 'Option Three' },
    { value: 'disabled', label: 'Disabled Option', disabled: true },
  ];

  const optionsWithIcons = [
    { value: 'folder', label: 'Folder', iconName: 'folder-closed' },
    { value: 'document', label: 'Document', iconName: 'document' },
    { value: 'image', label: 'Image', iconName: 'document-image' },
    { value: 'code', label: 'Code File', iconName: 'code-file' },
  ];

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Select">
      <Section title="Select Default">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Choose an option</Label>
          <Select
            options={options}
            value={value}
            onChange={setValue}
            placeholder="Select..."
          />
        </div>
        <PropsDisplay props='options={[...]} value={string} onChange={fn}' />
      </Section>

      <Section title="Select with Icon">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Select with Icon</Label>
          <Select
            options={optionsWithIcons}
            value={valueWithIcon}
            onChange={setValueWithIcon}
            iconName="folder-closed"
            placeholder="Choose file type..."
          />
        </div>
        <PropsDisplay props='iconName="folder-closed" options={[{ iconName: "..." }]}' />
      </Section>

      <Section title="Select States">
        <div className="max-w-md w-full space-y-2">
          <div className="flex flex-col gap-1">
            <Label required>Error State</Label>
            <Select options={options} error placeholder="Error select" />
          </div>
          <PropsDisplay props='error={true}' />
          <div className="flex flex-col gap-1">
            <Label>Disabled</Label>
            <Select options={options} disabled placeholder="Disabled select" />
          </div>
          <PropsDisplay props='disabled={true}' />
        </div>
      </Section>

      <Section title="Select Full Width">
        <div className="max-w-md w-full flex flex-col gap-1">
          <Label>Full Width Select</Label>
          <Select options={options} fullWidth placeholder="Full width..." />
        </div>
        <PropsDisplay props='fullWidth={true}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Checkbox & Radio
// ============================================================================

function CheckboxRadioContent() {
  const [checked, setChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({ a: false, b: true, c: false });
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <div className="space-y-6">
      <div data-edit-scope="component-definition" data-component="Checkbox">
        <Section title="Checkbox">
          <Row props='checked={boolean} onChange={fn}'>
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              label="Check me"
            />
          </Row>
          <Row props='disabled={true}'>
            <Checkbox checked={false} onChange={() => {}} label="Disabled unchecked" disabled />
            <Checkbox defaultChecked onChange={() => {}} label="Disabled checked" disabled />
          </Row>
        </Section>

        <Section title="Checkbox Group">
          <div className="flex flex-col gap-2">
            <Checkbox
              checked={checkedItems.a}
              onChange={(e) => setCheckedItems({ ...checkedItems, a: e.target.checked })}
              label="Option A"
            />
            <Checkbox
              checked={checkedItems.b}
              onChange={(e) => setCheckedItems({ ...checkedItems, b: e.target.checked })}
              label="Option B"
            />
            <Checkbox
              checked={checkedItems.c}
              onChange={(e) => setCheckedItems({ ...checkedItems, c: e.target.checked })}
              label="Option C"
            />
          </div>
        </Section>
      </div>

      <div data-edit-scope="component-definition" data-component="Radio">
        <Section title="Radio Group">
          <Row props='checked={boolean} onChange={fn} name="group"'>
            <div className="flex flex-col gap-2">
              <Radio
                checked={radioValue === 'option1'}
                onChange={() => setRadioValue('option1')}
                label="Option 1"
                name="demo-radio"
              />
              <Radio
                checked={radioValue === 'option2'}
                onChange={() => setRadioValue('option2')}
                label="Option 2"
                name="demo-radio"
              />
              <Radio
                checked={radioValue === 'option3'}
                onChange={() => setRadioValue('option3')}
                label="Option 3"
                name="demo-radio"
              />
            </div>
          </Row>
        </Section>

        <Section title="Radio Disabled">
          <Row props='disabled={true}'>
            <Radio checked={false} onChange={() => {}} label="Disabled unchecked" disabled />
            <Radio defaultChecked onChange={() => {}} label="Disabled checked" disabled />
          </Row>
        </Section>
      </div>
    </div>
  );
}

// ============================================================================
// Switch
// ============================================================================

function SwitchContent() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Switch">
      <Section title="Switch Default">
        <Row props='checked={boolean} onChange={fn}'>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            label="Enable notifications"
          />
        </Row>
      </Section>

      <Section title="Switch Label Position">
        <Row props='labelPosition="left" | "right"'>
          <Switch checked={true} onChange={() => {}} label="Label on left" labelPosition="left" />
          <Switch checked={true} onChange={() => {}} label="Label on right" labelPosition="right" />
        </Row>
      </Section>

      <Section title="Switch Sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Switch checked={true} onChange={() => {}} size="sm" label="Small" />
          <Switch checked={true} onChange={() => {}} size="md" label="Medium" />
          <Switch checked={true} onChange={() => {}} size="lg" label="Large" />
        </Row>
      </Section>

      <Section title="Switch Disabled">
        <Row props='disabled={true}'>
          <Switch checked={false} onChange={() => {}} label="Disabled off" disabled />
          <Switch checked={true} onChange={() => {}} label="Disabled on" disabled />
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Slider
// ============================================================================

function SliderContent() {
  const [value, setValue] = useState(50);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Slider">
      <Section title="Slider Default">
        <div className="max-w-md w-full">
          <Slider
            value={value}
            onChange={setValue}
            label="Volume"
            showValue
          />
        </div>
        <PropsDisplay props='value={number} onChange={fn} label="..." showValue' />
      </Section>

      <Section title="Slider Sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <div className="max-w-md w-full space-y-4">
            <Slider value={30} onChange={() => {}} size="sm" label="Small" showValue />
            <Slider value={50} onChange={() => {}} size="md" label="Medium" showValue />
            <Slider value={70} onChange={() => {}} size="lg" label="Large" showValue />
          </div>
        </Row>
      </Section>

      <Section title="Slider Range">
        <div className="max-w-md w-full">
          <Slider
            value={25}
            onChange={() => {}}
            min={0}
            max={50}
            step={5}
            label="Custom Range (0-50, step 5)"
            showValue
          />
        </div>
        <PropsDisplay props='min={0} max={50} step={5}' />
      </Section>

      <Section title="Slider Disabled">
        <div className="max-w-md w-full">
          <Slider value={50} onChange={() => {}} label="Disabled" disabled showValue />
        </div>
        <PropsDisplay props='disabled={true}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Alert
// ============================================================================

function AlertContent() {
  const [showClosable, setShowClosable] = useState(true);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Alert">
      <Section title="Alert Variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info"'>
          <div className="w-full space-y-2">
            <Alert variant="default" title="Default">
              This is a default alert message.
            </Alert>
            <Alert variant="success" title="Success">
              Operation completed successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review this information carefully.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>
            <Alert variant="info" title="Info">
              Here is some helpful information.
            </Alert>
          </div>
        </Row>
      </Section>

      <Section title="Alert with Icon">
        <Alert variant="info" title="Custom Icon" iconName="lightning">
          This alert has a custom icon.
        </Alert>
        <PropsDisplay props='iconName="lightning"' />
      </Section>

      <Section title="Alert Closable">
        {showClosable && (
          <Alert variant="success" title="Closable Alert" closable onClose={() => setShowClosable(false)}>
            Click the X to close this alert.
          </Alert>
        )}
        {!showClosable && (
          <Button size="sm" onClick={() => setShowClosable(true)}>Show Alert Again</Button>
        )}
        <PropsDisplay props='closable={true} onClose={fn}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Badge
// ============================================================================

function BadgeContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Badge">
      <Section title="Badge Variants">
        <Row props='variant="default" | "outline" | "success" | "warning" | "error" | "info"' direction="row">
          <Badge variant="default">Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Row>
      </Section>

      <Section title="Badge Sizes">
        <Row props='size="sm" | "md"' direction="row">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </Row>
      </Section>

      <Section title="Badge with Icon">
        <Row props='icon={ReactNode}' direction="row">
          <Badge icon="⚡">1XP = $0.0001</Badge>
          <Badge icon="💎">90 SOL staked</Badge>
          <Badge icon="⏱️">1.5 years avg lock</Badge>
        </Row>
      </Section>

      <Section title="Interactive Badge">
        <Row props='onClick={() => void}' direction="row">
          <Badge onClick={() => alert('Clicked!')}>Click me</Badge>
          <Badge onClick={() => {}} disabled>Disabled</Badge>
        </Row>
      </Section>

    </div>
  );
}

// ============================================================================
// Progress & Spinner
// ============================================================================

function ProgressSpinnerContent() {
  return (
    <div className="space-y-6">
      <div data-edit-scope="component-definition" data-component="Progress">
        <Section title="Progress Variants">
          <Row props='variant="default" | "success" | "warning" | "error"'>
            <div className="max-w-md w-full space-y-2">
              <Progress value={50} variant="default" showLabel />
              <Progress value={75} variant="success" showLabel />
              <Progress value={40} variant="warning" showLabel />
              <Progress value={25} variant="error" showLabel />
            </div>
          </Row>
        </Section>

        <Section title="Progress Sizes">
          <Row props='size="sm" | "md" | "lg"'>
            <div className="max-w-md w-full space-y-2">
              <Progress value={60} size="sm" />
              <Progress value={60} size="md" />
              <Progress value={60} size="lg" />
            </div>
          </Row>
        </Section>

        <Section title="Progress with Label">
          <div className="max-w-md w-full">
            <Progress value={75} showLabel />
          </div>
          <PropsDisplay props='showLabel={true}' />
        </Section>
      </div>

      <div data-edit-scope="component-definition" data-component="Spinner">
        <Section title="Spinner Sizes">
          <Row props='size={16} | size={24} | size={32}'>
            <Spinner size={16} />
            <Spinner size={24} />
            <Spinner size={32} />
          </Row>
        </Section>
      </div>
    </div>
  );
}

// ============================================================================
// Tooltip
// ============================================================================

function TooltipContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Tooltip">
      <Section title="Tooltip Positions">
        <Row props='position="top" | "bottom" | "left" | "right"' direction="row">
          <Tooltip content="Top tooltip" position="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom">
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" position="left">
            <Button>Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" position="right">
            <Button>Right</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Tooltip Sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <Tooltip content="Small tooltip" size="sm">
            <Button variant="outline">Small</Button>
          </Tooltip>
          <Tooltip content="Medium tooltip" size="md">
            <Button variant="outline">Medium</Button>
          </Tooltip>
          <Tooltip content="Large tooltip with more content that wraps" size="lg">
            <Button variant="outline">Large</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Tooltip with Delay">
        <Tooltip content="Delayed tooltip" delay={500}>
          <Button variant="secondary">Hover (500ms delay)</Button>
        </Tooltip>
        <PropsDisplay props='delay={500}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Breadcrumbs
// ============================================================================

function BreadcrumbsContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Breadcrumbs">
      <Section title="Breadcrumbs Default">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Category', href: '#' },
            { label: 'Current Page' },
          ]}
        />
        <PropsDisplay props='items={[{ label, href? }]}' />
      </Section>

      <Section title="Breadcrumbs Custom Separator">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Item' },
          ]}
          separator=">"
        />
        <PropsDisplay props='separator=">"' />
      </Section>
    </div>
  );
}

// ============================================================================
// Tabs
// ============================================================================

function TabsContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Tabs">
      <Section title="Tabs Pill Variant">
        <Tabs defaultValue="tab1" variant="pill">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
            <TabTrigger value="tab3">Tab 3</TabTrigger>
          </TabList>
          <TabContent value="tab1">
            <div className="p-4">Content for Tab 1</div>
          </TabContent>
          <TabContent value="tab2">
            <div className="p-4">Content for Tab 2</div>
          </TabContent>
          <TabContent value="tab3">
            <div className="p-4">Content for Tab 3</div>
          </TabContent>
        </Tabs>
        <PropsDisplay props='variant="pill"' />
      </Section>

      <Section title="Tabs Line Variant">
        <Tabs defaultValue="tab1" variant="line">
          <TabList>
            <TabTrigger value="tab1">Overview</TabTrigger>
            <TabTrigger value="tab2">Details</TabTrigger>
            <TabTrigger value="tab3">Settings</TabTrigger>
          </TabList>
          <TabContent value="tab1">
            <div className="p-4">Overview content</div>
          </TabContent>
          <TabContent value="tab2">
            <div className="p-4">Details content</div>
          </TabContent>
          <TabContent value="tab3">
            <div className="p-4">Settings content</div>
          </TabContent>
        </Tabs>
        <PropsDisplay props='variant="line"' />
      </Section>

      <Section title="Tabs Manila Variant" className="bg-surface-secondary">
        <Tabs defaultValue="documents" variant="manila">
          <TabList>
            <TabTrigger value="documents">Documents</TabTrigger>
            <TabTrigger value="images">Images</TabTrigger>
            <TabTrigger value="archive">Archive</TabTrigger>
          </TabList>
          <TabContent value="documents">
            <div className="p-4">
              <p className="font-mondwest">Your documents are organized here like a filing cabinet.</p>
            </div>
          </TabContent>
          <TabContent value="images">
            <div className="p-4">
              <p className="font-mondwest">Image files and media assets.</p>
            </div>
          </TabContent>
          <TabContent value="archive">
            <div className="p-4">
              <p className="font-mondwest">Archived files for reference.</p>
            </div>
          </TabContent>
        </Tabs>
        <PropsDisplay props='variant="manila"' />
      </Section>
    </div>
  );
}

// ============================================================================
// Divider
// ============================================================================

function DividerContent() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Divider">
      <Section title="Divider Variants">
        <Row props='variant="solid" | "dashed" | "decorated"'>
          <div className="w-full space-y-4">
            <div>
              <p className="text-sm mb-2">Solid</p>
              <Divider variant="solid" />
            </div>
            <div>
              <p className="text-sm mb-2">Dashed</p>
              <Divider variant="dashed" />
            </div>
            <div>
              <p className="text-sm mb-2">Decorated</p>
              <Divider variant="decorated" />
            </div>
          </div>
        </Row>
      </Section>

      <Section title="Divider Vertical">
        <Row props='orientation="vertical"'>
          <div className="flex items-center h-12 gap-4">
            <span>Left</span>
            <Divider orientation="vertical" />
            <span>Right</span>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Dialog
// ============================================================================

function DialogContent_() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Dialog">
      <Section title="Dialog">
        <Row props='open={boolean} onOpenChange={fn}'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description that provides additional context.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Dialog body content goes here. You can add forms, text, or any other content.</p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => setOpen(false)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// DropdownMenu
// ============================================================================

function DropdownMenuContent_() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="DropdownMenu">
      <Section title="DropdownMenu">
        <Row props='open={boolean} onOpenChange={fn}'>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button>Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Edit')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Duplicate')}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Delete')} className="text-content-error">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      <Section title="DropdownMenu Positions">
        <Row props='position="bottom-start" | "bottom-end" | "top-start" | "top-end"'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Bottom Start</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu position="bottom-end">
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Bottom End</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Popover
// ============================================================================

function PopoverContent_() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Popover">
      <Section title="Popover Positions">
        <Row props='position="top" | "bottom" | "left" | "right"' direction="row">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Bottom (Default)</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <p className="font-joystix text-xs mb-2">Popover Title</p>
                <p className="text-sm">This is popover content.</p>
              </div>
            </PopoverContent>
          </Popover>
          <Popover position="top">
            <PopoverTrigger asChild>
              <Button variant="outline">Top</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <p className="text-sm">Top positioned popover</p>
              </div>
            </PopoverContent>
          </Popover>
          <Popover position="left">
            <PopoverTrigger asChild>
              <Button variant="outline">Left</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <p className="text-sm">Left positioned</p>
              </div>
            </PopoverContent>
          </Popover>
          <Popover position="right">
            <PopoverTrigger asChild>
              <Button variant="outline">Right</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <p className="text-sm">Right positioned</p>
              </div>
            </PopoverContent>
          </Popover>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Sheet
// ============================================================================

function SheetContent_() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Sheet">
      <Section title="Sheet Sides">
        <Row props='side="left" | "right" | "top" | "bottom"'>
          <Sheet open={leftOpen} onOpenChange={setLeftOpen} side="left">
            <SheetTrigger asChild>
              <Button variant="outline">Open Left</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Left Sheet</SheetTitle>
                <SheetDescription>This sheet slides in from the left.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Sheet body content goes here.</p>
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet open={rightOpen} onOpenChange={setRightOpen} side="right">
            <SheetTrigger asChild>
              <Button variant="outline">Open Right</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
                <SheetDescription>This sheet slides in from the right.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Sheet body content goes here.</p>
              </SheetBody>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// HelpPanel
// ============================================================================

function HelpPanelContent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="HelpPanel">
      <Section title="HelpPanel">
        <Row props='isOpen={boolean} onClose={fn} title="..."'>
          <div className="relative h-64 w-full border border-dashed border-edge-primary/30 rounded">
            <Button onClick={() => setIsOpen(true)}>Open Help Panel</Button>
            <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} title="Help">
              <p className="mb-2">This is the help panel content.</p>
              <p>You can add any React content here to help users understand your application.</p>
            </HelpPanel>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// ContextMenu
// ============================================================================

function ContextMenuContent_() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="ContextMenu">
      <Section title="ContextMenu">
        <Row props="Right-click to open">
          <ContextMenu>
            <div className="p-8 border border-dashed border-edge-primary/30 rounded bg-surface-primary/50 cursor-context-menu">
              <p className="text-center text-sm text-content-primary/60">Right-click here</p>
            </div>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => console.log('Cut')}>
                Cut
              </ContextMenuItem>
              <ContextMenuItem onClick={() => console.log('Copy')}>
                Copy
              </ContextMenuItem>
              <ContextMenuItem onClick={() => console.log('Paste')}>
                Paste
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => console.log('Delete')}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Accordion
// ============================================================================

function AccordionContent_() {
  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Accordion">
      <Section title="Accordion Single">
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>
              Content for section 1. This accordion only allows one item open at a time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section 2</AccordionTrigger>
            <AccordionContent>
              Content for section 2. Click another section to close this one.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Section 3</AccordionTrigger>
            <AccordionContent>
              Content for section 3.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <PropsDisplay props='type="single" defaultValue="item-1"' />
      </Section>

      <Section title="Accordion Multiple">
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Section A</AccordionTrigger>
            <AccordionContent>
              Content for section A. Multiple items can be open simultaneously.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section B</AccordionTrigger>
            <AccordionContent>
              Content for section B.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Section C</AccordionTrigger>
            <AccordionContent>
              Content for section C.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <PropsDisplay props='type="multiple" defaultValue={["item-1", "item-2"]}' />
      </Section>
    </div>
  );
}

// ============================================================================
// Toast Demo
// ============================================================================

function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div className="space-y-6" data-edit-scope="component-definition" data-component="Toast">
      <Section title="Toast Variants">
        <Row props='variant="default" | "success" | "warning" | "error" | "info"'>
          <Button
            variant="outline"
            onClick={() => addToast({ title: 'Default Toast', description: 'This is a default toast message.' })}
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast({ title: 'Success!', description: 'Operation completed.', variant: 'success' })}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast({ title: 'Warning', description: 'Please review this.', variant: 'warning' })}
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })}
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast({ title: 'Info', description: 'Here is some info.', variant: 'info' })}
          >
            Info
          </Button>
        </Row>
      </Section>

      <Section title="Toast with Custom Duration">
        <Row props='duration={10000}'>
          <Button
            onClick={() => addToast({ title: 'Long Toast', description: 'This toast lasts 10 seconds.', duration: 10000 })}
          >
            Show Long Toast
          </Button>
        </Row>
      </Section>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export default function Preview() {
  return (
    <div className="space-y-8">
      {/* Buttons Section */}
      <div id="component-button">
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Buttons</h2>
        <ButtonContent />
      </div>

      {/* Cards Section */}
      <div id="component-card">
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Cards</h2>
        <CardContent />
      </div>

      {/* Forms Section */}
      <div>
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Forms</h2>
        <div id="component-input">
          <h3 className="font-joystix text-sm uppercase mb-2 text-content-primary/70">Text Inputs</h3>
          <InputContent />
        </div>
        <div id="component-select">
          <h3 className="font-joystix text-sm uppercase mb-2 mt-6 text-content-primary/70">Selection</h3>
          <SelectContent />
        </div>
        <div id="component-checkbox">
          <h3 className="font-joystix text-sm uppercase mb-2 mt-6 text-content-primary/70">Checkboxes & Radios</h3>
          <CheckboxRadioContent />
        </div>
        <div id="component-switch">
          <h3 className="font-joystix text-sm uppercase mb-2 mt-6 text-content-primary/70">Toggles</h3>
          <SwitchContent />
        </div>
        <div id="component-slider">
          <h3 className="font-joystix text-sm uppercase mb-2 mt-6 text-content-primary/70">Sliders</h3>
          <SliderContent />
        </div>
      </div>

      {/* Feedback Section */}
      <div>
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Feedback</h2>
        <div id="component-alert"><AlertContent /></div>
        <div id="component-badge"><BadgeContent /></div>
        <div id="component-progress"><ProgressSpinnerContent /></div>
        <div id="component-toast"><ToastDemo /></div>
      </div>

      {/* Navigation Section */}
      <div>
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Navigation</h2>
        <div id="component-breadcrumbs"><BreadcrumbsContent /></div>
        <div id="component-tabs"><TabsContent /></div>
        <div id="component-divider"><DividerContent /></div>
      </div>

      {/* Overlays Section */}
      <div>
        <h2 className="font-joystix text-lg uppercase mb-4 border-b-2 border-edge-primary pb-2">Overlays</h2>
        <div id="component-tooltip"><TooltipContent /></div>
        <div id="component-dialog"><DialogContent_ /></div>
        <div id="component-dropdownmenu"><DropdownMenuContent_ /></div>
        <div id="component-popover"><PopoverContent_ /></div>
        <div id="component-sheet"><SheetContent_ /></div>
        <div id="component-helppanel"><HelpPanelContent /></div>
        <div id="component-contextmenu"><ContextMenuContent_ /></div>
        <div id="component-accordion"><AccordionContent_ /></div>
      </div>
    </div>
  );
}
