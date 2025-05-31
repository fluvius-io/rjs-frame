import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageModule } from 'rjs-frame';
import { useNavigate, useLocation } from 'react-router-dom';
import { pageStore, isValidFragmentName, FRAGMENT_NAME_PATTERN } from 'rjs-frame';
import { buildUrlPath } from 'rjs-frame';
import type { SlotParams, PageState } from 'rjs-frame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, AlertTriangle, Check, X } from 'lucide-react';

export class ArgumentsModule extends PageModule {
  renderContent() {
    return <ArgumentsContent />;
  }
}

interface EditingParam {
  id: string; // Stable ID for React key
  key: string;
  value: string | boolean;
  isValid: boolean;
}

interface ValidationError {
  id: string;
  message: string;
}

function ArgumentsContent() {
  const [pageState, setPageState] = useState<PageState>(pageStore.get());
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use stable IDs for React keys to prevent input recreation
  const [editingParams, setEditingParams] = useState<EditingParam[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const nextIdRef = useRef(1);
  const isUpdatingFromUrl = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to pageStore manually
  useEffect(() => {
    unsubscribeRef.current = pageStore.subscribe((value) => {
      setPageState(value);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const { slotParams = {}, name = '' } = pageState || {};

  // Validate fragment name
  const validateFragmentName = useCallback((name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'Fragment name cannot be empty' };
    }
    
    if (!isValidFragmentName(name)) {
      return { 
        isValid: false, 
        error: `Invalid name. Must match pattern: ${FRAGMENT_NAME_PATTERN.source}` 
      };
    }
    
    return { isValid: true };
  }, []);

  // Convert slotParams to editing format with stable IDs
  const convertToEditingParams = useCallback((params: SlotParams): EditingParam[] => {
    return Object.entries(params).map(([key, value]) => {
      const validation = validateFragmentName(key);
      return {
        id: `param-${nextIdRef.current++}`,
        key,
        value: typeof value === 'boolean' ? value : String(value),
        isValid: validation.isValid
      };
    });
  }, [validateFragmentName]);

  // Update validation errors when editing params change
  useEffect(() => {
    const errors: ValidationError[] = [];
    editingParams.forEach(param => {
      if (!param.isValid) {
        const validation = validateFragmentName(param.key);
        if (!validation.isValid) {
          errors.push({
            id: param.id,
            message: validation.error || 'Invalid fragment name'
          });
        }
      }
    });
    setValidationErrors(errors);
  }, [editingParams, validateFragmentName]);

  // Sync with URL params only when they actually change from external source
  useEffect(() => {
    if (!isUpdatingFromUrl.current) {
      const newEditingParams = convertToEditingParams(slotParams);
      setEditingParams(newEditingParams);
    }
    isUpdatingFromUrl.current = false;
  }, [slotParams, convertToEditingParams]);

  // Convert editing params back to SlotParams
  const convertToSlotParams = useCallback((params: EditingParam[]): SlotParams => {
    const result: SlotParams = {};
    params.forEach(({ key, value, isValid }) => {
      if (key && isValid) {
        result[key] = value;
      }
    });
    return result;
  }, []);

  // Convert slotParams object to URL using framework utilities
  const getUrlFromParams = useCallback((params: SlotParams = {}): string => {
    const newUrl = buildUrlPath(name, params) + location.search;
    return newUrl;
  }, [name, location.search]);

  const commitChanges = useCallback((params: EditingParam[]) => {
    const slotParamsToCommit = convertToSlotParams(params);
    const newUrl = getUrlFromParams(slotParamsToCommit);
    isUpdatingFromUrl.current = true;
    navigate(newUrl, { replace: true });
  }, [convertToSlotParams, getUrlFromParams, navigate]);

  const handleAddArgument = useCallback(() => {
    const newParam: EditingParam = {
      id: `param-${nextIdRef.current++}`,
      key: `arg${editingParams.length + 1}`,
      value: `value${editingParams.length + 1}`,
      isValid: true
    };
    const newParams = [...editingParams, newParam];
    setEditingParams(newParams);
    commitChanges(newParams);
  }, [editingParams, commitChanges]);

  const handleInputChange = useCallback((id: string, field: 'key' | 'value', newValue: string | boolean) => {
    setEditingParams(prev => prev.map(param => {
      if (param.id === id) {
        const updatedParam = { ...param, [field]: newValue };
        
        // Validate if changing the key
        if (field === 'key') {
          const validation = validateFragmentName(String(newValue));
          updatedParam.isValid = validation.isValid;
        }
        
        return updatedParam;
      }
      return param;
    }));
  }, [validateFragmentName]);

  const handleInputBlur = useCallback(() => {
    // Only commit valid changes
    const validParams = editingParams.filter(param => param.isValid && param.key.trim());
    commitChanges(validParams);
  }, [editingParams, commitChanges]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const validParams = editingParams.filter(param => param.isValid && param.key.trim());
      commitChanges(validParams);
    }
  }, [editingParams, commitChanges]);

  const handleRemoveArgument = useCallback((id: string) => {
    const newParams = editingParams.filter(param => param.id !== id);
    setEditingParams(newParams);
    commitChanges(newParams);
  }, [editingParams, commitChanges]);

  const handleToggleBoolean = useCallback((id: string) => {
    setEditingParams(prev => prev.map(param => 
      param.id === id 
        ? { ...param, value: typeof param.value === 'boolean' ? !param.value : true }
        : param
    ));
  }, []);

  const hasValidationErrors = validationErrors.length > 0;
  const validParamsCount = editingParams.filter(p => p.isValid).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          URL Arguments
          {hasValidationErrors && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {validationErrors.length} errors
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <Label>Current Page:</Label>
            <Badge variant="outline" className="ml-2">{name || 'none'}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            URL Pattern: /{name}/-/argument_name:value/boolean_flag
          </div>
          <div className="text-sm">
            <Label>Active Arguments:</Label>
            <span className="ml-2">{validParamsCount} valid</span>
          </div>
        </div>

        <Separator />

        {hasValidationErrors && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Fragment names must match pattern: <code className="text-xs">{FRAGMENT_NAME_PATTERN.source}</code>
              <br />
              <small>Only letters, digits, and underscores are allowed.</small>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {editingParams.map((param) => {
            const error = validationErrors.find(e => e.id === param.id);
            const isBooleanValue = typeof param.value === 'boolean';
            
            return (
              <div key={param.id} className="flex items-start gap-2 p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`key-${param.id}`} className="text-xs">Name</Label>
                      <Input
                        id={`key-${param.id}`}
                        value={param.key}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(param.id, 'key', e.target.value)}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        placeholder="argument_name"
                        className={`${!param.isValid ? 'border-destructive' : ''}`}
                      />
                      {error && (
                        <p className="text-xs text-destructive mt-1">{error.message}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {param.isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isBooleanValue ? (
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={param.value ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleBoolean(param.id)}
                        >
                          Boolean: {String(param.value)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInputChange(param.id, 'value', '')}
                        >
                          Change to String
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <Label htmlFor={`value-${param.id}`} className="text-xs">Value</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`value-${param.id}`}
                            value={String(param.value)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(param.id, 'value', e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            placeholder="value"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInputChange(param.id, 'value', true)}
                          >
                            To Boolean
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveArgument(param.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <Button onClick={handleAddArgument} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Argument
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Valid names:</strong> filter, user_id, Tab1, debug</div>
          <div><strong>Invalid names:</strong> my-param, filter.type, user@domain</div>
        </div>
      </CardContent>
    </Card>
  );
} 