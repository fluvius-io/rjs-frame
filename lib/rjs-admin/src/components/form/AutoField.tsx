import { connectField, HTMLFieldProps } from "uniforms";
import { Button } from "../common/Button";
import React from "react";
import { cn } from "../../lib/utils";

export type AutoFieldProps = HTMLFieldProps<
  unknown,
  HTMLDivElement,
  { 
    label?: string; 
    placeholder?: string; 
    required?: boolean; 
    error?: boolean;
  }
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

// Utility functions for the AutoField component
const SchemaUtils = {
  isPlainObject: (val: any): boolean => {
    return val !== null && 
           typeof val === 'object' && 
           !Array.isArray(val) && 
           !(val instanceof Date) && 
           !(val instanceof RegExp);
  },

  stringifyValue: (val: any): string => {
    if (val == null) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    return String(val);
  },

  getInputType: (val: any): string => {
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'checkbox';
    if (typeof val === 'string' && val.length > 100) return 'textarea';
    return 'text';
  },

  extractSchemaProperties: (field: any) => {
    if (!field || typeof field !== 'object') return {};
    
    let properties = field.properties;
    
    if (!properties && field.schema) {
      properties = field.schema.properties;
    }
    
    if (!properties && field.type) {
      properties = field.type.properties;
    }
    
    return properties || {};
  },

  detectAdditionalProperties: (field: any): boolean => {
    if (!field || typeof field !== 'object') return false;
    
    // Direct property
    if (field.additionalProperties === true) return true;
    
    // In nested schema property
    if (field.schema?.additionalProperties === true) return true;
    
    // In type property (some uniforms implementations)
    if (field.type?.additionalProperties === true) return true;
    
    console.log('Field schema for additionalProperties detection:', field);
    
    return false;
  }
};

// Component factory functions
const InputComponents = {
  createBaseInput: (props: any) => {
    const { value, onChange, placeholder, disabled, readOnly, id, name, className, error, errorMessage } = props;
    
    return (
      <input
        type={props.type || "text"}
        className={cn(
          "af-input-base",
          error || errorMessage ? "af-input-error" : "",
          disabled ? "af-input-disabled" : "",
          readOnly ? "af-input-readonly" : "",
          className
        )}
        value={SchemaUtils.stringifyValue(value)}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        id={id}
        name={name}
      />
    );
  },

  createTextArea: (props: any) => {
    const { value, onChange, placeholder, disabled, readOnly, id, name, rows = 4, isJson = false, error, errorMessage } = props;
    
    return (
      <textarea
        className={cn(
          "af-input-base af-textarea",
          isJson ? "af-textarea-json" : "",
          error || errorMessage ? "af-input-error" : "",
          disabled ? "af-input-disabled" : "",
          readOnly ? "af-input-readonly" : ""
        )}
        rows={rows}
        value={SchemaUtils.stringifyValue(value)}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        id={id}
        name={name}
      />
    );
  },

  createCheckbox: (props: any) => {
    const { value, onChange, disabled, readOnly, id, name, label, required } = props;
    
    return (
      <div className="af-checkbox-container">
        <input
          type="checkbox"
          className="af-checkbox-input"
          checked={Boolean(value)}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          readOnly={readOnly}
          id={id}
          name={name}
        />
        {label && (
          <label className={cn("af-checkbox-label", required ? "af-checkbox-required" : "")}>
            {label}
          </label>
        )}
      </div>
    );
  },

  createSelect: (props: any) => {
    const { value, onChange, disabled, id, name, error, errorMessage } = props;
    
    return (
      <select
        className={cn(
          "af-input-base",
          error || errorMessage ? "af-input-error" : "",
          disabled ? "af-input-disabled" : ""
        )}
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
  },

  createNumberInput: (props: any) => {
    const { value, onChange, placeholder, disabled, readOnly, id, name, error, errorMessage } = props;
    
    return (
      <input
        type="number"
        className={cn(
          "af-input-base",
          error || errorMessage ? "af-input-error" : "",
          disabled ? "af-input-disabled" : "",
          readOnly ? "af-input-readonly" : ""
        )}
        value={value == null ? "" : String(value)}
        onChange={(e) => onChange?.(Number(e.target.value))}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        id={id}
        name={name}
      />
    );
  }
};

// Button components
const ButtonComponents = {
  createRemoveButton: (props: any) => {
    const { onClick, disabled, title, children = "×", className } = props;
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "af-button-remove",
          className
        )}
        disabled={disabled}
        title={title}
      >
        {children}
      </button>
    );
  },

  createAddButton: (props: any) => {
    const { onClick, disabled, children, className } = props;
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "af-button-primary",
          disabled ? "af-button-primary-disabled" : "",
          className
        )}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },

  createAddPropertyButton: (props: any) => {
    const { onClick, disabled, children, className } = props;
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "af-button-add-property",
          className
        )}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },

  createPrimaryButton: (props: any) => {
    const { onClick, disabled, children, className } = props;
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "af-button-primary",
          disabled ? "af-button-primary-disabled" : "",
          className
        )}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },

  createSecondaryButton: (props: any) => {
    const { onClick, disabled, children, className } = props;
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "af-button-secondary",
          className
        )}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
};

