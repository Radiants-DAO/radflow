---
aliases: [Tabs Component, TabList, TabTrigger, TabContent]
tags: [component, radtools]
category: core
source: components/ui/Tabs.tsx
---

# Tabs

Tabbed interface with controlled and uncontrolled modes.

## Import

```tsx
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui';
```

## Props (Tabs)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Default active tab (uncontrolled) |
| `value` | `string` | - | Active tab (controlled) |
| `onValueChange` | `(value: string) => void` | - | Change callback |
| `variant` | `'pill' \| 'line'` | `'pill'` | Visual style |

## Sub-components

### TabList
Container for tab triggers. Usually horizontal.

```tsx
<TabList className="px-4">
  {/* TabTriggers here */}
</TabList>
```

### TabTrigger
Individual tab button.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Tab identifier (required) |
| `iconName` | `string` | Optional icon |

```tsx
<TabTrigger value="tab1">Tab 1</TabTrigger>
<TabTrigger value="tab2" iconName="settings">Settings</TabTrigger>
```

### TabContent
Content panel, visible when tab active.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Matching tab identifier |

```tsx
<TabContent value="tab1">
  Content for tab 1
</TabContent>
```

## Examples

### Uncontrolled

```tsx
<Tabs defaultValue="logos">
  <TabList>
    <TabTrigger value="logos">Logos</TabTrigger>
    <TabTrigger value="colors">Colors</TabTrigger>
    <TabTrigger value="fonts">Fonts</TabTrigger>
  </TabList>

  <TabContent value="logos">Logo grid here</TabContent>
  <TabContent value="colors">Color swatches here</TabContent>
  <TabContent value="fonts">Font previews here</TabContent>
</Tabs>
```

### Controlled

```tsx
const [activeTab, setActiveTab] = useState('overview');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabList>
    <TabTrigger value="overview">Overview</TabTrigger>
    <TabTrigger value="details">Details</TabTrigger>
  </TabList>

  <TabContent value="overview">Overview content</TabContent>
  <TabContent value="details">Details content</TabContent>
</Tabs>
```

### With Icons

```tsx
<Tabs defaultValue="logos">
  <TabList>
    <TabTrigger value="logos" iconName="image">Logos</TabTrigger>
    <TabTrigger value="colors" iconName="palette">Colors</TabTrigger>
    <TabTrigger value="fonts" iconName="type">Fonts</TabTrigger>
  </TabList>
  {/* ... */}
</Tabs>
```

### Line Variant

```tsx
<Tabs defaultValue="tab1" variant="line">
  <TabList className="border-b border-black">
    <TabTrigger value="tab1">Overview</TabTrigger>
    <TabTrigger value="tab2">Details</TabTrigger>
  </TabList>
  {/* ... */}
</Tabs>
```

### Full-Height App Layout

Common pattern for apps:

```tsx
function MyApp({ windowId }: AppProps) {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="tab1" className="flex flex-col h-full">
        <TabList className="px-4 pt-2">
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>

        <div className="flex-1 overflow-auto">
          <TabContent value="tab1">
            <div className="p-4">Tab 1 scrollable content</div>
          </TabContent>
          <TabContent value="tab2">
            <div className="p-4">Tab 2 scrollable content</div>
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
}
```

## Design Notes

### Pill Variant (default)
- Active: `bg-sun-yellow`, `shadow-btn`
- Inactive: `bg-transparent`
- Uses [[Joystix]] font

### Line Variant
- Active: Bottom border highlight
- Inactive: No border
- More subtle appearance

## Use Cases

| Use Case | Variant | Notes |
|----------|---------|-------|
| App navigation | `pill` | Primary tab style |
| Sub-sections | `line` | Less prominent |
| Settings panels | `pill` | With icons |

## Related

- [[App Pattern]] - Apps often use tabs
- [[Brand Assets]] - Example app with tabs
- [[Radiants Studio]] - Multi-tool tabs
