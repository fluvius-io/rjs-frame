import React from "react";

/**
 * FieldValueInput Component with Extensible Widget Registry
 *
 * This component now supports registering custom widget types without modifying the core component.
 * Each widget type can define both validation logic and rendering logic.
 *
 * Usage Example:
 * ```typescript
 * import { registerWidgetType } from './FieldValueInput';
 *
 * // Register a custom color picker widget
 * registerWidgetType('color', {
 *   validator: (value) => {
 *     // Ensure color values are valid hex codes
 *     if (typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value)) {
 *       return value;
 *     }
 *     return '#000000'; // default color
 *   },
 *   renderer: ({ value, processValue }) => (
 *     <input
 *       type="color"
 *       value={value || '#000000'}
 *       onChange={processValue}
 *       className="w-12 h-8 border rounded cursor-pointer"
 *     />
 *   )
 * });
 *
 * // Register a custom slider widget
 * registerWidgetType('slider', {
 *   validator: (value) => {
 *     const numValue = Number(value);
 *     return isNaN(numValue) ? 0 : Math.max(0, Math.min(100, numValue));
 *   },
 *   renderer: ({ value, processValue }) => (
 *     <input
 *       type="range"
 *       min="0"
 *       max="100"
 *       value={value || 0}
 *       onChange={processValue}
 *       className="flex-1"
 *     />
 *   )
 * });
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

// Define the widget validator function type
type WidgetValidator = (value: any) => any;

// Define the widget definition interface
interface WidgetDefinition {
  validator?: WidgetValidator;
  renderer: WidgetRenderer;
}

// Registry for widget definitions
const widgetRegistry: Record<string, WidgetDefinition> = {};

// Function to register new widget types
export const registerWidgetType = (
  widgetName: string,
  definition: WidgetDefinition
) => {
  widgetRegistry[widgetName.toLowerCase()] = definition;
};

// Default widget definitions
const defaultWidgetDefinitions: Record<string, WidgetDefinition> = {
  boolean: {
    validator: (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value === "true";
      return false;
    },
    renderer: ({ value, processValue }) => (
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
  },

  checkbox: {
    validator: (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value === "true";
      return false;
    },
    renderer: ({ value, processValue }) => (
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
  },

  select: {
    validator: (value) => value, // Pass through as-is for select widgets
    renderer: ({ value, processValue }) => (
      <select
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      >
        <option value="">Select...</option>
        {/* TODO: Add options from widget.data_query if available */}
      </select>
    ),
  },

  dropdown: {
    validator: (value) => value, // Pass through as-is for dropdown widgets
    renderer: ({ value, processValue }) => (
      <select
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      >
        <option value="">Select...</option>
        {/* TODO: Add options from widget.data_query if available */}
      </select>
    ),
  },

  number: {
    validator: (value) => {
      if (value === "" || value === null || value === undefined) return "";
      const numValue = Number(value);
      return isNaN(numValue) ? "" : String(numValue);
    },
    renderer: ({ value, fieldName, processValue }) => (
      <input
        type="number"
        value={value || ""}
        onChange={processValue}
        placeholder={`Enter ${fieldName} value...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  date: {
    validator: (value) => {
      if (!value) return "";
      // Basic date validation - you might want to use a proper date library
      const dateValue = new Date(value);
      return isNaN(dateValue.getTime()) ? "" : value;
    },
    renderer: ({ value, processValue }) => (
      <input
        type="date"
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  datetime: {
    validator: (value) => {
      if (!value) return "";
      const dateValue = new Date(value);
      return isNaN(dateValue.getTime()) ? "" : value;
    },
    renderer: ({ value, processValue }) => (
      <input
        type="datetime-local"
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  "datetime-local": {
    validator: (value) => {
      if (!value) return "";
      const dateValue = new Date(value);
      return isNaN(dateValue.getTime()) ? "" : value;
    },
    renderer: ({ value, processValue }) => (
      <input
        type="datetime-local"
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  time: {
    validator: (value) => {
      if (!value) return "";
      // Basic time format validation (HH:MM or HH:MM:SS)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
      return timeRegex.test(value) ? value : "";
    },
    renderer: ({ value, processValue }) => (
      <input
        type="time"
        value={value || ""}
        onChange={processValue}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  textarea: {
    validator: (value) => String(value || ""), // Convert to string
    renderer: ({ value, fieldName, processValue }) => (
      <textarea
        value={value || ""}
        onChange={processValue}
        placeholder={`Enter ${fieldName} value...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white resize-none"
        rows={2}
      />
    ),
  },

  email: {
    validator: (value) => {
      if (!value) return "";
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? value : value; // Return original value even if invalid for now
    },
    renderer: ({ value, fieldName, processValue }) => (
      <input
        type="email"
        value={value || ""}
        onChange={processValue}
        placeholder={`Enter ${fieldName} email...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  url: {
    validator: (value) => {
      if (!value) return "";
      try {
        new URL(value);
        return value;
      } catch {
        return value; // Return original value even if invalid for now
      }
    },
    renderer: ({ value, fieldName, processValue }) => (
      <input
        type="url"
        value={value || ""}
        onChange={processValue}
        placeholder={`Enter ${fieldName} URL...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },

  password: {
    validator: (value) => String(value || ""), // Convert to string
    renderer: ({ value, fieldName, processValue }) => (
      <input
        type="password"
        value={value || ""}
        onChange={processValue}
        placeholder={`Enter ${fieldName} password...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    ),
  },
};

// Initialize the registry with default widget definitions
Object.entries(defaultWidgetDefinitions).forEach(([widgetName, definition]) => {
  registerWidgetType(widgetName, definition);
});

// Default text input widget definition
const defaultTextWidgetDefinition: WidgetDefinition = {
  validator: (value) => String(value || "").trim(), // Convert to string
  renderer: ({ value, fieldName, processValue }) => (
    <input
      type="text"
      value={value || ""}
      onChange={processValue}
      placeholder={`Enter ${fieldName} value...`}
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />
  ),
};

type WidgetSpecs = {
  name: string;
  desc: string | null;
  inversible: boolean;
  data_query: any | null;
} | null;

function getWidgetDefinition(widget: WidgetSpecs) {
  if (!widget) {
    return defaultTextWidgetDefinition;
  }

  const widgetName = widget.name?.toLowerCase();
  const widgetDefinition = widgetRegistry[widgetName];
  return widgetDefinition || defaultTextWidgetDefinition;
}

// Component for field value input based on widget information
export const FieldValueInput: React.FC<{
  widget: WidgetSpecs;
  value: any;
  onChange: (value: any) => void;
  fieldName: string;
}> = ({ widget, value, onChange, fieldName }) => {
  const widgetDefinition = getWidgetDefinition(widget);

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

    let validatedValue = newValueFromEvent;
    if (widgetDefinition?.validator) {
      validatedValue = widgetDefinition.validator(newValueFromEvent);
    }

    onChange(validatedValue);
  };

  return widgetDefinition.renderer({ value, fieldName, processValue });
};

export default FieldValueInput;
