---
aliases: [RadTools, RadTools Reference, Component Library]
tags: [components, radtools, reference]
source: components/ui/
---

# RadTools Component Library

Complete API documentation for RadTools UI components. Import from `@/components/ui`.

## Design Principles

- **Colors**: cream (#FEF8E2), sun-yellow (#FCE184), black (#0F0E0C), sky-blue (#95BAD2)
- **Typography**: Joystix (pixel font) for headings/buttons, Mondwest for body text
- **Shadows**: Pixel-perfect box shadows (2px offset for buttons, 4px for cards)
- **Borders**: 1-2px solid black borders
- **Disabled State**: 50% opacity + cursor-not-allowed (consistent across all)
- **No Transitions**: Instant state changes for retro feel

---

## Core Components

### Button

Interactive button with retro lift effect. Supports link behavior.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |
| `fullWidth` | `boolean` | `false` | Expand to fill container |
| `iconOnly` | `boolean` | `false` | Square button with icon only |
| `iconName` | `string` | - | Icon filename (without .svg) |
| `loading` | `boolean` | `false` | Show loading spinner |
| `href` | `string` | - | URL for link behavior |
| `disabled` | `boolean` | `false` | Disabled state |

#### Variants

```tsx
// Primary (default) - yellow background
<Button variant="primary">Primary</Button>

// Secondary - black background, cream text
<Button variant="secondary">Secondary</Button>

// Outline - transparent with border
<Button variant="outline">Outline</Button>

// Ghost - no border, subtle hover
<Button variant="ghost">Ghost</Button>
```

#### Examples

```tsx
import { Button } from '@/components/ui';

// Basic button
<Button>Click Me</Button>

// Button with icon
<Button iconName="download">Download</Button>

// Icon-only button
<Button iconOnly iconName="close" aria-label="Close" />

// Full-width button
<Button fullWidth>Submit</Button>

// Loading state
<Button iconName="save" loading>Saving...</Button>

// As link
<Button href="/about">Learn More</Button>

// Disabled
<Button disabled>Disabled</Button>
```

---

### Card

Container component with consistent styling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'dark' \| 'raised'` | `'default'` | Visual style |
| `noPadding` | `boolean` | `false` | Remove default padding |

#### Sub-components

- `CardHeader` - Header with bottom border
- `CardBody` - Content area with padding
- `CardFooter` - Footer with top border

#### Examples

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

// Basic card
<Card>
  <p>Card content goes here</p>
</Card>

// Dark variant
<Card variant="dark">
  <p className="text-cream">Dark card content</p>
</Card>

// With structure
<Card noPadding>
  <CardHeader>
    <h3 className="font-joystix text-pixel-sm">CARD TITLE</h3>
  </CardHeader>
  <CardBody>
    <p>Main content area</p>
  </CardBody>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

---

### Tabs

Tabbed interface with controlled and uncontrolled modes.

#### Props (Tabs)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Default active tab (uncontrolled) |
| `value` | `string` | - | Active tab (controlled) |
| `onValueChange` | `(value: string) => void` | - | Change callback |
| `variant` | `'pill' \| 'line'` | `'pill'` | Visual style |

#### Sub-components

- `TabList` - Container for tab triggers
- `TabTrigger` - Individual tab button (`value`, `iconName`)
- `TabContent` - Content panel (`value`)

#### Examples

```tsx
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui';

// Uncontrolled tabs
<Tabs defaultValue="tab1">
  <TabList>
    <TabTrigger value="tab1">Tab 1</TabTrigger>
    <TabTrigger value="tab2">Tab 2</TabTrigger>
  </TabList>
  <TabContent value="tab1">Content for tab 1</TabContent>
  <TabContent value="tab2">Content for tab 2</TabContent>
</Tabs>

// With icons
<Tabs defaultValue="logos">
  <TabList>
    <TabTrigger value="logos" iconName="image">Logos</TabTrigger>
    <TabTrigger value="colors" iconName="palette">Colors</TabTrigger>
  </TabList>
</Tabs>
```

---

## Form Components

### Input

Text input field.

```tsx
import { Input, TextArea, Label } from '@/components/ui';

// Basic input
<Input placeholder="Enter text..." />

// With label
<div>
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Your name" />
</div>

// Textarea
<TextArea placeholder="Enter description..." rows={4} />

// Disabled
<Input disabled value="Cannot edit" />
```

---

### Select

Dropdown select component.

```tsx
import { Select } from '@/components/ui';

<Select>
  <option value="">Choose option...</option>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</Select>
```

---

### Checkbox & Radio

Selection controls.

```tsx
import { Checkbox, Radio } from '@/components/ui';

// Checkbox
<Checkbox id="agree" />
<label htmlFor="agree">I agree to the terms</label>

// Radio group
<div>
  <Radio name="size" value="sm" id="size-sm" />
  <label htmlFor="size-sm">Small</label>
</div>
<div>
  <Radio name="size" value="md" id="size-md" defaultChecked />
  <label htmlFor="size-md">Medium</label>
</div>
```

---

### Switch

Toggle switch.

```tsx
import { Switch } from '@/components/ui';

<Switch id="notifications" />
<label htmlFor="notifications">Enable notifications</label>

// Controlled
const [enabled, setEnabled] = useState(false);
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

---

### Slider

Range slider.

```tsx
import { Slider } from '@/components/ui';

<Slider min={0} max={100} defaultValue={50} />

// Controlled
const [volume, setVolume] = useState(75);
<Slider value={volume} onValueChange={setVolume} min={0} max={100} />
```

---

## Feedback Components

### Badge

Small label/tag.

```tsx
import { Badge } from '@/components/ui';

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

---

### Alert

Alert/notification box.

```tsx
import { Alert } from '@/components/ui';

<Alert>This is an informational alert.</Alert>
<Alert variant="success">Operation completed!</Alert>
<Alert variant="warning">Please review before continuing.</Alert>
<Alert variant="error">An error occurred.</Alert>
```

---

### Progress & Spinner

Loading indicators.

```tsx
import { Progress, Spinner } from '@/components/ui';

// Progress bar
<Progress value={65} />

// Spinner
<Spinner />
<Spinner size={24} />
```

---

### Tooltip

Hover tooltip.

```tsx
import { Tooltip } from '@/components/ui';

<Tooltip content="This is helpful information">
  <Button>Hover me</Button>
</Tooltip>

// With position
<Tooltip content="Info" side="bottom">
  <span>Hover</span>
</Tooltip>
```

---

### Toast

Toast notifications (requires provider).

```tsx
// In layout.tsx
import { ToastProvider } from '@/components/ui';

<ToastProvider>
  <App />
</ToastProvider>

// In component
import { useToast } from '@/components/ui';

function MyComponent() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: 'Success!',
      description: 'Your changes have been saved.',
      variant: 'success',
    });
  };

  return <Button onClick={handleClick}>Save</Button>;
}
```

---

## Overlay Components

### Dialog

Modal dialog.

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from '@/components/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Optional description.</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>Dialog content goes here.</p>
    </DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Sheet

Slide-out panel (drawer).

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetClose,
} from '@/components/ui';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    <SheetBody>
      <p>Sheet content goes here.</p>
    </SheetBody>
    <SheetFooter>
      <SheetClose asChild>
        <Button>Close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

### DropdownMenu

Dropdown menu.

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button iconOnly iconName="more" aria-label="Options" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => console.log('Edit')}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => console.log('Duplicate')}>
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => console.log('Delete')}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### ContextMenu

Right-click context menu.

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui';

<ContextMenu>
  <ContextMenuTrigger>
    <div className="p-8 border border-dashed">
      Right-click here
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

### Popover

Popover panel.

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui';

<Popover>
  <PopoverTrigger asChild>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content here</p>
  </PopoverContent>
</Popover>
```

