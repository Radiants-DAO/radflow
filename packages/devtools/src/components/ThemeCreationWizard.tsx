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

  // Step 2: Colors (to be implemented)
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

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

export function ThemeCreationWizard({ open, onClose, onComplete }: ThemeCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<WizardFormData>({
    themeName: '',
    themeId: '',
    description: '',
    packageName: '',
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
            <div className="space-y-4">
              <p className="font-mondwest text-sm text-content-primary/60">
                Color configuration will be implemented in the next iteration.
              </p>
              <div className="p-8 border-2 border-dashed border-edge-primary/20 rounded text-center">
                <p className="font-joystix text-sm uppercase text-content-primary/40">
                  Coming Soon
                </p>
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
