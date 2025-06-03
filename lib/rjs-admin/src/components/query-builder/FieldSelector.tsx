import React, { useState } from 'react';
import { FieldSelectorProps } from './types';
import { getAvailableFields } from './utils';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const FieldSelector: React.FC<FieldSelectorProps> = ({
  metadata,
  selectedFields,
  deselectedFields,
  onSelectedFieldsChange,
  onDeselectedFieldsChange,
}) => {
  const [showFields, setShowFields] = useState(false);
  const availableFields = getAvailableFields(metadata);

  const handleFieldToggle = (fieldName: string, isSelected: boolean) => {
    if (isSelected) {
      // Add to selected fields
      if (!selectedFields.includes(fieldName)) {
        onSelectedFieldsChange([...selectedFields, fieldName]);
      }
    } else {
      // Remove from selected fields
      onSelectedFieldsChange(selectedFields.filter(f => f !== fieldName));
    }
  };

  const handleDeselectFieldToggle = (fieldName: string, isDeselected: boolean) => {
    if (isDeselected) {
      // Add to deselected fields
      if (!deselectedFields.includes(fieldName)) {
        onDeselectedFieldsChange([...deselectedFields, fieldName]);
      }
    } else {
      // Remove from deselected fields
      onDeselectedFieldsChange(deselectedFields.filter(f => f !== fieldName));
    }
  };

  const clearAllSelections = () => {
    onSelectedFieldsChange([]);
    onDeselectedFieldsChange([]);
  };

  const selectAllFields = () => {
    onSelectedFieldsChange(availableFields);
    onDeselectedFieldsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Field Selection</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFields(!showFields)}
        >
          {showFields ? 'Hide' : 'Show'} Fields
        </Button>
      </div>

      {showFields && (
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllFields}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllSelections}>
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Select Fields Section */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-green-700">
                Include Fields ({selectedFields.length})
              </h4>
              <div className="max-h-48 overflow-y-auto border rounded p-2 bg-green-50/50">
                {availableFields.map(fieldName => {
                  const fieldMeta = metadata.fields[fieldName];
                  const isSelected = selectedFields.includes(fieldName);
                  
                  return (
                    <label
                      key={fieldName}
                      className={cn(
                        "flex items-center gap-2 p-1 rounded text-sm cursor-pointer hover:bg-green-100",
                        isSelected && "bg-green-100"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleFieldToggle(fieldName, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="font-mono text-xs">{fieldName}</span>
                      <span className="text-gray-600">({fieldMeta.label})</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-green-600 mt-1">
                If no fields selected, all fields will be included
              </p>
            </div>

            {/* Deselect Fields Section */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-red-700">
                Exclude Fields ({deselectedFields.length})
              </h4>
              <div className="max-h-48 overflow-y-auto border rounded p-2 bg-red-50/50">
                {availableFields.map(fieldName => {
                  const fieldMeta = metadata.fields[fieldName];
                  const isDeselected = deselectedFields.includes(fieldName);
                  
                  return (
                    <label
                      key={fieldName}
                      className={cn(
                        "flex items-center gap-2 p-1 rounded text-sm cursor-pointer hover:bg-red-100",
                        isDeselected && "bg-red-100"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isDeselected}
                        onChange={(e) => handleDeselectFieldToggle(fieldName, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="font-mono text-xs">{fieldName}</span>
                      <span className="text-gray-600">({fieldMeta.label})</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-red-600 mt-1">
                Excluded fields are processed after include selection
              </p>
            </div>
          </div>

          {/* Summary */}
          {(selectedFields.length > 0 || deselectedFields.length > 0) && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Selection Summary</h4>
              <div className="text-xs space-y-1">
                {selectedFields.length > 0 && (
                  <div>
                    <span className="text-green-700 font-medium">Include:</span>{' '}
                    <span className="font-mono">{selectedFields.join(', ')}</span>
                  </div>
                )}
                {deselectedFields.length > 0 && (
                  <div>
                    <span className="text-red-700 font-medium">Exclude:</span>{' '}
                    <span className="font-mono">{deselectedFields.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldSelector; 