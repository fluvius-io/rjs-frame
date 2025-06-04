import React from 'react';

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
  // If no widget, use simple text input
  if (!widget) {
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${fieldName} value...`}
        className="flex-1 px-2 py-1 text-sm border rounded bg-white"
      />
    );
  }

  // Handle different widget types
  switch (widget.name?.toLowerCase()) {
    case 'boolean':
    case 'checkbox':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value === 'true')}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        >
          <option value="">Select...</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    
    case 'select':
    case 'dropdown':
      // If widget has data_query, we could fetch options from there
      // For now, handle basic select
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        >
          <option value="">Select...</option>
          {/* TODO: Add options from widget.data_query if available */}
        </select>
      );
    
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} value...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'datetime':
    case 'datetime-local':
      return (
        <input
          type="datetime-local"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'time':
      return (
        <input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} value...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white resize-none"
          rows={2}
        />
      );
    
    case 'email':
      return (
        <input
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} email...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'url':
      return (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} URL...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    case 'password':
      return (
        <input
          type="password"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} password...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
    
    default:
      // Fallback to text input for unknown widget types
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${fieldName} value...`}
          className="flex-1 px-2 py-1 text-sm border rounded bg-white"
        />
      );
  }
};

export default FieldValueInput; 