import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "../src/components/common/Button";
import {
  createValidator,
  JSONForm,
  TailwindSubmitField,
} from "../src/components/form";

const meta: Meta<typeof JSONForm> = {
  title: "Forms/JSONForm",
  component: JSONForm,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A schema-driven form component built on top of the uniforms library. Supports JSON Schema validation, modal mode, and custom content areas.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    schema: {
      description: "JSON Schema object defining the form structure",
      control: { type: "object" },
    },
    data: {
      description: "Initial form data",
      control: { type: "object" },
    },
    modal: {
      description: "Whether to render the form in a modal dialog",
      control: { type: "boolean" },
    },
    validate: {
      description: "When to trigger validation",
      control: { type: "select" },
      options: ["onChange", "onSubmit", "onChangeAfterSubmit", "never"],
    },
    showInlineError: {
      description: "Whether to show validation errors inline",
      control: { type: "boolean" },
    },
    disabled: {
      description: "Whether the form is disabled",
      control: { type: "boolean" },
    },
    readOnly: {
      description: "Whether the form is read-only",
      control: { type: "boolean" },
    },
    hideDefaultButtons: {
      description: "Whether to hide the default submit/cancel buttons",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic user schema
const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      description: "Enter your full name",
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: "string",
      title: "Email Address",
      description: "Enter a valid email address",
      format: "email",
    },
    age: {
      type: "integer",
      title: "Age",
      description: "Your age in years",
      minimum: 18,
      maximum: 120,
    },
    role: {
      type: "string",
      title: "Role",
      description: "Select your role",
      enum: ["admin", "user", "moderator", "guest"],
    },
    bio: {
      type: "string",
      title: "Biography",
      description: "Tell us about yourself",
      maxLength: 500,
    },
    isActive: {
      type: "boolean",
      title: "Active Status",
      description: "Whether this user is active",
    },
  },
  required: ["name", "email", "role"],
};

// Product schema
const productSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Product Title",
      description: "Enter the product name",
      minLength: 1,
      maxLength: 100,
    },
    price: {
      type: "number",
      title: "Price",
      description: "Product price in dollars",
      minimum: 0,
    },
    category: {
      type: "string",
      title: "Category",
      description: "Select product category",
      enum: ["electronics", "clothing", "books", "home", "sports"],
    },
    description: {
      type: "string",
      title: "Description",
      description: "Product description",
      maxLength: 1000,
    },
    inStock: {
      type: "boolean",
      title: "In Stock",
      description: "Whether the product is currently in stock",
    },
  },
  required: ["title", "price", "category"],
};

// Complex nested schema
const complexSchema = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      title: "Personal Information",
      properties: {
        firstName: {
          type: "string",
          title: "First Name",
          minLength: 1,
        },
        lastName: {
          type: "string",
          title: "Last Name",
          minLength: 1,
        },
        dateOfBirth: {
          type: "string",
          title: "Date of Birth",
          format: "date",
        },
      },
      required: ["firstName", "lastName"],
    },
    contactInfo: {
      type: "object",
      title: "Contact Information",
      properties: {
        email: {
          type: "string",
          title: "Email",
          format: "email",
        },
        phone: {
          type: "string",
          title: "Phone Number",
          pattern: "^[0-9-+() ]+$",
        },
        address: {
          type: "object",
          title: "Address",
          properties: {
            street: { type: "string", title: "Street" },
            city: { type: "string", title: "City" },
            state: { type: "string", title: "State" },
            zipCode: { type: "string", title: "ZIP Code" },
          },
        },
      },
      required: ["email"],
    },
    preferences: {
      type: "object",
      title: "Preferences",
      properties: {
        newsletter: {
          type: "boolean",
          title: "Subscribe to Newsletter",
        },
        notifications: {
          type: "array",
          title: "Notification Types",
          items: {
            type: "string",
            enum: ["email", "sms", "push"],
          },
        },
        theme: {
          type: "string",
          title: "Theme Preference",
          enum: ["light", "dark", "auto"],
          default: "auto",
        },
      },
    },
  },
  required: ["personalInfo", "contactInfo"],
};

export const BasicUserForm: Story = {
  args: {
    schema: userSchema,
    title: "User Registration",
    onSubmit: (data) => console.log("Form submitted:", data),
    onCancel: () => console.log("Form cancelled"),
  },
};

export const ProductForm: Story = {
  args: {
    schema: productSchema,
    title: "Add Product",
    onSubmit: (data) => console.log("Product submitted:", data),
    onCancel: () => console.log("Product form cancelled"),
  },
};

