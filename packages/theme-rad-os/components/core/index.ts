/**
 * @radflow/ui - UI Component Library
 *
 * Centralized exports for all design system components.
 */

// ============================================================================
// Core Components
// ============================================================================

export { Button } from './Button';
export type { ButtonVariant, ButtonSize, BaseButtonProps } from './Button';

export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardVariant, CardProps } from './Card';

export { Tabs, TabList, TabTrigger, TabContent } from './Tabs';
export type { TabsVariant, TabsOrientation, TabsLayout, TabsProps, TabListProps, TabTriggerProps, TabContentProps } from './Tabs';

export { Input, TextArea, Label } from './Input';
export type { InputSize, InputProps, TextAreaProps, LabelProps } from './Input';

export { Badge, BadgeGroup } from './Badge';
export type { BadgeVariant, BadgeSize, BadgeProps, BadgeGroupProps } from './Badge';

export { Divider } from './Divider';
export type { DividerOrientation, DividerVariant, DividerProps } from './Divider';

// ============================================================================
// Form Components
// ============================================================================

export { Select } from './Select';
export type { SelectOption, SelectOptionGroup, SelectProps } from './Select';

export { Checkbox, Radio, RadioGroup } from './Checkbox';
export type { CheckboxProps, RadioProps, RadioGroupProps } from './Checkbox';

export { Switch } from './Switch';
export type { SwitchSize, SwitchProps } from './Switch';

export { Slider } from './Slider';
export type { SliderSize, SliderProps } from './Slider';

export { Combobox } from './Combobox';
export type { ComboboxOption, ComboboxProps, ComboboxSize } from './Combobox';

export { NumberField } from './NumberField';
export type { NumberFieldProps, NumberFieldSize } from './NumberField';

// ============================================================================
// Feedback Components
// ============================================================================

export { Progress, Spinner } from './Progress';

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from './Table';

export { Tooltip } from './Tooltip';
export type { TooltipPosition, TooltipSize, TooltipProps } from './Tooltip';

export { Alert } from './Alert';
export type { AlertVariant, AlertProps } from './Alert';

export { ToastProvider, useToast } from './Toast';
export type { ToastVariant, ToastData, ToastProviderProps } from './Toast';

// ============================================================================
// Navigation Components
// ============================================================================

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
export type { AccordionType, AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from './Accordion';

export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs';

// ============================================================================
// Overlay Components
// ============================================================================

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose } from './Dialog';
export type { DialogProps, DialogTriggerProps, DialogContentProps } from './Dialog';

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose } from './Sheet';

export { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverBody, PopoverFooter, PopoverClose } from './Popover';

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './DropdownMenu';

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from './ContextMenu';

export { HelpPanel, HelpSection, HelpItem, HelpShortcut } from './HelpPanel';

// ============================================================================
// Icons
// ============================================================================

export { Icon, ICON_SIZES } from './Icon';
export type { IconSize, IconProps } from './Icon';

export { IconProvider, useIconConfig } from './IconContext';
export type { IconLibrary, PhosphorWeight, IconConfig, IconProviderProps } from './IconContext';

// ============================================================================
// Hooks
// ============================================================================

export { useEscapeKey, useClickOutside, useLockBodyScroll } from './hooks/useModalBehavior';
export { createSafeContext } from './hooks/createSafeContext';

// ============================================================================
// Layout Components
// ============================================================================

export { ScrollArea } from './ScrollArea';
export type { ScrollAreaProps, ScrollAreaOrientation } from './ScrollArea';