---

## Navigation Components

### Accordion

Collapsible sections.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### Breadcrumbs

Navigation breadcrumbs.

```tsx
import { Breadcrumbs } from '@/components/ui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' }, // No href = current page
  ]}
/>
```

---

### Divider

Visual separator.

```tsx
import { Divider } from '@/components/ui';

// Horizontal (default)
<Divider />

// Vertical
<div className="flex items-center gap-4">
  <span>Left</span>
  <Divider orientation="vertical" className="h-6" />
  <span>Right</span>
</div>
```

---

## Component Gaps (Potential)

Components commonly needed by projects:

| Component | Use Case |
|-----------|----------|
| `VirtualList` | Efficient rendering of large lists |
| `TreeView` | Hierarchical data navigation |
| `DataGrid` | Tabular data display |

---

## Common Patterns

### Form with Validation

```tsx
<Card>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className={errors.email ? 'border-sun-red' : ''}
        />
        {errors.email && (
          <p className="text-sun-red text-body-xs mt-1">{errors.email}</p>
        )}
      </div>
      <Button type="submit" fullWidth>Submit</Button>
    </div>
  </form>
</Card>
```

### Loading State

```tsx
function DataList() {
  const { items, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2 font-joystix text-pixel-sm">LOADING...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(item => <Card key={item.id}>{item.name}</Card>)}
    </div>
  );
}
```

### Confirm Dialog

```tsx
function DeleteButton({ onDelete }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={onDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Related

- [[Design Tokens]] - Color, typography, spacing
- [[guides/creating-components|Creating Components]] - How to build new components
- [[components/_moc|Component Index]] - All components by category
