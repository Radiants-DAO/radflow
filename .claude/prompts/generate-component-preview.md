# RadFlow Component Preview Generator

Generate comprehensive, interactive component previews for the RadFlow DevTools UI tab.

## Context

The UI tab in RadFlow DevTools (`/packages/devtools/src/tabs/ComponentsTab/UITab.tsx`) contains visual previews of all `@radflow/ui` components. Each section showcases variants, sizes, states, and interactive demos.

## Before Starting

Read these files to understand the patterns:
1. `/packages/devtools/src/tabs/ComponentsTab/UITab.tsx` - See existing preview implementations
2. `/packages/ui/src/{ComponentName}.tsx` - Read the component's props and variants
3. `/packages/devtools/src/tabs/ComponentsTab/UITabSearchIndex.ts` - Search index structure

## Preview Structure

### Section & Row Pattern

Every preview uses this structure:

```tsx
function {SectionName}Content() {
  return (
    <div className="space-y-6">
      <Section title="Feature Name" variant="h4" subsectionId="feature-kebab-case">
        <Row props='prop="value1" | "value2"'>
          {/* Components side-by-side */}
        </Row>
      </Section>
    </div>
  );
}
```

### Data Attributes (Required for RadFlow Editing)

```tsx
// Base component (default variant)
<Button
  variant="primary"
  data-edit-scope="component-definition"
  data-component="Button"
>
  Primary
</Button>

// Non-default variant - add data-edit-variant
<Button
  variant="secondary"
  data-edit-scope="component-definition"
  data-component="Button"
  data-edit-variant="secondary"
>
  Secondary
</Button>
```

## Real Examples

### Variants + Disabled States

```tsx
<Section title="Button Variants" variant="h4" subsectionId="button-variants">
  <Row props='variant="primary" | "secondary" | "outline" | "ghost"'>
    <Button variant="primary" data-edit-scope="component-definition" data-component="Button">Primary</Button>
    <Button variant="primary" disabled data-edit-scope="component-definition" data-component="Button">Disabled</Button>
  </Row>
  <Row props='variant="secondary"'>
    <Button variant="secondary" data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Secondary</Button>
    <Button variant="secondary" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Disabled</Button>
  </Row>
</Section>
```

### Sizes

```tsx
<Section title="Button Sizes" variant="h4" subsectionId="button-sizes">
  <Row props='size="sm" | "md" | "lg"'>
    <Button variant="primary" size="sm" data-edit-scope="component-definition" data-component="Button">Small</Button>
  </Row>
  <Row props='size="md"'>
    <Button variant="primary" size="md" data-edit-scope="component-definition" data-component="Button">Medium</Button>
  </Row>
  <Row props='size="lg"'>
    <Button variant="primary" size="lg" data-edit-scope="component-definition" data-component="Button">Large</Button>
  </Row>
</Section>
```

### Interactive Demo (Loading State)

```tsx
function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button
      variant="primary"
      iconName="refresh"
      loading={loading}
      onClick={handleClick}
      data-edit-scope="component-definition"
      data-component="Button"
    >
      Click to Load
    </Button>
  );
}

// Usage in Section:
<Section title="Loading State" variant="h4" subsectionId="button-loading">
  <Row props='loading={boolean} (click to toggle)'>
    <LoadingButtonDemo />
  </Row>
</Section>
```

### Interactive Demo (Toast)

```tsx
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
      <Button size="sm" onClick={() => showToast('default')}>Default</Button>
      <Button size="sm" onClick={() => showToast('success')}>Success</Button>
      <Button size="sm" onClick={() => showToast('warning')}>Warning</Button>
      <Button size="sm" onClick={() => showToast('error')}>Error</Button>
      <Button size="sm" onClick={() => showToast('info')}>Info</Button>
    </>
  );
}
```

### Interactive Demo (Controlled Input)

```tsx
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
```

### Form Inputs with Labels

```tsx
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
```

### Compound Components (Card)

```tsx
<Section title="Card with Sub-components" variant="h4" subsectionId="card-compound">
  <Row props='CardHeader, CardBody, CardFooter'>
    <Card noPadding className="w-80" data-edit-scope="component-definition" data-component="Card">
      <CardHeader><h4>Card Header</h4></CardHeader>
      <CardBody><p>This is the card body content.</p></CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="md">Cancel</Button>
        <Button variant="primary" size="md">Confirm</Button>
      </CardFooter>
    </Card>
  </Row>
</Section>
```

