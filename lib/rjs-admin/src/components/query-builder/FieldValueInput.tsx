import React from "react";

/**
 * FieldValueInput Component with Extensible Widget Registry
 *
 * This component now supports registering custom widget types without modifying the core component.
 *
 * Usage Example:
 * ```typescript
 * import { registerWidgetType } from './FieldValueInput';
 *
 * // Register a custom color picker widget
 * registerWidgetType('color', ({ value, processValue }) => (
 *   <input
 *     type="color"
 *     value={value || '#000000'}
 *     onChange={processValue}
 *     className="w-12 h-8 border rounded cursor-pointer"
 *   />
 * ));
 *
 * // Register a custom slider widget
 * registerWidgetType('slider', ({ value, processValue }) => (
 *   <input
 *     type="range"
 *     min="0"
 *     max="100"
 *     value={value || 0}
 *     onChange={processValue}
 *     className="flex-1"
 *   />
 * ));
 * ```
 */

// Define the interface for widget renderer props
interface WidgetRendererProps {
  value: any;
  fieldName: string;
  processValue: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

// Define the widget renderer function type
type WidgetRenderer = (props: WidgetRendererProps) => React.ReactElement;

// Registry for widget renderers
const widgetRegistry: Record<string, WidgetRenderer> = {};

// Function to register new widget types
export const registerWidgetType = (
  widgetName: string,
  renderer: WidgetRenderer
) => {
  widgetRegistry[widgetName.toLowerCase()] = renderer;
};

// Default widget renderers
const defaultRenderers: Record<string, WidgetRenderer> = {
  boolean: ({ value, processValue }) => (
    <select
      value={value !== undefined && value !== null ? String(value) : ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    >
      <option value="">Select...</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  ),

  checkbox: ({ value, processValue }) => (
    <select
      value={value !== undefined && value !== null ? String(value) : ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    >
      <option value="">Select...</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  ),

  select: ({ value, processValue }) => (
    <select
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    >
      <option value="">Select...</option>
      {/* TODO: Add options from widget.data_query if available */}
    </select>
  ),

  dropdown: ({ value, processValue }) => (
    <select
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    >
      <option value="">Select...</option>
      {/* TODO: Add options from widget.data_query if available */}
    </select>
  ),

  number: ({ value, fieldName, processValue }) => (
    <input
      type="number"
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} value...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  date: ({ value, processValue }) => (
    <input
      type="date"
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  datetime: ({ value, processValue }) => (
    <input
      type="datetime-local"
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  "datetime-local": ({ value, processValue }) => (
    <input
      type="datetime-local"
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  time: ({ value, processValue }) => (
    <input
      type="time"
      value={value || ""}
      onChange={processValue}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  textarea: ({ value, fieldName, processValue }) => (
    <textarea
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} value...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white resize-none"
      rows={2}
    />
  ),

  email: ({ value, fieldName, processValue }) => (
    <input
      type="email"
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} email...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  url: ({ value, fieldName, processValue }) => (
    <input
      type="url"
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} URL...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),

  password: ({ value, fieldName, processValue }) => (
    <input
      type="password"
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} password...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),
};

// Initialize the registry with default renderers
Object.entries(defaultRenderers).forEach(([widgetName, renderer]) => {
  registerWidgetType(widgetName, renderer);
});

// Default text input renderer
const defaultTextRenderer: WidgetRenderer = ({
  value,
  fieldName,
  processValue,
}) => (
  <input
    type="text"
    value={value || ""}
    onChange={processValue}
    placeholder={`Enter ${fieldName} value...`}
    className="flex-1 px-2 py-1 text-sm border rounded bg-white"
  />
);

// Component for field value input based on widget information
export const FieldValueInput: React.FC<{
  widget: {
    name: string;
    desc: string | null;
    inversible: boolean;
    data_query: any | null;
  } | null;
  value: any;
  onChange: (value: any) => void;
  fieldName: string;
}> = ({ widget, value, onChange, fieldName }) => {
  const preprocessData = (newValue: any) => {
    // Add your data preprocessing logic here
    // For example, you might want to trim strings, parse numbers, etc.
    console.log(
      "Preprocessing data (original component value, new value from input):",
      value,
      newValue
    );
    return newValue;
  };

  const processValue = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let newValueFromEvent: string | boolean;

    if (
      widget?.name?.toLowerCase() === "boolean" ||
      widget?.name?.toLowerCase() === "checkbox"
    ) {
      newValueFromEvent = (event.target as HTMLSelectElement).value === "true";
    } else {
      newValueFromEvent = event.target.value;
    }

    const finalValue = preprocessData(newValueFromEvent);
    onChange(finalValue); // Call the upstream onChange from props
  };

  // If no widget, use default text input
  if (!widget) {
    return defaultTextRenderer({ value, fieldName, processValue });
  }

  // Look up the widget renderer in the registry
  const widgetName = widget.name?.toLowerCase();
  const renderer = widgetRegistry[widgetName];

  if (renderer) {
    return renderer({ value, fieldName, processValue });
  }

  // Fallback to default text input for unknown widget types
  return defaultTextRenderer({ value, fieldName, processValue });
};

export default FieldValueInput;
