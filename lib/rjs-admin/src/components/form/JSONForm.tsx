import * as Dialog from "@radix-ui/react-dialog";
import { JSONSchemaType } from "ajv";
import React from "react";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import { AutoField as UniformsAutoField, AutoForm } from "uniforms-unstyled";
import { Button } from "../common/Button";
import AutoField, {
  SubmitField,
  SubmitFieldProps,
  ErrorsField,
  ErrorsFieldProps,
} from "./AutoField";
import { createValidator } from "./validator";

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
  // Submit field customization
  submitField?: React.ComponentType<any>;
  errorsField?: React.ComponentType<any>;
  errorsFieldProps?: Partial<ErrorsFieldProps>;
  submitFieldProps?: Partial<SubmitFieldProps>;
  hideDefaultButtons?: boolean;
}

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
    submitField,
    errorsField,
    errorsFieldProps = {},
    submitFieldProps = {},
    hideDefaultButtons = false,
  } = props;

  // Early return if schema is not provided (e.g., during Storybook initialization)
  if (!schema) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">Waiting for schema...</p>
      </div>
    );
  }

  const renderError = (title: string, schema: any, error: any) => {
    return (
      <div className="p-4  bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error: {title}</p>
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

  // Format error messages to capitalize first letter
  React.useEffect(() => {
    const formatErrorMessages = () => {
      const errorElements = document.querySelectorAll('form ul li');
      errorElements.forEach((element) => {
        const text = element.textContent;
        if (text && text.length > 0) {
          element.textContent = text.charAt(0).toUpperCase() + text.slice(1);
        }
      });
    };

    // Run formatting after component updates
    const timeoutId = setTimeout(formatErrorMessages, 100);
    return () => clearTimeout(timeoutId);
  });

  const handleCancel = () => {
    onCancel?.();
    if (modal && onOpenChange) {
      onOpenChange(false);
    }
  };

  // Create custom submit field component with props
  const CustomSubmitField = submitField || SubmitField;
  const submitFieldComponent = () => (
    <CustomSubmitField
      disabled={disabled}
      readOnly={readOnly}
      onCancel={handleCancel}
      {...submitFieldProps}
    />
  );

  const CustomErrorsField = errorsField || ErrorsField;
  const errorsFieldComponent = () => (
    <CustomErrorsField
      disabled={disabled}
      readOnly={readOnly}
      name="errors"
      {...errorsFieldProps}
    />
  );

  
  const renderForm = () => (
    <div className={`af-form-container space-y-4 ${className}`}>
      {topContent && <div className="mb-4">{topContent}</div>}

      <UniformsAutoField.componentDetectorContext.Provider
        value={() => AutoField}
      >
        <div className="af-form-fields">
          <AutoForm
            schema={bridge}
            model={data}
            onSubmit={handleSubmit}
            validate={validate}
            showInlineError={showInlineError}
            disabled={disabled}
            readOnly={readOnly}
            submitField={submitFieldComponent}
            errorsField={errorsFieldComponent}
          />
        </div>
      </UniformsAutoField.componentDetectorContext.Provider>

      {bottomContent && <div className="mt-4">{bottomContent}</div>}

      {/* Custom submit field
      {CustomSubmitField && (
        <div className="af-form-actions">
          {submitFieldComponent()}
        </div>
      )} */}

      {/* Default buttons - only show if not using custom submit field and not explicitly hidden */}
      {!CustomSubmitField && !hideDefaultButtons && (
        <div className="af-form-actions flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="default">
            Submit
          </Button>
        </div>
      )}
    </div>
  );

  const renderModal = () => {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col max-h-[90vh]">
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
