# Component Preview Template

Copy this template and fill in the blanks to create a preview for your component.

---

## Step 1: Read the Component

First, read your component file to understand its props:

```
Read /packages/ui/src/{YourComponent}.tsx
```

Look for:
- `type {YourComponent}Props`
- Variants (e.g., `variant?: 'primary' | 'secondary'`)
- Sizes (e.g., `size?: 'sm' | 'md' | 'lg'`)
- States (disabled, error, loading)
- Sub-components (Header, Body, Footer, etc.)

---

## Step 2: Create the Content Function

```tsx
// Add to UITab.tsx

function {YourComponent}Content() {
  return (
    <div className="space-y-6">
      {/* VARIANTS */}
      <Section title="{YourComponent} Variants" variant="h4" subsectionId="{your-component}-variants">
        <Row props='variant="default" | "variant2" | "variant3"'>
          <{YourComponent}
            variant="default"
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
          >
            Default
          </{YourComponent}>
          <{YourComponent}
            variant="variant2"
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
            data-edit-variant="variant2"
          >
            Variant 2
          </{YourComponent}>
          {/* Add disabled state */}
          <{YourComponent}
            variant="default"
            disabled
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
          >
            Disabled
          </{YourComponent}>
        </Row>
      </Section>

      {/* SIZES */}
      <Section title="{YourComponent} Sizes" variant="h4" subsectionId="{your-component}-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <{YourComponent} size="sm" data-edit-scope="component-definition" data-component="{YourComponent}">
            Small
          </{YourComponent}>
        </Row>
        <Row props='size="md"'>
          <{YourComponent} size="md" data-edit-scope="component-definition" data-component="{YourComponent}">
            Medium
          </{YourComponent}>
        </Row>
        <Row props='size="lg"'>
          <{YourComponent} size="lg" data-edit-scope="component-definition" data-component="{YourComponent}">
            Large
          </{YourComponent}>
        </Row>
      </Section>

      {/* STATES (if applicable) */}
      <Section title="{YourComponent} States" variant="h4" subsectionId="{your-component}-states">
        <Row props='error={true}'>
          <{YourComponent} error data-edit-scope="component-definition" data-component="{YourComponent}">
            Error State
          </{YourComponent}>
        </Row>
        <Row props='loading={true}'>
          <{YourComponent} loading data-edit-scope="component-definition" data-component="{YourComponent}">
            Loading
          </{YourComponent}>
        </Row>
      </Section>

      {/* WITH ICON (if applicable) */}
      <Section title="{YourComponent} with Icon" variant="h4" subsectionId="{your-component}-icon">
        <Row props='iconName="star"'>
          <{YourComponent} iconName="star" data-edit-scope="component-definition" data-component="{YourComponent}">
            With Icon
          </{YourComponent}>
        </Row>
      </Section>
    </div>
  );
}
```

---

## Step 3: Add Interactive Demo (if needed)

For components with state that users should interact with:

```tsx
function {YourComponent}Demo() {
  const [value, setValue] = useState(initialValue);

  return (
    <{YourComponent}
      value={value}
      onChange={setValue}
      // other props
      data-edit-scope="component-definition"
      data-component="{YourComponent}"
    />
  );
}

// Use in Section:
<Section title="{YourComponent} Interactive" variant="h4" subsectionId="{your-component}-demo">
  <Row props='value, onChange'>
    <{YourComponent}Demo />
  </Row>
</Section>
```

---

## Step 4: Register the Section

Add to `COMPONENT_SECTIONS` array in UITab.tsx:

```tsx
const COMPONENT_SECTIONS = [
  // ... existing sections
  { id: '{your-section-id}', title: '{Section Title}', content: <{YourComponent}Content /> },
];
```

---

## Step 5: Add Search Index Entries

Add to `UITabSearchIndex.ts`:

```tsx
// Section
{ text: '{Section Title}', sectionId: '{your-section-id}', type: 'section' },

// Component
{ text: '{YourComponent}', sectionId: '{your-section-id}', type: 'component' },

// Subsections
{ text: '{YourComponent} Variants', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} Variants', type: 'subsection' },
{ text: '{YourComponent} Sizes', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} Sizes', type: 'subsection' },
{ text: '{YourComponent} States', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} States', type: 'subsection' },
```

---

## Step 6: Add Imports

Add required imports at top of UITab.tsx:

```tsx
import { {YourComponent} } from '@radflow/ui';
// Or for compound components:
import {
  {YourComponent},
  {YourComponent}Header,
  {YourComponent}Body,
  {YourComponent}Footer
} from '@radflow/ui/{YourComponent}';
```

---

## Checklist

Before submitting, verify:

- [ ] All variants shown with `data-edit-variant` on non-defaults
- [ ] All sizes demonstrated
- [ ] Disabled state included
- [ ] Error state (if applicable)
- [ ] Loading state (if applicable)
- [ ] Icon prop (if applicable)
- [ ] Compound sub-components (if applicable)
- [ ] Interactive demo for controlled props
- [ ] Width constraints where needed (`w-64`, `w-80`, `max-w-md`)
- [ ] Section registered in `COMPONENT_SECTIONS`
- [ ] Search index entries added
- [ ] Required imports added

---

## Quick Reference: Data Attributes

```tsx
// Always required on editable components:
data-edit-scope="component-definition"
data-component="{ComponentName}"  // Exact component name

// Only for non-default variants:
data-edit-variant="{variant}"     // e.g., "secondary", "outline"
```

## Quick Reference: Common Patterns

```tsx
// Form input with label
<div className="w-64">
  <Label htmlFor="my-input" required>Label Text</Label>
  <Input id="my-input" placeholder="..." />
</div>

// Card with compound components
<Card noPadding className="w-80">
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
  <CardFooter>...</CardFooter>
</Card>

// Dialog/Sheet/Popover trigger
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>

// Scrollable list
<ScrollArea maxHeight={150}>
  {items.map(item => <div key={item.id}>...</div>)}
</ScrollArea>
```