### Compound Components (Dialog)

```tsx
<Section title="Dialog" variant="h4" subsectionId="dialog-compound">
  <Row props='DialogTrigger, DialogContent, DialogHeader, DialogTitle, etc.'>
    <Dialog data-edit-scope="component-definition" data-component="Dialog">
      <DialogTrigger asChild>
        <Button variant="primary" size="md">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>This action cannot be undone.</p>
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
```

### Position/Side Variants (Sheet)

```tsx
<Section title="Sheet Sides" variant="h4" subsectionId="sheet-sides">
  <Row props='side="left" | "right" | "top" | "bottom"'>
    <Sheet side="right" data-edit-scope="component-definition" data-component="Sheet">
      <SheetTrigger asChild>
        <Button variant="primary" size="sm">Right</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Right Sheet</SheetTitle>
        </SheetHeader>
        <SheetBody><p>Content here.</p></SheetBody>
      </SheetContent>
    </Sheet>
    {/* Repeat for other sides */}
  </Row>
</Section>
```

### ScrollArea / Container Components

```tsx
<Section title="ScrollArea" variant="h4" subsectionId="scrollarea">
  <Row props='maxHeight, orientation="vertical"'>
    <div className="w-64">
      <ScrollArea maxHeight={150} className="border border-edge-primary rounded-sm">
        <div className="p-3 space-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-2 bg-surface-tertiary rounded text-sm">
              Scrollable item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  </Row>
</Section>
```

## Component Sections Array

Add new sections to `COMPONENT_SECTIONS`:

```tsx
const COMPONENT_SECTIONS = [
  { id: 'buttons', title: 'Buttons', content: <ButtonsContent /> },
  { id: 'cards', title: 'Cards', content: <CardsContent /> },
  { id: 'forms', title: 'Forms', content: <FormsContent /> },
  { id: 'feedback', title: 'Feedback', content: <FeedbackContent /> },
  { id: 'data-display', title: 'Data display', content: <DatadisplayContent /> },
  { id: 'navigation', title: 'Navigation', content: <NavigationContent /> },
  { id: 'overlays', title: 'Overlays', content: <OverlaysContent /> },
  { id: 'layout', title: 'Layout', content: <LayoutContent /> },
];
```

## Search Index Entries

Add entries to `UITabSearchIndex.ts`:

```tsx
// Section header
{ text: 'Forms', sectionId: 'forms', type: 'section' },

// Component
{ text: 'Input', sectionId: 'forms', type: 'button' },
{ text: 'Combobox', sectionId: 'forms', type: 'component' },

// Subsection
{ text: 'Input Sizes', sectionId: 'forms', subsectionTitle: 'Input Sizes', type: 'subsection' },

// Type-specific items
{ text: 'Checkbox', sectionId: 'forms', type: 'checkbox' },
{ text: 'Switch', sectionId: 'forms', type: 'switch' },
{ text: 'Slider', sectionId: 'forms', type: 'slider' },
{ text: 'Badge', sectionId: 'feedback', type: 'badge' },
{ text: 'Alert', sectionId: 'feedback', type: 'alert' },
{ text: 'Tooltip', sectionId: 'feedback', type: 'tooltip' },
{ text: 'Toast', sectionId: 'feedback', type: 'toast' },
{ text: 'Tabs', sectionId: 'navigation', type: 'tab' },
{ text: 'Divider', sectionId: 'navigation', type: 'divider' },
{ text: 'Breadcrumbs', sectionId: 'navigation', type: 'breadcrumb' },
{ text: 'Dialog', sectionId: 'overlays', type: 'menu' },
```

## Checklist

For each component, include:
- [ ] All variants with data-edit-variant for non-defaults
- [ ] All sizes (sm, md, lg)
- [ ] Disabled state
- [ ] Error state (form components)
- [ ] Loading state (if applicable)
- [ ] With icon (if applicable)
- [ ] Compound sub-components
- [ ] Interactive demo for stateful props
- [ ] Width constraints (w-64, w-80, max-w-md as needed)
- [ ] Search index entries

## Output

When generating a preview, provide:
1. The `{ComponentName}Content()` function
2. Any interactive demo functions (e.g., `LoadingDemo`, `ToastDemo`)
3. Updates to `COMPONENT_SECTIONS` array
4. Search index entries for `UITabSearchIndex.ts`
5. Required imports

---

**Which component would you like me to generate a preview for?**