function AutoField({
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
}: AutoFieldProps) {
  // State for managing new custom property input
  const [newPropertyKey, setNewPropertyKey] = React.useState('');
  const [newPropertyValue, setNewPropertyValue] = React.useState('');
  const [showAddProperty, setShowAddProperty] = React.useState(false);

  // Extract additionalProperties from the field schema
  const allowAdditionalProperties = React.useMemo(() => {
    return SchemaUtils.detectAdditionalProperties(field);
  }, [field]);

  // Helper function to update nested object property
  const updateObjectProperty = React.useCallback((propertyKey: string, propertyValue: any) => {
    if (!SchemaUtils.isPlainObject(value)) return;
    const newValue = { ...(value as Record<string, any>), [propertyKey]: propertyValue };
    onChange?.(newValue);
  }, [value, onChange]);

  // Helper function to remove a property from object
  const removeObjectProperty = React.useCallback((propertyKey: string) => {
    if (!SchemaUtils.isPlainObject(value)) return;
    const newValue = { ...(value as Record<string, any>) };
    delete newValue[propertyKey];
    onChange?.(newValue);
  }, [value, onChange]);

  // Helper function to add a new custom property
  const addCustomProperty = React.useCallback(() => {
    if (!newPropertyKey.trim() || !SchemaUtils.isPlainObject(value)) return;
    
    const currentValue = value as Record<string, any>;
    if (currentValue.hasOwnProperty(newPropertyKey)) {
      // Property already exists, don't add duplicate
      return;
    }

    const newValue = { 
      ...currentValue, 
      [newPropertyKey]: newPropertyValue || "" 
    };
    onChange?.(newValue);
    
    // Reset the input fields
    setNewPropertyKey('');
    setNewPropertyValue('');
  }, [newPropertyKey, newPropertyValue, value, onChange]);

  // Helper function to cancel adding new property
  const cancelAddProperty = React.useCallback(() => {
    setShowAddProperty(false);
    setNewPropertyKey('');
    setNewPropertyValue('');
  }, []);

  // Schema extraction and initialization helpers
  const ObjectFieldHelpers = {
    getSchemaProperties: () => {
      return React.useMemo(() => {
        return SchemaUtils.extractSchemaProperties(field);
      }, [field]);
    },

    getAllPropertyKeys: (schemaProperties: any, obj: Record<string, any>) => {
      return React.useMemo(() => {
        const schemaKeys = Object.keys(schemaProperties);
        const existingKeys = obj ? Object.keys(obj) : [];
        
        // Combine schema keys with any additional existing keys (for additionalProperties)
        const allKeys = new Set([...schemaKeys, ...existingKeys]);
        return Array.from(allKeys);
      }, [schemaProperties, obj]);
    },

    initializeObjectDefaults: (obj: Record<string, any>, schemaProperties: any) => {
      React.useEffect(() => {
        if (!obj || Object.keys(obj).length === 0) {
          const schemaKeys = Object.keys(schemaProperties);
          if (schemaKeys.length > 0) {
            const initialValue: Record<string, any> = {};
            schemaKeys.forEach(key => {
              const propSchema = schemaProperties[key];
              if (propSchema?.type === 'object') {
                initialValue[key] = {};
              } else if (propSchema?.type === 'array') {
                initialValue[key] = [];
              } else if (propSchema?.type === 'boolean') {
                initialValue[key] = false;
              } else {
                initialValue[key] = propSchema?.default || '';
              }
            });
            onChange?.(initialValue);
          }
        }
      }, [obj, schemaProperties, onChange]);
    }
  };

  // Helper function to render a single object property
  const renderObjectProperty = (key: string, val: any, propSchema: any, isSchemaProperty: boolean) => {
    let labelStr = propSchema?.title || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    if (!isSchemaProperty) {
      labelStr += " (+)";
    }
    
    return (
      <div key={key} className="af-object-property">
        <div className="af-object-property-field">
          <AutoField
            label={labelStr}
            value={val}
            onChange={(newVal) => updateObjectProperty(key, newVal)}
            type={SchemaUtils.getInputType(val)}
            disabled={disabled}
            readOnly={readOnly}
            id={`${id}_${key}`}
            name={`${name}.${key}`}
            // Pass through required uniforms props
            changed={changed}
            field={propSchema || field}
            fieldType={fieldType}
            fields={fields}
            showInlineError={showInlineError}
          />
        </div>
        {allowAdditionalProperties && !isSchemaProperty && !readOnly && (
          <ButtonComponents.createRemoveButton
            onClick={() => removeObjectProperty(key)}
            disabled={disabled}
            title={`Remove ${key} property`}
          />
        )}
      </div>
    );
  };

  // Helper function to render additional properties section
  const renderAdditionalPropertiesSection = (additionalPropertyKeys: string[], schemaProperties: any, obj: Record<string, any>) => {
    if (!allowAdditionalProperties || readOnly) return null;

    return (
      <div className="af-additional-props-section">
        {additionalPropertyKeys.map((key) => {
          const val = obj?.[key];
          const propSchema = schemaProperties[key];
          
          return renderObjectProperty(key, val, propSchema, false);
        })}
        {!showAddProperty ? (
          <ButtonComponents.createAddPropertyButton
            onClick={() => {
              setShowAddProperty(true);
              setNewPropertyKey('');
              setNewPropertyValue('');
            }}
            disabled={disabled}
            className="text-xs"
          >
            + Add Custom Property
          </ButtonComponents.createAddPropertyButton>
        ) : (
          <div className="af-additional-props-form">
            <h5 className="af-additional-props-title text-x-small">Add Custom Property</h5>
            <div className="af-additional-props-inputs text-xs">
              <div className="af-additional-props-input-container">
                {InputComponents.createBaseInput({
                  type: "text",
                  placeholder: "Property name",
                  value: newPropertyKey,
                  onChange: (value: any) => {
                    setNewPropertyKey(value);
                  },
                  disabled,
                  error,
                  errorMessage
                })}
              </div>
              <div className="af-additional-props-input-container">
                {InputComponents.createBaseInput({
                  type: "text", 
                  placeholder: "Property value",
                  value: newPropertyValue,
                  onChange: (value: any) => {
                    setNewPropertyValue(value);
                  },
                  disabled,
                  error,
                  errorMessage
                })}
              </div>
            <div className="af-additional-props-actions">
              <ButtonComponents.createPrimaryButton
                onClick={addCustomProperty}
                disabled={!newPropertyKey.trim() || disabled}
                className="min-w-24"
              >
                Add
              </ButtonComponents.createPrimaryButton>
              <ButtonComponents.createSecondaryButton
                onClick={cancelAddProperty}
                disabled={disabled}
              >
                Cancel
              </ButtonComponents.createSecondaryButton>
            </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render nested object as form fields
  const renderObjectFields = (obj: Record<string, any>) => {
    const schemaProperties = ObjectFieldHelpers.getSchemaProperties();
    const allPropertyKeys = ObjectFieldHelpers.getAllPropertyKeys(schemaProperties, obj);
    const [schemaPropertyKeys, additionalPropertyKeys] = allPropertyKeys.reduce(
      (acc, key) => {
        if (key in schemaProperties) {
          acc[0].push(key);
        } else {
          acc[1].push(key);
        }
        return acc;
      },
      [[] as string[], [] as string[]]
    );    
    
    ObjectFieldHelpers.initializeObjectDefaults(obj, schemaProperties);

    return (
      <div className="af-object-container">
        {schemaPropertyKeys.map((key) => {
          const val = obj?.[key];
          const isSchemaProperty = key in schemaProperties;
          const propSchema = schemaProperties[key];
          
          return renderObjectProperty(key, val, propSchema, isSchemaProperty);
        })}
        
        {renderAdditionalPropertiesSection(additionalPropertyKeys, schemaProperties, obj)}
      </div>
    );
  };

  // Array manipulation helpers
  const ArrayFieldHelpers = {
    updateArrayItem: (arr: any[], index: number, newValue: any) => {
      const newArray = [...arr];
      newArray[index] = newValue;
      onChange?.(newArray);
    },

    addArrayItem: (arr: any[]) => {
      const newArray = [...arr, ""];
      onChange?.(newArray);
    },

    removeArrayItem: (arr: any[], index: number) => {
      const newArray = arr.filter((_, i) => i !== index);
      onChange?.(newArray);
    }
  };

  // Helper function to render a single array item
  const renderArrayItem = (item: any, index: number, arr: any[]) => {
    return (
      <div key={index} className="af-array-item">
        <div className="af-array-item-field">
          <AutoField
            label={`Item ${index + 1}`}
            value={item}
            onChange={(newVal) => ArrayFieldHelpers.updateArrayItem(arr, index, newVal)}
            type={SchemaUtils.getInputType(item)}
            disabled={disabled}
            readOnly={readOnly}
            id={`${id}_${index}`}
            name={`${name}[${index}]`}
            // Pass through required uniforms props
            changed={changed}
            field={field}
            fieldType={fieldType}
            fields={fields}
            showInlineError={showInlineError}
          />
        </div>
        {!readOnly && (
          <ButtonComponents.createRemoveButton
            onClick={() => ArrayFieldHelpers.removeArrayItem(arr, index)}
            disabled={disabled}
          >
            Remove
          </ButtonComponents.createRemoveButton>
        )}
      </div>
    );
  };

  // Helper function to render array controls
  const renderArrayControls = (arr: any[]) => {
    if (readOnly) return null;

    return (
      <ButtonComponents.createAddButton
        onClick={() => ArrayFieldHelpers.addArrayItem(arr)}
        disabled={disabled}
      >
        Add Item
      </ButtonComponents.createAddButton>
    );
  };

  // Helper function to render array as form fields
  const renderArrayFields = (arr: any[]) => {
    return (
      <div className="af-array-container">
        {arr.map((item, index) => renderArrayItem(item, index, arr))}
        {renderArrayControls(arr)}
      </div>
    );
  };

  const renderInput = () => {
    // Handle different input types
    switch (type) {
      case "select":
        return InputComponents.createSelect({
          value,
          onChange,
          disabled,
          id,
          name,
          error,
          errorMessage
        });

      case "textarea":
        return InputComponents.createTextArea({
          value,
          onChange,
          placeholder,
          disabled,
          readOnly,
          id,
          name,
          rows: 4,
          isJson: false,
          error,
          errorMessage
        });

      case "checkbox":
        return InputComponents.createCheckbox({
          value,
          onChange,
          disabled,
          readOnly,
          id,
          name,
          label,
          required
        });

      case "number":
        return InputComponents.createNumberInput({
          value,
          onChange,
          placeholder,
          disabled,
          readOnly,
          id,
          name,
          error,
          errorMessage
        });

      default:
        // Check if the value is an array - render as array fields
        if (Array.isArray(value)) {
          return renderArrayFields(value);
        }
        
        // Check if the value is an object - render as nested form fields
        if (SchemaUtils.isPlainObject(value)) {
          return renderObjectFields(value as Record<string, any>);
        }
        
        // For primitive values, render as regular text input
        return InputComponents.createBaseInput({
          value,
          onChange,
          placeholder,
          disabled,
          readOnly,
          id,
          name,
          type,
          error,
          errorMessage
        });
    }
  };

  // Component renderers using semantic classes
  const renderFieldContainer = (children: React.ReactNode, isLarge = false) => (
    <div className={isLarge ? "af-field-container-large" : "af-field-container"}>
      {children}
    </div>
  );

  const renderFieldLabel = (labelText: string, isRequired = false) => (
    <label className={cn("af-label-base", isRequired ? "af-label-required" : "")}>
      {labelText}
    </label>
  );

  const renderErrorMessage = (message: string, isLarge = false) => (
    <p className={isLarge ? "af-error-message-large" : "af-error-message"}>
      {message}
    </p>
  );

  const renderSectionHeader = (labelText: string, countText: string, isRequired = false) => (
    <h4 className="af-section-header">
      {labelText}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
      <span className="af-section-counter">({countText})</span>
    </h4>
  );

  // For checkbox, don't render separate label
  if (type === "checkbox") {
    return renderFieldContainer(
      <>
        {renderInput()}
        {errorMessage && renderErrorMessage(errorMessage)}
      </>
    );
  }

  // Special handling for objects and arrays - render as sections
  if (SchemaUtils.isPlainObject(value) || Array.isArray(value)) {
    const countText = Array.isArray(value) 
      ? `${value.length} items` 
      : `${Object.keys(value as Record<string, any>).length} properties`;
      
    return renderFieldContainer(
      <>
        {label && renderSectionHeader(label, countText, required)}
        {renderInput()}
        {errorMessage && renderErrorMessage(errorMessage, true)}
      </>,
      true
    );
  }

  return renderFieldContainer(
    <>
      {label && renderFieldLabel(label, required)}
      {renderInput()}
      {errorMessage && renderErrorMessage(errorMessage)}
    </>
  );
}

const ConnectedAutoField = connectField(AutoField);
ConnectedAutoField.displayName = 'AutoField';

export default ConnectedAutoField; 