# Customizing AutoForm Submit Buttons

This guide shows you how to customize submit buttons and add additional buttons to the JSONForm component built on uniforms.

## Table of Contents

1. [Default Buttons](#default-buttons)
2. [Using Built-in Submit Field](#using-built-in-submit-field)
3. [Custom Submit Field](#custom-submit-field)
4. [Hiding Default Buttons](#hiding-default-buttons)
5. [Modal Forms with Custom Buttons](#modal-forms-with-custom-buttons)
6. [Advanced Examples](#advanced-examples)

## Default Buttons

By default, JSONForm renders Cancel and Submit buttons:

```tsx
import { JSONForm } from "rjs-admin";

<JSONForm
  schema={userSchema}
  onSubmit={(data) => console.log("Submitted:", data)}
  onCancel={() => console.log("Cancelled")}
/>;
```

## Using Built-in Submit Field

The easiest way to customize buttons is using the built-in `SubmitField` component:

### Basic Customization

```tsx
import { JSONForm, SubmitField } from "rjs-admin";

<JSONForm
  schema={userSchema}
  submitField={SubmitField}
  submitFieldProps={{
    submitLabel: "Create User",
    cancelLabel: "Go Back",
    showSave: true,
    showReset: true,
    onSave: () => console.log("Save draft"),
    onReset: () => console.log("Reset form"),
  }}
  onSubmit={(data) => console.log("User created:", data)}
  onCancel={() => console.log("Cancelled")}
/>;
```

### Adding Custom Buttons

```tsx
<JSONForm
  schema={userSchema}
  submitField={SubmitField}
  submitFieldProps={{
    submitLabel: "Publish Product",
    customButtons: [
      {
        label: "Save Draft",
        onClick: () => console.log("Save as draft"),
        variant: "outline",
      },
      {
        label: "Preview",
        onClick: () => console.log("Preview product"),
        variant: "ghost",
      },
      {
        label: "Delete",
        onClick: () => console.log("Delete product"),
        variant: "destructive",
      },
    ],
  }}
  onSubmit={(data) => console.log("Published:", data)}
/>
```

### SubmitFieldProps Interface

```tsx
interface SubmitFieldProps {
  disabled?: boolean;
  readOnly?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  showSave?: boolean;
  showReset?: boolean;
  customButtons?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive";
    type?: "button" | "submit";
  }>;
  className?: string;
}
```

## Custom Submit Field

For complete control, create your own submit field component:

```tsx
import { Button } from "rjs-admin";

function CustomSubmitField({ disabled, onCancel, onSubmit }) {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div className="text-sm text-gray-500">Auto-save enabled</div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => console.log("Save draft")}>
          Save Draft
        </Button>
        <Button type="submit" disabled={disabled}>
          Submit for Review
        </Button>
      </div>
    </div>
  );
}

// Use it in your form
<JSONForm
  schema={schema}
  submitField={CustomSubmitField}
  onSubmit={(data) => console.log("Submitted:", data)}
/>;
```

## Hiding Default Buttons

To completely control button rendering, hide the default buttons:

```tsx
<JSONForm
  schema={userSchema}
  hideDefaultButtons={true}
  bottomContent={
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => console.log("Custom cancel")}>
        Cancel
      </Button>
      <Button onClick={() => console.log("Custom submit")}>Submit</Button>
    </div>
  }
  onSubmit={(data) => console.log("Submitted:", data)}
/>
```

## Modal Forms with Custom Buttons

Custom buttons work seamlessly with modal forms:

```tsx
function ModalWithCustomButtons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Form</Button>

      <JSONForm
        modal={true}
        open={open}
        onOpenChange={setOpen}
        schema={userSchema}
        submitField={SubmitField}
        submitFieldProps={{
          submitLabel: "Create & Close",
          showSave: true,
          onSave: () => console.log("Save and keep open"),
          customButtons: [
            {
              label: "Create & Add Another",
              onClick: () => {
                console.log("Create and add another");
                // Don't close modal, reset form instead
              },
              variant: "outline",
            },
          ],
        }}
        onSubmit={(data) => {
          console.log("Submitted:", data);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
```

## Advanced Examples

### Workflow Buttons

```tsx
<JSONForm
  schema={documentSchema}
  submitField={SubmitField}
  submitFieldProps={{
    submitLabel: "Publish",
    showSave: true,
    onSave: () => saveDraft(),
    customButtons: [
      {
        label: "Submit for Review",
        onClick: () => submitForReview(),
        variant: "outline",
      },
      {
        label: "Schedule",
        onClick: () => openScheduleModal(),
        variant: "ghost",
      },
    ],
  }}
/>
```

### Admin Actions

```tsx
<JSONForm
  schema={userSchema}
  data={existingUser}
  submitField={SubmitField}
  submitFieldProps={{
    submitLabel: "Save Changes",
    showReset: true,
    onReset: () => resetToDefaults(),
    customButtons: [
      {
        label: "Send Email",
        onClick: () => sendEmail(),
        variant: "outline",
      },
      {
        label: "Delete User",
        onClick: () => confirmDelete(),
        variant: "destructive",
      },
    ],
  }}
/>
```

### Conditional Buttons

```tsx
function ConditionalButtonsForm({ userRole, formData }) {
  const getCustomButtons = () => {
    const buttons = [];

    if (userRole === "admin") {
      buttons.push({
        label: "Force Approve",
        onClick: () => forceApprove(),
        variant: "default",
      });
    }

    if (formData?.status === "draft") {
      buttons.push({
        label: "Submit for Review",
        onClick: () => submitForReview(),
        variant: "outline",
      });
    }

    return buttons;
  };

  return (
    <JSONForm
      schema={schema}
      data={formData}
      submitField={SubmitField}
      submitFieldProps={{
        customButtons: getCustomButtons(),
      }}
    />
  );
}
```

## Button Styling

All buttons use the Button component's variant system:

- `default`: Primary blue button
- `outline`: Outlined button
- `ghost`: Transparent button
- `destructive`: Red button for dangerous actions

## Form Integration

The submit field integrates with uniforms' form lifecycle:

- `disabled` and `readOnly` props are automatically passed from the form
- The submit button automatically triggers form validation
- Custom buttons can access form state through props or context

## Best Practices

1. **Use semantic button labels** that clearly describe the action
2. **Order buttons by importance** (most important on the right)
3. **Use appropriate variants** for different action types
4. **Provide feedback** for all button actions
5. **Consider disabled states** for form validation
6. **Test accessibility** with keyboard navigation
