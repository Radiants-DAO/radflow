'use client';

import React, { useState } from 'react';
import {
  Alert,
  Badge,
  BadgeGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Label,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TabContent,
  TabList,
  TabTrigger,
  Tabs,
  TextArea,
  ToastProvider,
  useToast
} from '../components/core';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/core/Dialog';

// ============================================================================
// Section Component
// ============================================================================

function Section({
  title,
  children,
  variant = 'h3',
  subsectionId,
  className,
  'data-edit-scope': editScope,
  'data-component': component,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'h3' | 'h4';
  subsectionId?: string;
  className?: string;
  'data-edit-scope'?: string;
  'data-component'?: string;
}) {
  const HeadingTag = variant === 'h4' ? 'h4' : 'h3';
  const hasMarginOverride = className?.includes('mb-');
  const isSubsection = variant === 'h4';
  const subsectionClasses = isSubsection ? 'p-4 border border-[rgba(243,238,217,0.2)] bg-[rgba(243,238,217,0.02)]' : '';
  const baseClasses = `${hasMarginOverride ? '' : 'mb-4'} ${subsectionClasses} rounded flex flex-col gap-4`.trim();
  return (
    <div
      className={`${baseClasses} ${className || ''}`}
      data-subsection-id={subsectionId}
      data-edit-scope={editScope}
      data-component={component}
      {...rest}
    >
      <HeadingTag className="font-audiowide text-[#f3eed9]">{title}</HeadingTag>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Row({ children, props }: { children: React.ReactNode; props?: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {props && <code className="text-[rgba(243,238,217,0.5)] text-xs font-kodemono">{props}</code>}
    </div>
  );
}

// ============================================================================
// Toast Demo
// ============================================================================

function ToastDemo() {
  const { addToast } = useToast();

  return (
    <Row>
      <Button
        variant="default"
        onClick={() => addToast({ title: 'Default Toast', description: 'This is a default notification.' })}
      >
        Default
      </Button>
      <Button
        variant="green"
        onClick={() => addToast({ title: 'Success!', description: 'Operation completed.', variant: 'success' })}
      >
        Success
      </Button>
      <Button
        variant="gold"
        onClick={() => addToast({ title: 'Warning', description: 'Please review this.', variant: 'warning' })}
      >
        Warning
      </Button>
      <Button
        variant="default"
        onClick={() => addToast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })}
      >
        Error
      </Button>
      <Button
        variant="blue"
        onClick={() => addToast({ title: 'Info', description: 'Here is some information.', variant: 'info' })}
      >
        Info
      </Button>
    </Row>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function PhaseUITab() {
  const [sliderValue, setSliderValue] = useState(50);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');

  return (
    <ToastProvider>
      <div className="p-6 space-y-8 bg-[#14141e] min-h-screen font-outfit text-[#f3eed9]">
        {/* Buttons Section */}
        <Section title="Buttons" subsectionId="buttons">
          <Section title="Variants" variant="h4" subsectionId="button-variants">
            <Row>
              <Button
                variant="default"
                data-edit-scope="component-definition"
                data-component="Button"
              >
                Default
              </Button>
              <Button
                variant="blue"
                data-edit-scope="component-definition"
                data-component="Button"
                data-edit-variant="blue"
              >
                Blue
              </Button>
              <Button
                variant="purple"
                data-edit-scope="component-definition"
                data-component="Button"
                data-edit-variant="purple"
              >
                Purple
              </Button>
              <Button
                variant="green"
                data-edit-scope="component-definition"
                data-component="Button"
                data-edit-variant="green"
              >
                Green
              </Button>
              <Button
                variant="gold"
                data-edit-scope="component-definition"
                data-component="Button"
                data-edit-variant="gold"
              >
                Gold
              </Button>
              <Button
                variant="ghost"
                data-edit-scope="component-definition"
                data-component="Button"
                data-edit-variant="ghost"
              >
                Ghost
              </Button>
            </Row>
          </Section>

          <Section title="Sizes" variant="h4" subsectionId="button-sizes">
            <Row>
              <Button variant="purple" size="sm">Small</Button>
              <Button variant="purple" size="md">Medium</Button>
              <Button variant="purple" size="lg">Large</Button>
            </Row>
          </Section>
        </Section>

        {/* Forms Section */}
        <Section title="Forms" subsectionId="forms">
          <Section title="Input" variant="h4" subsectionId="input">
            <Row>
              <Input
                placeholder="Default input"
                data-edit-scope="component-definition"
                data-component="Input"
              />
            </Row>
            <Row>
              <Input placeholder="With icon" iconName="search" />
            </Row>
            <Row>
              <TextArea placeholder="Textarea input..." />
            </Row>
          </Section>

          <Section title="Select" variant="h4" subsectionId="select">
            <Row>
              <Select
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Select an option..."
                data-edit-scope="component-definition"
                data-component="Select"
              />
            </Row>
          </Section>

          <Section title="Checkbox & Radio" variant="h4" subsectionId="checkbox-radio">
            <Row>
              <Checkbox
                label="Checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                data-edit-scope="component-definition"
                data-component="Checkbox"
              />
            </Row>
            <Row>
              <RadioGroup name="demo" value={radioValue} onChange={setRadioValue}>
                <Radio value="option1" label="Option 1" />
                <Radio value="option2" label="Option 2" />
                <Radio value="option3" label="Option 3" />
              </RadioGroup>
            </Row>
          </Section>

          <Section title="Switch" variant="h4" subsectionId="switch">
            <Row>
              <Switch
                checked={switchChecked}
                onChange={setSwitchChecked}
                label="Toggle switch"
                data-edit-scope="component-definition"
                data-component="Switch"
              />
            </Row>
          </Section>

          <Section title="Slider" variant="h4" subsectionId="slider">
            <Row>
              <div className="w-64">
                <Slider
                  value={sliderValue}
                  onChange={setSliderValue}
                  min={0}
                  max={100}
                  showValue
                  label="Volume"
                  data-edit-scope="component-definition"
                  data-component="Slider"
                />
              </div>
            </Row>
          </Section>
        </Section>

        {/* Feedback Section */}
        <Section title="Feedback" subsectionId="feedback">
          <Section title="Alerts" variant="h4" subsectionId="alerts">
            <Alert
              variant="default"
              title="Default Alert"
              data-edit-scope="component-definition"
              data-component="Alert"
            >
              This is a default alert message.
            </Alert>
            <Alert variant="success" title="Success">
              Operation completed successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review the changes.
            </Alert>
            <Alert variant="error" title="Error">
              An error occurred.
            </Alert>
            <Alert variant="info" title="Info">
              Here is some useful information.
            </Alert>
          </Section>

          <Section title="Badges" variant="h4" subsectionId="badges">
            <Row>
              <Badge variant="default">Default</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </Row>
          </Section>

          <Section title="Toasts" variant="h4" subsectionId="toasts">
            <ToastDemo />
          </Section>
        </Section>

        {/* Overlays Section */}
        <Section title="Overlays" subsectionId="overlays">
          <Section title="Dialog" variant="h4" subsectionId="dialog">
            <Row>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="purple">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Phase Dialog</DialogTitle>
                    <DialogDescription>
                      This is a glass-effect dialog with warm cream aesthetics.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <p className="text-[rgba(243,238,217,0.8)]">
                      Dialog body content goes here. The Phase theme uses translucent backgrounds
                      and subtle borders to create a modern, sophisticated appearance.
                    </p>
                  </DialogBody>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="purple">Confirm</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Row>
          </Section>
        </Section>

        {/* Navigation Section */}
        <Section title="Navigation" subsectionId="navigation">
          <Section title="Tabs" variant="h4" subsectionId="tabs">
            <Tabs defaultValue="tab1" variant="pill">
              <TabList>
                <TabTrigger value="tab1">Overview</TabTrigger>
                <TabTrigger value="tab2">Details</TabTrigger>
                <TabTrigger value="tab3">Settings</TabTrigger>
              </TabList>
              <TabContent value="tab1" className="p-4">
                <p className="text-[rgba(243,238,217,0.8)]">Overview content</p>
              </TabContent>
              <TabContent value="tab2" className="p-4">
                <p className="text-[rgba(243,238,217,0.8)]">Details content</p>
              </TabContent>
              <TabContent value="tab3" className="p-4">
                <p className="text-[rgba(243,238,217,0.8)]">Settings content</p>
              </TabContent>
            </Tabs>
          </Section>
        </Section>

        {/* Cards Section */}
        <Section title="Cards" subsectionId="cards">
          <Row>
            <Card className="w-80 bg-[rgba(243,238,217,0.05)] border border-[rgba(243,238,217,0.2)]">
              <CardHeader>
                <h4 className="font-audiowide text-[#f3eed9]">Phase Card</h4>
              </CardHeader>
              <CardBody>
                <p className="text-[rgba(243,238,217,0.7)]">
                  Cards use the glass-effect styling with subtle backgrounds and cream-colored borders.
                </p>
              </CardBody>
              <CardFooter className="border-t border-[rgba(243,238,217,0.1)]">
                <Button variant="purple" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </Row>
        </Section>
      </div>
    </ToastProvider>
  );
}
