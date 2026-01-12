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

  // Step 3: Fonts
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  fontPreset?: string;

  // Step 4: Icons
  iconSet: 'rad-os' | 'custom';
  customIcons?: string[]; // List of selected icon names

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

interface FontPreset {
  id: string;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

const FONT_PRESETS: FontPreset[] = [
  {
    id: 'rad-os',
    name: 'RadOS (Default)',
    description: 'Joystix for headings, Mondwest for body, PixelCode for mono',
    fonts: {
      heading: 'Joystix',
      body: 'Mondwest',
      mono: 'PixelCode',
    },
  },
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Clean, contemporary sans-serif throughout',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    description: 'Traditional serif for body, sans for headings',
    fonts: {
      heading: 'Helvetica',
      body: 'Georgia',
      mono: 'Courier New',
    },
  },
  {
    id: 'tech-mono',
    name: 'Tech Monospace',
    description: 'Monospace fonts throughout for tech aesthetic',
    fonts: {
      heading: 'JetBrains Mono',
      body: 'JetBrains Mono',
      mono: 'JetBrains Mono',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun, rounded fonts for creative projects',
    fonts: {
      heading: 'Comic Sans MS',
      body: 'Arial Rounded MT',
      mono: 'Consolas',
    },
  },
];

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
    headingFont: 'Joystix',
    bodyFont: 'Mondwest',
    monoFont: 'PixelCode',
    iconSet: 'rad-os',
  });
  const [availableFonts, setAvailableFonts] = useState<Array<{ family: string; files: Array<{ filename: string; path: string; format: string }> }>>([]);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);

  // Fetch available fonts when dialog opens
  React.useEffect(() => {
    if (open) {
      fetch('/api/devtools/fonts')
        .then((res) => res.json())
        .then((data) => {
          if (data.fonts) {
            setAvailableFonts(data.fonts);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch fonts:', err);
        });

      // Fetch available icons
      fetch('/api/devtools/icons')
        .then((res) => res.json())
        .then((data) => {
          if (data.icons) {
            setAvailableIcons(data.icons);
            // Select all icons by default
            setSelectedIcons(data.icons);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch icons:', err);
        });
    }
  }, [open]);

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
      headingFont: 'Joystix',
      bodyFont: 'Mondwest',
      monoFont: 'PixelCode',
      iconSet: 'rad-os',
    });
    setCurrentStep(1);
    setSelectedIcons([]);
    onClose();
  };

  const handleComplete = () => {
    if (onComplete) {
      // Include selected icons in the final data
      const finalData = {
        ...formData,
        customIcons: formData.iconSet === 'custom' ? selectedIcons : undefined,
      };
      onComplete(finalData);
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

  // Apply font preset
  const handleApplyFontPreset = (preset: FontPreset) => {
    setFormData((prev) => ({
      ...prev,
      headingFont: preset.fonts.heading,
      bodyFont: preset.fonts.body,
      monoFont: preset.fonts.mono,
      fontPreset: preset.id,
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
        return !!(
          formData.headingFont &&
          formData.bodyFont &&
          formData.monoFont
        );
      case 4:
        return !!formData.iconSet && (formData.iconSet === 'rad-os' || (formData.iconSet === 'custom' && selectedIcons.length > 0));
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
            <div className="space-y-6">
              {/* Font Presets */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Choose a Font Preset
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {FONT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyFontPreset(preset)}
                      className={`p-3 border rounded text-left transition-all hover:shadow-md ${
                        formData.fontPreset === preset.id
                          ? 'border-accent-primary bg-accent-primary/5'
                          : 'border-edge-primary bg-surface-primary hover:border-accent-primary/50'
                      }`}
                    >
                      <p className="font-mondwest font-semibold text-sm text-content-primary mb-1">
                        {preset.name}
                      </p>
                      <p className="font-mondwest text-xs text-content-primary/60 mb-2">
                        {preset.description}
                      </p>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-content-primary/50 w-12">H:</span>
                          <span className="font-mondwest text-content-primary">{preset.fonts.heading}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-content-primary/50 w-12">Body:</span>
                          <span className="font-mondwest text-content-primary">{preset.fonts.body}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-content-primary/50 w-12">Mono:</span>
                          <span className="font-mondwest text-content-primary">{preset.fonts.mono}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Font Selection */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Customize Fonts
                </h4>
                <div className="space-y-4">
                  {/* Heading Font */}
                  <div>
                    <label className="block font-mondwest text-sm text-content-primary mb-2">
                      Heading Font <span className="text-accent-primary">*</span>
                    </label>
                    <select
                      value={formData.headingFont}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          headingFont: e.target.value,
                          fontPreset: undefined,
                        }))
                      }
                      className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded font-mondwest text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="">Select a font...</option>
                      {availableFonts.map((font) => (
                        <option key={font.family} value={font.family}>
                          {font.family}
                        </option>
                      ))}
                      {/* System fonts */}
                      <optgroup label="System Fonts">
                        <option value="Inter">Inter</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </optgroup>
                    </select>
                    <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                      Used for h1-h6 headings
                    </p>
                  </div>

                  {/* Body Font */}
                  <div>
                    <label className="block font-mondwest text-sm text-content-primary mb-2">
                      Body Font <span className="text-accent-primary">*</span>
                    </label>
                    <select
                      value={formData.bodyFont}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bodyFont: e.target.value,
                          fontPreset: undefined,
                        }))
                      }
                      className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded font-mondwest text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="">Select a font...</option>
                      {availableFonts.map((font) => (
                        <option key={font.family} value={font.family}>
                          {font.family}
                        </option>
                      ))}
                      {/* System fonts */}
                      <optgroup label="System Fonts">
                        <option value="Inter">Inter</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </optgroup>
                    </select>
                    <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                      Used for paragraphs and body text
                    </p>
                  </div>

                  {/* Monospace Font */}
                  <div>
                    <label className="block font-mondwest text-sm text-content-primary mb-2">
                      Monospace Font <span className="text-accent-primary">*</span>
                    </label>
                    <select
                      value={formData.monoFont}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          monoFont: e.target.value,
                          fontPreset: undefined,
                        }))
                      }
                      className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded font-mondwest text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                      <option value="">Select a font...</option>
                      {availableFonts.map((font) => (
                        <option key={font.family} value={font.family}>
                          {font.family}
                        </option>
                      ))}
                      {/* System fonts */}
                      <optgroup label="System Fonts">
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Consolas">Consolas</option>
                        <option value="Monaco">Monaco</option>
                      </optgroup>
                    </select>
                    <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                      Used for code blocks and pre-formatted text
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Preview
                </h4>
                <div
                  className="p-6 rounded border-2 border-edge-primary space-y-4"
                  style={{ backgroundColor: formData.surfaceColor }}
                >
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: formData.headingFont, color: formData.textColor }}
                  >
                    Sample Heading
                  </h2>
                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: formData.headingFont, color: formData.textColor }}
                  >
                    Subheading Example
                  </h3>
                  <p
                    className="text-base"
                    style={{ fontFamily: formData.bodyFont, color: formData.textColor }}
                  >
                    This is a sample paragraph demonstrating how your body text will look with the
                    selected font. The body font is used throughout most of your content, so choose
                    one that is readable and matches your theme's personality.
                  </p>
                  <pre
                    className="p-3 bg-surface-secondary/10 rounded text-sm overflow-x-auto"
                    style={{ fontFamily: formData.monoFont, color: formData.textColor }}
                  >
{`function example() {
  return "Monospace font";
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Icons */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Icon Set Selection */}
              <div>
                <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                  Choose Icon Set
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Use RadOS Icons */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        iconSet: 'rad-os',
                        customIcons: undefined,
                      }))
                    }
                    className={`p-4 border rounded text-left transition-all hover:shadow-md ${
                      formData.iconSet === 'rad-os'
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-edge-primary bg-surface-primary hover:border-accent-primary/50'
                    }`}
                  >
                    <p className="font-mondwest font-semibold text-sm text-content-primary mb-1">
                      RadOS Icons (Default)
                    </p>
                    <p className="font-mondwest text-xs text-content-primary/60 mb-3">
                      Use the complete RadOS icon library ({availableIcons.length} icons)
                    </p>
                    {/* Show sample icons */}
                    <div className="flex gap-2 flex-wrap">
                      {availableIcons.slice(0, 8).map((icon) => (
                        <div
                          key={icon}
                          className="w-6 h-6 p-1 bg-surface-secondary/20 rounded flex items-center justify-center"
                          title={icon}
                        >
                          <img
                            src={`/assets/icons/${icon}.svg`}
                            alt={icon}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </button>

                  {/* Custom Icon Selection */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        iconSet: 'custom',
                        customIcons: selectedIcons,
                      }))
                    }
                    className={`p-4 border rounded text-left transition-all hover:shadow-md ${
                      formData.iconSet === 'custom'
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-edge-primary bg-surface-primary hover:border-accent-primary/50'
                    }`}
                  >
                    <p className="font-mondwest font-semibold text-sm text-content-primary mb-1">
                      Custom Selection
                    </p>
                    <p className="font-mondwest text-xs text-content-primary/60 mb-3">
                      Choose specific icons for your theme
                    </p>
                    <p className="font-mondwest text-xs text-accent-primary">
                      {selectedIcons.length} icons selected
                    </p>
                  </button>
                </div>
              </div>

              {/* Custom Icon Selection Grid */}
              {formData.iconSet === 'custom' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-joystix text-sm uppercase text-content-primary">
                      Select Icons ({selectedIcons.length}/{availableIcons.length})
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIcons(availableIcons)}
                        className="px-3 py-1 text-xs font-mondwest text-accent-primary hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedIcons([])}
                        className="px-3 py-1 text-xs font-mondwest text-content-primary/60 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto p-4 border border-edge-primary/20 rounded bg-surface-secondary/5">
                    <div className="grid grid-cols-6 gap-3">
                      {availableIcons.map((icon) => {
                        const isSelected = selectedIcons.includes(icon);
                        return (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedIcons(selectedIcons.filter((i) => i !== icon));
                              } else {
                                setSelectedIcons([...selectedIcons, icon]);
                              }
                            }}
                            className={`p-3 border rounded transition-all hover:shadow-sm group ${
                              isSelected
                                ? 'border-accent-primary bg-accent-primary/10'
                                : 'border-edge-primary/20 bg-surface-primary hover:border-accent-primary/50'
                            }`}
                            title={icon}
                          >
                            <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                              <img
                                src={`/assets/icons/${icon}.svg`}
                                alt={icon}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="font-mondwest text-[10px] text-content-primary/60 text-center truncate group-hover:text-content-primary">
                              {icon}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Selected Icons */}
              {formData.iconSet === 'rad-os' && (
                <div>
                  <h4 className="font-joystix text-sm uppercase text-content-primary mb-3">
                    Icon Library Preview
                  </h4>
                  <div className="p-4 border border-edge-primary/20 rounded bg-surface-secondary/5">
                    <div className="grid grid-cols-8 gap-2">
                      {availableIcons.slice(0, 24).map((icon) => (
                        <div
                          key={icon}
                          className="p-2 rounded hover:bg-surface-primary transition-colors group"
                          title={icon}
                        >
                          <div className="w-6 h-6 mx-auto">
                            <img
                              src={`/assets/icons/${icon}.svg`}
                              alt={icon}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="font-mondwest text-xs text-content-primary/50 text-center mt-3">
                      Showing 24 of {availableIcons.length} icons
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-joystix text-sm uppercase text-content-primary">
                  Live Preview
                </h4>
                <p className="font-mondwest text-xs text-content-primary/60">
                  See how your theme will look in action
                </p>
              </div>

              {/* Preview Container with Theme Applied */}
              <div
                className="border-2 border-edge-primary rounded-lg overflow-hidden"
                style={{
                  backgroundColor: formData.surfaceColor,
                  color: formData.textColor,
                }}
              >
                {/* Variables Preview Section */}
                <div className="p-6 border-b border-edge-primary/20">
                  <h5
                    className="font-semibold text-base mb-4"
                    style={{ fontFamily: formData.headingFont }}
                  >
                    Variables
                  </h5>
                  <div className="grid grid-cols-5 gap-3">
                    {/* Primary Color */}
                    <div className="space-y-2">
                      <div
                        className="w-full h-20 rounded border border-edge-primary/20 shadow-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <p
                        className="text-xs text-center"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Primary
                      </p>
                      <p
                        className="text-[10px] text-center opacity-60 font-mono"
                        style={{ fontFamily: formData.monoFont }}
                      >
                        {formData.primaryColor}
                      </p>
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-2">
                      <div
                        className="w-full h-20 rounded border border-edge-primary/20 shadow-sm"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <p
                        className="text-xs text-center"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Secondary
                      </p>
                      <p
                        className="text-[10px] text-center opacity-60 font-mono"
                        style={{ fontFamily: formData.monoFont }}
                      >
                        {formData.secondaryColor}
                      </p>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-2">
                      <div
                        className="w-full h-20 rounded border border-edge-primary/20 shadow-sm"
                        style={{ backgroundColor: formData.accentColor }}
                      />
                      <p
                        className="text-xs text-center"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Accent
                      </p>
                      <p
                        className="text-[10px] text-center opacity-60 font-mono"
                        style={{ fontFamily: formData.monoFont }}
                      >
                        {formData.accentColor}
                      </p>
                    </div>

                    {/* Surface Color */}
                    <div className="space-y-2">
                      <div
                        className="w-full h-20 rounded border border-edge-primary/20 shadow-sm"
                        style={{ backgroundColor: formData.surfaceColor }}
                      />
                      <p
                        className="text-xs text-center"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Surface
                      </p>
                      <p
                        className="text-[10px] text-center opacity-60 font-mono"
                        style={{ fontFamily: formData.monoFont }}
                      >
                        {formData.surfaceColor}
                      </p>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                      <div
                        className="w-full h-20 rounded border border-edge-primary/20 shadow-sm"
                        style={{ backgroundColor: formData.textColor }}
                      />
                      <p
                        className="text-xs text-center"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Text
                      </p>
                      <p
                        className="text-[10px] text-center opacity-60 font-mono"
                        style={{ fontFamily: formData.monoFont }}
                      >
                        {formData.textColor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Typography Preview Section */}
                <div className="p-6 border-b border-edge-primary/20">
                  <h5
                    className="font-semibold text-base mb-4"
                    style={{ fontFamily: formData.headingFont }}
                  >
                    Typography
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <h1
                        className="text-4xl font-bold mb-1"
                        style={{ fontFamily: formData.headingFont }}
                      >
                        Heading 1
                      </h1>
                      <p
                        className="text-xs opacity-60"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Font: {formData.headingFont}
                      </p>
                    </div>

                    <div>
                      <h2
                        className="text-3xl font-bold mb-1"
                        style={{ fontFamily: formData.headingFont }}
                      >
                        Heading 2
                      </h2>
                      <p
                        className="text-xs opacity-60"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Font: {formData.headingFont}
                      </p>
                    </div>

                    <div>
                      <h3
                        className="text-2xl font-semibold mb-1"
                        style={{ fontFamily: formData.headingFont }}
                      >
                        Heading 3
                      </h3>
                      <p
                        className="text-xs opacity-60"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Font: {formData.headingFont}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-base mb-1"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Body text: The quick brown fox jumps over the lazy dog. This
                        demonstrates how your body text will appear with the selected font.
                      </p>
                      <p
                        className="text-xs opacity-60"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Font: {formData.bodyFont}
                      </p>
                    </div>

                    <div>
                      <pre
                        className="p-3 rounded text-sm overflow-x-auto"
                        style={{
                          fontFamily: formData.monoFont,
                          backgroundColor: `${formData.textColor}10`,
                        }}
                      >
{`function example() {
  return "Monospace font";
}`}
                      </pre>
                      <p
                        className="text-xs opacity-60 mt-1"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Font: {formData.monoFont}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Components Preview Section */}
                <div className="p-6">
                  <h5
                    className="font-semibold text-base mb-4"
                    style={{ fontFamily: formData.headingFont }}
                  >
                    Components
                  </h5>
                  <div className="space-y-6">
                    {/* Buttons */}
                    <div>
                      <p
                        className="text-sm font-semibold mb-3"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Buttons
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          type="button"
                          className="px-4 py-2 rounded font-semibold text-sm transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: formData.primaryColor,
                            color: formData.surfaceColor,
                            fontFamily: formData.bodyFont,
                          }}
                        >
                          Primary Button
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded font-semibold text-sm border-2 transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: formData.surfaceColor,
                            color: formData.primaryColor,
                            borderColor: formData.primaryColor,
                            fontFamily: formData.bodyFont,
                          }}
                        >
                          Secondary Button
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded font-semibold text-sm transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: formData.accentColor,
                            color: formData.surfaceColor,
                            fontFamily: formData.bodyFont,
                          }}
                        >
                          Accent Button
                        </button>
                      </div>
                    </div>

                    {/* Card */}
                    <div>
                      <p
                        className="text-sm font-semibold mb-3"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Card
                      </p>
                      <div
                        className="p-4 rounded border shadow-sm"
                        style={{
                          backgroundColor: formData.secondaryColor,
                          borderColor: `${formData.textColor}20`,
                        }}
                      >
                        <h4
                          className="text-lg font-semibold mb-2"
                          style={{ fontFamily: formData.headingFont }}
                        >
                          Card Title
                        </h4>
                        <p
                          className="text-sm mb-3"
                          style={{ fontFamily: formData.bodyFont }}
                        >
                          This is a sample card component demonstrating how content will look
                          within a card using your theme colors and typography.
                        </p>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: formData.primaryColor,
                            color: formData.surfaceColor,
                            fontFamily: formData.bodyFont,
                          }}
                        >
                          Action
                        </button>
                      </div>
                    </div>

                    {/* Form Elements */}
                    <div>
                      <p
                        className="text-sm font-semibold mb-3"
                        style={{ fontFamily: formData.bodyFont }}
                      >
                        Form Elements
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ fontFamily: formData.bodyFont }}
                          >
                            Text Input
                          </label>
                          <input
                            type="text"
                            placeholder="Enter text..."
                            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: formData.surfaceColor,
                              borderColor: `${formData.textColor}30`,
                              color: formData.textColor,
                              fontFamily: formData.bodyFont,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="flex items-center gap-2 text-sm"
                            style={{ fontFamily: formData.bodyFont }}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded"
                              style={{
                                accentColor: formData.accentColor,
                              }}
                            />
                            Checkbox option
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Icons (if selected) */}
                    {formData.iconSet && (
                      <div>
                        <p
                          className="text-sm font-semibold mb-3"
                          style={{ fontFamily: formData.bodyFont }}
                        >
                          Icons ({formData.iconSet === 'rad-os' ? 'Complete Set' : `${selectedIcons.length} Selected`})
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {(formData.iconSet === 'rad-os' ? availableIcons.slice(0, 12) : selectedIcons.slice(0, 12)).map((icon) => (
                            <div
                              key={icon}
                              className="w-8 h-8 p-1.5 rounded flex items-center justify-center"
                              style={{
                                backgroundColor: `${formData.primaryColor}15`,
                              }}
                              title={icon}
                            >
                              <img
                                src={`/assets/icons/${icon}.svg`}
                                alt={icon}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info message */}
              <div
                className="p-4 rounded border"
                style={{
                  backgroundColor: `${formData.accentColor}10`,
                  borderColor: `${formData.accentColor}30`,
                }}
              >
                <p
                  className="text-sm"
                  style={{ fontFamily: formData.bodyFont, color: formData.textColor }}
                >
                  This preview shows how your theme will look when applied to your application.
                  You can go back to adjust colors, typography, or icons before creating the theme.
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
