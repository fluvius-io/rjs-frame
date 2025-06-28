import { connectField, HTMLFieldProps } from "uniforms";
import { Button } from "../common/Button";

export type TailwindAutoFieldProps = HTMLFieldProps<
  unknown,
  HTMLDivElement,
  { label?: string; placeholder?: string; required?: boolean; error?: boolean }
>;

// Custom Submit Field Component
export interface TailwindSubmitFieldProps {
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

export function TailwindSubmitField({
  disabled = false,
  readOnly = false,
  onSubmit,
  onCancel,
  onSave,
  onReset,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  showCancel = true,
  showSave = false,
  showReset = false,
  customButtons = [],
  className = "",
}: TailwindSubmitFieldProps) {
  return (
    <div className={`flex justify-end gap-2 pt-4 ${className}`}>
      {/* Custom buttons */}
      {customButtons.map((button, index) => (
        <Button
          key={index}
          type={button.type || "button"}
          variant={button.variant || "outline"}
          onClick={button.onClick}
          disabled={disabled || readOnly}
        >
          {button.label}
        </Button>
      ))}

      {/* Reset button */}
      {showReset && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={disabled || readOnly}
        >
          Reset
        </Button>
      )}

      {/* Cancel button */}
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={disabled}
        >
          {cancelLabel}
        </Button>
      )}

      {/* Save button (different from submit) */}
      {showSave && (
        <Button
          type="button"
          variant="outline"
          onClick={onSave}
          disabled={disabled || readOnly}
        >
          Save Draft
        </Button>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        variant="default"
        onClick={onSubmit}
        disabled={disabled || readOnly}
      >
        {submitLabel}
      </Button>
    </div>
  );
}

function TailwindAutoField({
  label,
  placeholder,
  required,
  error,
  value,
  onChange,
  disabled,
  readOnly,
  type,
  // Destructure uniforms-specific props to exclude them
  changed,
  errorMessage,
  field,
  fieldType,
  fields,
  id,
  name,
  showInlineError,
  ...htmlProps
}: TailwindAutoFieldProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error || errorMessage ? "border-red-500" : "border-gray-300"}
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    ${readOnly ? "bg-gray-50" : ""}
  `.trim();

  const labelClasses = `
    block text-sm font-medium text-gray-700 mb-1
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}
  `.trim();

  const renderInput = () => {
    // Handle different input types
    switch (type) {
      case "select":
        return (
          <select
            className={inputClasses}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            id={id}
            name={name}
          >
            <option value="">Select an option</option>
            {/* Options will be populated by uniforms */}
          </select>
        );

      case "textarea":
        return (
          <textarea
            className={`${inputClasses} resize-vertical`}
            rows={4}
            value={value == null ? "" : String(value)}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            id={id}
            name={name}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={Boolean(value)}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              readOnly={readOnly}
              id={id}
              name={name}
            />
            {label && (
              <label className="ml-2 text-sm text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            className={inputClasses}
            value={value == null ? "" : String(value)}
            onChange={(e) => onChange?.(Number(e.target.value))}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            id={id}
            name={name}
          />
        );

      default:
        return (
          <input
            type={type || "text"}
            className={inputClasses}
            value={value == null ? "" : String(value)}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            id={id}
            name={name}
          />
        );
    }
  };

  // For checkbox, don't render separate label
  if (type === "checkbox") {
    return (
      <div className="mb-4">
        {renderInput()}
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {label && <label className={labelClasses}>{label}</label>}
      {renderInput()}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export default connectField(TailwindAutoField);