export const ComplexNestedForm: Story = {
  args: {
    schema: complexSchema,
    title: "Complex Registration Form",
    onSubmit: (data) => console.log("Complex form submitted:", data),
    onCancel: () => console.log("Complex form cancelled"),
  },
};

export const WithInitialData: Story = {
  args: {
    schema: userSchema,
    title: "Edit User",
    data: {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      role: "user",
      bio: "Software developer with 5 years of experience.",
      isActive: true,
    },
    onSubmit: (data) => console.log("User updated:", data),
    onCancel: () => console.log("Edit cancelled"),
  },
};

export const WithCustomContent: Story = {
  args: {
    schema: userSchema,
    title: "User Registration with Custom Content",
    topContent: (
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700">
          Welcome! Please fill out the form below to create your account.
        </p>
      </div>
    ),
    bottomContent: (
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-600">
          By submitting this form, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    ),
    onSubmit: (data) => console.log("User registered:", data),
    onCancel: () => console.log("Registration cancelled"),
  },
};

export const ValidationOnSubmit: Story = {
  args: {
    schema: userSchema,
    title: "Validation on Submit",
    validate: "onSubmit",
    showInlineError: true,
    onSubmit: (data) => console.log("Form submitted:", data),
    onCancel: () => console.log("Form cancelled"),
  },
};

export const DisabledForm: Story = {
  args: {
    schema: userSchema,
    title: "Disabled Form",
    disabled: true,
    data: {
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
    onSubmit: (data) => console.log("Form submitted:", data),
    onCancel: () => console.log("Form cancelled"),
  },
};

export const ReadOnlyForm: Story = {
  args: {
    schema: userSchema,
    title: "Read-Only Form",
    readOnly: true,
    data: {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      role: "user",
      bio: "Software developer with 5 years of experience.",
      isActive: true,
    },
    onSubmit: (data) => console.log("Form submitted:", data),
    onCancel: () => console.log("Form cancelled"),
  },
};

// Custom Submit Button Stories
export const CustomSubmitButtons: Story = {
  args: {
    schema: userSchema,
    title: "Form with Custom Submit Buttons",
    submitField: TailwindSubmitField,
    submitFieldProps: {
      submitLabel: "Create User",
      cancelLabel: "Go Back",
      showSave: true,
      showReset: true,
      onSave: () => console.log("Save draft clicked"),
      onReset: () => console.log("Reset form clicked"),
      customButtons: [
        {
          label: "Preview",
          onClick: () => console.log("Preview clicked"),
          variant: "outline" as const,
        },
        {
          label: "Export",
          onClick: () => console.log("Export clicked"),
          variant: "ghost" as const,
        },
      ],
    },
    onSubmit: (data) => console.log("User created:", data),
    onCancel: () => console.log("Form cancelled"),
  },
};

export const AdminFormButtons: Story = {
  args: {
    schema: userSchema,
    title: "Admin User Management",
    submitField: TailwindSubmitField,
    submitFieldProps: {
      submitLabel: "Save Changes",
      cancelLabel: "Cancel",
      showSave: false,
      showReset: true,
      onReset: () => console.log("Reset to defaults"),
      customButtons: [
        {
          label: "Delete User",
          onClick: () => console.log("Delete user clicked"),
          variant: "destructive" as const,
        },
        {
          label: "Send Email",
          onClick: () => console.log("Send email clicked"),
          variant: "outline" as const,
        },
        {
          label: "View Profile",
          onClick: () => console.log("View profile clicked"),
          variant: "ghost" as const,
        },
      ],
    },
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
    },
    onSubmit: (data) => console.log("Admin form submitted:", data),
    onCancel: () => console.log("Admin form cancelled"),
  },
};

export const WorkflowButtons: Story = {
  args: {
    schema: productSchema,
    title: "Product Workflow",
    submitField: TailwindSubmitField,
    submitFieldProps: {
      submitLabel: "Publish Product",
      cancelLabel: "Discard",
      showSave: true,
      showReset: false,
      onSave: () => console.log("Save as draft"),
      customButtons: [
        {
          label: "Submit for Review",
          onClick: () => console.log("Submit for review"),
          variant: "outline" as const,
        },
        {
          label: "Schedule Publication",
          onClick: () => console.log("Schedule publication"),
          variant: "outline" as const,
        },
      ],
    },
    onSubmit: (data) => console.log("Product published:", data),
    onCancel: () => console.log("Product discarded"),
  },
};

export const HiddenDefaultButtons: Story = {
  args: {
    schema: userSchema,
    title: "Form with Hidden Default Buttons",
    hideDefaultButtons: true,
    onSubmit: (data) => console.log("Form submitted:", data),
    onCancel: () => console.log("Form cancelled"),
    bottomContent: (
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          Form will auto-save every 30 seconds
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => console.log("Custom cancel")}
          >
            Cancel
          </Button>
          <Button onClick={() => console.log("Custom submit")}>Submit</Button>
        </div>
      </div>
    ),
  },
};

