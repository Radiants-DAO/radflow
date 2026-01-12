'use client';

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, Input } from '@radflow/ui';

interface ThemeCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (config: WizardFormData) => void;
}

interface WizardFormData {
  // Step 1: Basic Info
  themeName: string;
  themeId: string;
  description: string;
  packageName: string;

  // Step 2: Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  colorPreset?: string;

  // Step 3: Fonts (to be implemented)
  headingFont?: string;
  bodyFont?: string;

  // Step 4: Icons (to be implemented)
  iconSet?: string;

  // Step 5: Preview (no data)
  // Step 6: Confirmation (no additional data)
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_TITLES: Record<WizardStep, string> = {
  1: 'Basic Information',
  2: 'Colors',
  3: 'Typography',
  4: 'Icons',
  5: 'Preview',
  6: 'Confirmation',
};

interface ColorPreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    text: string;
  };
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'rad-os',
    name: 'RadOS (Default)',
    description: 'Warm yellow, cream, and sky blue',
    colors: {
      primary: '#FFD60A',
      secondary: '#FFF8E7',
      accent: '#87CEEB',
      surface: '#FFFFFF',
      text: '#1A1A1A',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark purple with gold accents',
    colors: {
      primary: '#9333EA',
      secondary: '#1F1B24',
      accent: '#FDB714',
      surface: '#0F0D13',
      text: '#E5E7EB',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep green with earthy tones',
    colors: {
      primary: '#10B981',
      secondary: '#D1FAE5',
      accent: '#F59E0B',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Blue depths with coral accents',
    colors: {
      primary: '#0EA5E9',
      secondary: '#E0F2FE',
      accent: '#F97316',
      surface: '#FFFFFF',
      text: '#1E293B',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and pink gradient',
    colors: {
      primary: '#F97316',
      secondary: '#FFF7ED',
      accent: '#EC4899',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic black and white',
    colors: {
      primary: '#000000',
      secondary: '#F3F4F6',
      accent: '#6B7280',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
  },
];

export function ThemeCreationWizard({ open, onClose, onComplete }: ThemeCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<WizardFormData>({
    themeName: '',
    themeId: '',
    description: '',
    packageName: '',
    primaryColor: '#FFD60A',
    secondaryColor: '#FFF8E7',
    accentColor: '#87CEEB',
    surfaceColor: '#FFFFFF',
    textColor: '#1A1A1A',
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      themeName: '',
      themeId: '',
      description: '',
      packageName: '',
      primaryColor: '#FFD60A',
      secondaryColor: '#FFF8E7',
      accentColor: '#87CEEB',
      surfaceColor: '#FFFFFF',
      textColor: '#1A1A1A',
    });
    setCurrentStep(1);
    onClose();
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(formData);
    }
    handleCancel();
  };

  // Auto-generate theme ID from theme name (slugify)
  const handleThemeNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      themeName: value,
      themeId: slugify(value),
      packageName: `@radflow/theme-${slugify(value)}`,
    }));
  };

  // Apply color preset
  const handleApplyPreset = (preset: ColorPreset) => {
    setFormData((prev) => ({
      ...prev,
      primaryColor: preset.colors.primary,
      secondaryColor: preset.colors.secondary,
      accentColor: preset.colors.accent,
      surfaceColor: preset.colors.surface,
      textColor: preset.colors.text,
      colorPreset: preset.id,
    }));
  };

  // Validate current step
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.themeName.trim() &&
          formData.themeId.trim() &&
          formData.packageName.trim()
        );
      case 2:
        return !!(
          formData.primaryColor &&
          formData.secondaryColor &&
          formData.accentColor &&
          formData.surfaceColor &&
          formData.textColor
        );
      case 3:
      case 4:
      case 5:
      case 6:
        return true; // Other steps always valid for now
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Theme</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mondwest text-sm text-content-primary/60">
              Step {currentStep} of 6: {STEP_TITLES[currentStep]}
            </span>
          </div>
          {/* Progress Indicator */}
          <div className="flex gap-1 mt-3">
            {([1, 2, 3, 4, 5, 6] as WizardStep[]).map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded transition-colors ${
                  step <= currentStep
                    ? 'bg-accent-primary'
                    : 'bg-surface-secondary/20'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <DialogBody className="overflow-y-auto">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-mondwest text-sm text-content-primary mb-2">
                  Theme Name <span className="text-accent-primary">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.themeName}
                  onChange={(e) => handleThemeNameChange(e.target.value)}
                  placeholder="e.g., Phase One, Midnight"
                  className="w-full"
                />
                <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                  A human-readable name for your theme
                </p>
              </div>

              <div>
                <label className="block font-mondwest text-sm text-content-primary mb-2">
                  Theme ID <span className="text-accent-primary">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.themeId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      themeId: e.target.value,
                      packageName: `@radflow/theme-${e.target.value}`,
                    }))
                  }
                  placeholder="e.g., phase-one, midnight"
                  className="w-full"
                />
                <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                  Auto-generated from theme name. Use lowercase and hyphens.
                </p>
              </div>

              <div>
                <label className="block font-mondwest text-sm text-content-primary mb-2">
                  Package Name <span className="text-accent-primary">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.packageName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, packageName: e.target.value }))
                  }
                  placeholder="e.g., @radflow/theme-phase-one"
                  className="w-full"
                />
                <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                  The npm package name for this theme
                </p>
              </div>

              <div>
                <label className="block font-mondwest text-sm text-content-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe your theme's style and purpose..."
                  className="w-full min-h-[100px] px-3 py-2 bg-surface-primary border border-edge-primary rounded font-mondwest text-sm text-content-primary placeholder:text-content-primary/30 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                  Optional description of your theme
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Colors */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Choose a Preset
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 border rounded text-left transition-all hover:shadow-md ${
                        formData.colorPreset === preset.id
                          ? 'border-accent-primary bg-accent-primary/5'
                          : 'border-edge-primary bg-surface-primary hover:border-accent-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded border border-edge-primary/20"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded border border-edge-primary/20"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded border border-edge-primary/20"
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                        </div>
                      </div>
                      <p className="font-mondwest font-semibold text-sm text-content-primary">
                        {preset.name}
                      </p>
                      <p className="font-mondwest text-xs text-content-primary/60 mt-1">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Customize Colors
                </h4>
                <div className="space-y-4">
                  {/* Primary Color */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block font-mondwest text-sm text-content-primary mb-2">
                        Primary Color
                      </label>
                      <Input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        placeholder="#FFD60A"
                        className="w-full"
                      />
                      <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                        Main brand color, used for buttons and highlights
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-7">
                      <div
                        className="w-16 h-16 rounded border-2 border-edge-primary shadow-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        className="w-16 h-8 rounded border border-edge-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block font-mondwest text-sm text-content-primary mb-2">
                        Secondary Color
                      </label>
                      <Input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondaryColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        placeholder="#FFF8E7"
                        className="w-full"
                      />
                      <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                        Supporting color for backgrounds and subtle elements
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-7">
                      <div
                        className="w-16 h-16 rounded border-2 border-edge-primary shadow-sm"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondaryColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        className="w-16 h-8 rounded border border-edge-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block font-mondwest text-sm text-content-primary mb-2">
                        Accent Color
                      </label>
                      <Input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        placeholder="#87CEEB"
                        className="w-full"
                      />
                      <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                        Used for links, focus states, and call-to-action elements
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-7">
                      <div
                        className="w-16 h-16 rounded border-2 border-edge-primary shadow-sm"
                        style={{ backgroundColor: formData.accentColor }}
                      />
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        className="w-16 h-8 rounded border border-edge-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Surface Color */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block font-mondwest text-sm text-content-primary mb-2">
                        Surface Color
                      </label>
                      <Input
                        type="text"
                        value={formData.surfaceColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            surfaceColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        placeholder="#FFFFFF"
                        className="w-full"
                      />
                      <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                        Background color for cards, panels, and content areas
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-7">
                      <div
                        className="w-16 h-16 rounded border-2 border-edge-primary shadow-sm"
                        style={{ backgroundColor: formData.surfaceColor }}
                      />
                      <input
                        type="color"
                        value={formData.surfaceColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            surfaceColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        className="w-16 h-8 rounded border border-edge-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block font-mondwest text-sm text-content-primary mb-2">
                        Text Color
                      </label>
                      <Input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            textColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        placeholder="#1A1A1A"
                        className="w-full"
                      />
                      <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                        Primary text color for body copy and headings
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-7">
                      <div
                        className="w-16 h-16 rounded border-2 border-edge-primary shadow-sm"
                        style={{ backgroundColor: formData.textColor }}
                      />
                      <input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            textColor: e.target.value,
                            colorPreset: undefined,
                          }))
                        }
                        className="w-16 h-8 rounded border border-edge-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Preview
                </h4>
                <div
                  className="p-6 rounded border-2 border-edge-primary"
                  style={{ backgroundColor: formData.surfaceColor }}
                >
                  <h3
                    className="font-joystix text-lg mb-2"
                    style={{ color: formData.textColor }}
                  >
                    Sample Heading
                  </h3>
                  <p
                    className="font-mondwest text-sm mb-4"
                    style={{ color: formData.textColor }}
                  >
                    This is how your theme colors will look together. The text uses your
                    selected text color, while interactive elements use the primary and
                    accent colors.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded font-mondwest font-semibold text-sm"
                      style={{
                        backgroundColor: formData.primaryColor,
                        color: formData.surfaceColor,
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded font-mondwest font-semibold text-sm border-2"
                      style={{
                        backgroundColor: formData.surfaceColor,
                        color: formData.primaryColor,
                        borderColor: formData.primaryColor,
                      }}
                    >
                      Secondary Button
                    </button>
                    <a
                      href="#"
                      className="px-4 py-2 rounded font-mondwest font-semibold text-sm flex items-center"
                      style={{ color: formData.accentColor }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Typography */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="font-mondwest text-sm text-content-primary/60">
                Typography configuration will be implemented in the next iteration.
              </p>
              <div className="p-8 border-2 border-dashed border-edge-primary/20 rounded text-center">
                <p className="font-joystix text-sm uppercase text-content-primary/40">
                  Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Icons */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="font-mondwest text-sm text-content-primary/60">
                Icon configuration will be implemented in the next iteration.
              </p>
              <div className="p-8 border-2 border-dashed border-edge-primary/20 rounded text-center">
                <p className="font-joystix text-sm uppercase text-content-primary/40">
                  Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="font-mondwest text-sm text-content-primary/60">
                Live preview will be implemented in the next iteration.
              </p>
              <div className="p-8 border-2 border-dashed border-edge-primary/20 rounded text-center">
                <p className="font-joystix text-sm uppercase text-content-primary/40">
                  Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-secondary/10 border border-edge-primary/20 rounded">
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Theme Summary
                </h4>
                <dl className="space-y-2 font-mondwest text-sm">
                  <div className="flex">
                    <dt className="text-content-primary/60 w-32">Name:</dt>
                    <dd className="text-content-primary font-semibold">
                      {formData.themeName}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-content-primary/60 w-32">ID:</dt>
                    <dd className="text-content-primary">{formData.themeId}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-content-primary/60 w-32">Package:</dt>
                    <dd className="text-content-primary">{formData.packageName}</dd>
                  </div>
                  {formData.description && (
                    <div className="flex">
                      <dt className="text-content-primary/60 w-32">Description:</dt>
                      <dd className="text-content-primary">{formData.description}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded">
                <p className="font-mondwest text-sm text-content-primary">
                  Clicking "Create Theme" will scaffold a new theme package with the
                  following structure:
                </p>
                <pre className="mt-2 p-2 bg-surface-primary/50 rounded font-mono text-xs text-content-primary overflow-x-auto">
{`packages/theme-${formData.themeId}/
├── package.json
├── tokens.css
├── dark.css
├── typography.css
├── fonts.css
├── components/
├── assets/
└── agents/`}
                </pre>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}

            {currentStep < 6 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={handleComplete}>
                Create Theme
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Convert string to slug (lowercase, hyphenated)
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
