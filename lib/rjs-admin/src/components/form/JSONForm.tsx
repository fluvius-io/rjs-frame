import * as Dialog from "@radix-ui/react-dialog";
import Ajv, { JSONSchemaType } from "ajv";
import React from "react";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import { AutoField, AutoForm } from "uniforms-unstyled";
import { Button } from "../common/Button";
import TailwindAutoField from "./TailwindAutoField";

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  keywords: ["uniforms"],
});

/**
 * Creates a validator function for JSON Schema validation using AJV.
 *
 * This function compiles a JSON Schema into a validator function that can be used
 * with uniforms. It uses AJV (Another JSON Schema Validator) for comprehensive
 * validation with support for all JSON Schema features.
 *
 * @param schema - JSON Schema object to validate against
 * @returns A validator function that takes a model object and returns validation errors or null
 *
 * @example
 * ```typescript
 * const schema = {
 *   type: "object",
 *   properties: {
 *     name: { type: "string", minLength: 1 },
 *     email: { type: "string", format: "email" }
 *   },
 *   required: ["name", "email"]
 * };
 *
 * const validator = createValidator(schema);
 * const errors = validator({ name: "", email: "invalid" });
 * // Returns: { details: [...] } with AJV error objects
 * ```
 */
export function createValidator<T>(schema: JSONSchemaType<T>) {
  const validator = ajv.compile(schema);

  return (model: Record<string, unknown>) => {
    const isValid = validator(model);
    return !isValid && validator.errors?.length
      ? { details: validator.errors }
      : null;
  };
}

export interface JSONFormProps {
  schema: any; // JSON Schema object
  data?: any; // Initial form data
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  validate?: "onChange" | "onSubmit" | "onChangeAfterSubmit" | "never";
  showInlineError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const validateSchema = (schema: any) => {
  // Validate schema more thoroughly
  if (typeof schema !== "object" || Array.isArray(schema)) {
    return "Error: Invalid schema provided to JSONForm";
  }

  // Ensure schema has required properties for JSON Schema
  if (!schema.type) {
    return "Error: Schema must have a 'type' property";
  }

  if (schema.type !== "object") {
    return "Error: Schema type must be 'object'";
  }

  if (!schema.properties || typeof schema.properties !== "object") {
    return "Error: Schema must have a 'properties' object";
  }

  return null;
};

export function JSONForm(props: JSONFormProps) {
  const {
    schema,
    data = {},
    onSubmit,
    onCancel,
    title = "Form",
    modal = false,
    open = true,
    onOpenChange,
    topContent,
    bottomContent,
    className = "",
    validate = "onChange",
    showInlineError = true,
    disabled = false,
    readOnly = false,
  } = props;

  // Early return if schema is not provided (e.g., during Storybook initialization)
  if (!schema) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">Waiting for schema...</p>
      </div>
    );
  }

  const validationMessage = validateSchema(schema);
  if (validationMessage) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{validationMessage}</p>
      </div>
    );
  }
  const renderError = (message: string, schema: any, error: any) => {
    return (
      <div className="p-4  bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error: {message}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Error details</summary>
          <pre className="text-xs mt-1 p-2 overflow-auto text-muted-foreground">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Schema details</summary>
          <pre className="text-xs mt-1 p-2 overflow-auto text-muted-foreground">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  // Create a safe copy of the schema to avoid mutations
  const safeSchema = JSON.parse(JSON.stringify(schema));

  // Create uniforms bridge from JSON Schema
  let bridge: JSONSchemaBridge;
  let validator;
  try {
    validator = createValidator(safeSchema as JSONSchemaType<any>);
  } catch (error) {
    return renderError(
      "Failed to create validator for schema",
      safeSchema,
      error
    );
  }

  try {
    bridge = new JSONSchemaBridge({
      schema: safeSchema,
      validator,
    });
  } catch (error) {
    return renderError(
      "Failed to create JSONSchemaBridge from schema",
      safeSchema,
      error
    );
  }

  const handleSubmit = (formData: any) => {
    onSubmit?.(formData);
  };

  const handleCancel = () => {
    onCancel?.();
    if (modal && onOpenChange) {
      onOpenChange(false);
    }
  };

  const renderForm = () => (
    <div className={`space-y-4 ${className}`}>
      {topContent && <div className="mb-4">{topContent}</div>}

      <AutoField.componentDetectorContext.Provider
        value={() => TailwindAutoField}
      >
        <AutoForm
          schema={bridge}
          model={data}
          onSubmit={handleSubmit}
          validate={validate}
          showInlineError={showInlineError}
          disabled={disabled}
          readOnly={readOnly}
        />
      </AutoField.componentDetectorContext.Provider>

      {bottomContent && <div className="mt-4">{bottomContent}</div>}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Submit
        </Button>
      </div>
    </div>
  );

  const renderModal = () => {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="sm" aria-label="Close">
                    ✕
                  </Button>
                </Dialog.Close>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-4">{renderForm()}</div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  };

  if (modal) {
    return renderModal();
  }

  return renderForm();
}

export default JSONForm;