// Modal stories
export const ModalUserForm: Story = {
  args: {
    schema: userSchema,
    title: "User Registration (Modal)",
    modal: true,
    open: false,
    onSubmit: (data) => console.log("Modal form submitted:", data),
    onCancel: () => console.log("Modal form cancelled"),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          Open User Registration Modal
        </Button>
        <JSONForm
          {...args}
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const ModalProductForm: Story = {
  args: {
    schema: productSchema,
    title: "Add Product (Modal)",
    modal: true,
    open: false,
    onSubmit: (data) => console.log("Product modal submitted:", data),
    onCancel: () => console.log("Product modal cancelled"),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Product Form Modal</Button>
        <JSONForm
          {...args}
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const ModalWithCustomContent: Story = {
  args: {
    schema: userSchema,
    title: "User Registration with Custom Content (Modal)",
    modal: true,
    open: false,
    topContent: (
      <div className="bg-green-50 p-3 rounded-md">
        <p className="text-sm text-green-700">
          This is a modal form with custom content at the top.
        </p>
      </div>
    ),
    bottomContent: (
      <div className="bg-yellow-50 p-3 rounded-md">
        <p className="text-sm text-yellow-700">
          This is custom content at the bottom of the modal form.
        </p>
      </div>
    ),
    onSubmit: (data) =>
      console.log("Modal with custom content submitted:", data),
    onCancel: () => console.log("Modal with custom content cancelled"),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          Open Modal with Custom Content
        </Button>
        <JSONForm
          {...args}
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const ModalWithCustomButtons: Story = {
  args: {
    schema: userSchema,
    title: "Modal with Custom Submit Buttons",
    modal: true,
    open: false,
    submitField: TailwindSubmitField,
    submitFieldProps: {
      submitLabel: "Create & Close",
      cancelLabel: "Cancel",
      showSave: true,
      onSave: () => console.log("Save and keep open"),
      customButtons: [
        {
          label: "Create & Add Another",
          onClick: () => console.log("Create and add another"),
          variant: "outline" as const,
        },
      ],
    },
    onSubmit: (data) => console.log("Modal custom buttons submitted:", data),
    onCancel: () => console.log("Modal custom buttons cancelled"),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          Open Modal with Custom Buttons
        </Button>
        <JSONForm
          {...args}
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

// Interactive story showing form submission
export const InteractiveForm: Story = {
  args: {
    schema: userSchema,
    title: "Interactive User Form",
  },
  render: (args) => {
    const [submittedData, setSubmittedData] = useState<any>(null);

    return (
      <div className="space-y-6">
        <JSONForm
          {...args}
          onSubmit={(data) => {
            console.log("Form submitted:", data);
            setSubmittedData(data);
          }}
          onCancel={() => {
            console.log("Form cancelled");
            setSubmittedData(null);
          }}
        />

        {submittedData && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Submitted Data:
            </h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};

// Add a new story to demonstrate validation
export const ValidationDemo: Story = {
  args: {
    schema: userSchema,
    title: "Validation Demo (Try submitting empty form)",
    validate: "onSubmit",
    showInlineError: true,
  },
  render: (args) => {
    const [submittedData, setSubmittedData] = useState<any>(null);
    const [validationErrors, setValidationErrors] = useState<any>(null);

    // Create a validator using the exported function
    const validator = createValidator(userSchema as any);

    const handleSubmit = (data: any) => {
      // Test the validator manually
      const errors = validator(data);
      if (errors) {
        setValidationErrors(errors);
        console.log("Validation errors:", errors);
      } else {
        setValidationErrors(null);
        setSubmittedData(data);
        console.log("Form submitted successfully:", data);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            Validation Demo Instructions:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try submitting the form without filling required fields</li>
            <li>• Enter invalid email formats</li>
            <li>• Try age values outside the 18-120 range</li>
            <li>• The validator uses AJV for comprehensive validation</li>
          </ul>
        </div>

        <JSONForm
          {...args}
          onSubmit={handleSubmit}
          onCancel={() => {
            setSubmittedData(null);
            setValidationErrors(null);
          }}
        />

        {validationErrors && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">
              Validation Errors:
            </h3>
            <pre className="text-sm text-red-700 overflow-auto">
              {JSON.stringify(validationErrors, null, 2)}
            </pre>
          </div>
        )}

        {submittedData && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Submitted Data:
            </h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};
