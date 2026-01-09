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
export type { SelectOption, SelectProps } from './Select';

export { Checkbox, Radio } from './Checkbox';
export type { CheckboxProps, RadioProps } from './Checkbox';

export { Switch } from './Switch';
export type { SwitchSize, SwitchProps } from './Switch';

export { Slider } from './Slider';
export type { SliderSize, SliderProps } from './Slider';

// ============================================================================
// Feedback Components
// ============================================================================

export { Progress, Spinner } from './Progress';

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

// ============================================================================
// Icons
// ============================================================================

export { Icon, ICON_SIZES } from './Icon';
export type { IconSize, IconProps } from './Icon';

// ============================================================================
// Hooks
// ============================================================================

export { useEscapeKey, useClickOutside, useLockBodyScroll } from './hooks/useModalBehavior';
export { createSafeContext } from './hooks/createSafeContext';
