import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getAppSettingsValue,
  getAppState,
  subscribeToAppState,
  updateAppSettings,
  updatePageParams,
} from "../store/appStateStore";
import "../styles/components/PageParamsManager.css";
import type { AppState, PageParams } from "../types/AppState";
import { isValidFragmentName } from "../utils/urlUtils";

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

export interface PageParamsManagerProps {
  /** Optional callback when page parameters change */
  onArgumentsChange?: (params: PageParams) => void;
}

export function PageParamsManager({
  onArgumentsChange,
}: PageParamsManagerProps) {
  const [appState, setAppState] = useState<AppState>(getAppState());
  const [editingParams, setEditingParams] = useState<EditingParam[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [fontSize, setFontSize] = useState<number>(
    getAppSettingsValue("fontSize", 16)
  );
  const nextIdRef = useRef(1);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to appStateStore manually
  useEffect(() => {
    unsubscribeRef.current = subscribeToAppState((value: AppState) => {
      setAppState(value);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // Update root font size when fontSize changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const { pageParams = {} } = appState || {};

  // Validate fragment name
  const validateFragmentName = useCallback(
    (name: string): { isValid: boolean; error?: string } => {
      if (!name.trim()) {
        return { isValid: false, error: "Fragment name cannot be empty" };
      }

      if (!isValidFragmentName(name)) {
        return {
          isValid: false,
          error: `Invalid fragment name: ${name}`,
        };
      }

      return { isValid: true };
    },
    []
  );

  // Convert pageParams to editing format with stable IDs
  const convertToEditingParams = useCallback(
    (params: PageParams): EditingParam[] => {
      return Object.entries(params).map(([key, value]) => {
        const validation = validateFragmentName(key);
        return {
          id: `param-${nextIdRef.current++}`,
          key,
          value: typeof value === "boolean" ? value : String(value),
          isValid: validation.isValid,
        };
      });
    },
    [validateFragmentName]
  );

  // Update validation errors when editing params change
  useEffect(() => {
    const errors: ValidationError[] = [];
    editingParams.forEach((param) => {
      if (!param.isValid) {
        const validation = validateFragmentName(param.key);
        if (!validation.isValid) {
          errors.push({
            id: param.id,
            message: validation.error || "Invalid fragment name",
          });
        }
      }
    });
    setValidationErrors(errors);
  }, [editingParams, validateFragmentName]);

  // Sync with URL params when they change from any source
  useEffect(() => {
    const newEditingParams = convertToEditingParams(pageParams);
    setEditingParams(newEditingParams);
  }, [pageParams, convertToEditingParams]);

  // Convert editing params back to PageParams
  const convertToPageParams = useCallback(
    (params: EditingParam[]): PageParams => {
      const result: PageParams = {};
      params.forEach(({ key, value, isValid }) => {
        if (key && isValid) {
          result[key] = value;
        }
      });
      return result;
    },
    []
  );

  const commitChanges = useCallback(
    (params: EditingParam[]) => {
      const pageParamsToCommit = convertToPageParams(params);

      updatePageParams(pageParamsToCommit);

      if (onArgumentsChange) {
        onArgumentsChange(pageParamsToCommit);
      }
    },
    [convertToPageParams, onArgumentsChange]
  );

  const handleAddArgument = useCallback(() => {
    const newParam: EditingParam = {
      id: `param-${nextIdRef.current++}`,
      key: `param${editingParams.length + 1}`,
      value: `value${editingParams.length + 1}`,
      isValid: true,
    };
    const newParams = [...editingParams, newParam];
    setEditingParams(newParams);
    commitChanges(newParams);
  }, [editingParams, commitChanges]);

  const handleInputChange = useCallback(
    (id: string, field: "key" | "value", newValue: string | boolean) => {
      setEditingParams((prev) =>
        prev.map((param) => {
          if (param.id === id) {
            const updatedParam = { ...param, [field]: newValue };

            // Validate if changing the key
            if (field === "key") {
              const validation = validateFragmentName(String(newValue));
              updatedParam.isValid = validation.isValid;
            }

            return updatedParam;
          }
          return param;
        })
      );
    },
    [validateFragmentName]
  );

  const handleInputBlur = useCallback(() => {
    // Only commit valid changes
    const validParams = editingParams.filter(
      (param) => param.isValid && param.key.trim()
    );
    commitChanges(validParams);
  }, [editingParams, commitChanges]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        const validParams = editingParams.filter(
          (param) => param.isValid && param.key.trim()
        );
        commitChanges(validParams);
      }
    },
    [editingParams, commitChanges]
  );

  const handleRemoveArgument = useCallback(
    (id: string) => {
      const newParams = editingParams.filter((param) => param.id !== id);
      setEditingParams(newParams);
      commitChanges(newParams);
    },
    [editingParams, commitChanges]
  );

  const handleToggleBoolean = useCallback(
    (id: string) => {
      const newParams = editingParams.map((param) =>
        param.id === id
          ? {
              ...param,
              value: typeof param.value === "boolean" ? !param.value : true,
            }
          : param
      );
      setEditingParams(newParams);
      // Immediately commit the changes to the URL
      commitChanges(newParams);
    },
    [editingParams, commitChanges]
  );

  // Handle font size change
  const handleFontSizeChange = useCallback((newSize: number) => {
    setFontSize(newSize);
    updateAppSettings({ fontSize: newSize });
  }, []);

  const hasValidationErrors = validationErrors.length > 0;
  const validParamsCount = editingParams.filter((p) => p.isValid).length;

  return (
    <section className="pageparams-manager">
      <h3>Root Font Size Control</h3>
      {/* Font Size Control Section */}
      <div className="pageparams-manager__font-size-section">
        <div className="pageparams-manager__font-size-controls">
          <label className="pageparams-manager__font-size-label">
            Root Font Size: {fontSize}px
          </label>
          <div className="pageparams-manager__font-size-slider-container">
            <input
              type="range"
              min="10"
              max="20"
              step="1"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="pageparams-manager__font-size-slider"
            />
            <div className="pageparams-manager__font-size-range">
              <span>10px</span>
              <span>20px</span>
            </div>
          </div>
          <div className="pageparams-manager__font-size-presets">
            <button
              onClick={() => handleFontSizeChange(12)}
              className={`pageparams-manager__font-size-preset ${
                fontSize === 12
                  ? "pageparams-manager__font-size-preset--active"
                  : ""
              }`}
            >
              Small (12px)
            </button>
            <button
              onClick={() => handleFontSizeChange(16)}
              className={`pageparams-manager__font-size-preset ${
                fontSize === 16
                  ? "pageparams-manager__font-size-preset--active"
                  : ""
              }`}
            >
              Medium (16px)
            </button>
            <button
              onClick={() => handleFontSizeChange(18)}
              className={`pageparams-manager__font-size-preset ${
                fontSize === 18
                  ? "pageparams-manager__font-size-preset--active"
                  : ""
              }`}
            >
              Large (18px)
            </button>
          </div>
        </div>
      </div>

      <h3>
        Page Params Manager{" "}
        {hasValidationErrors && (
          <span className="error-count">
            ({validationErrors.length} errors)
          </span>
        )}
      </h3>

      <div className="pageparams-manager__info">
        <div className="pageparams-manager__info-item">
          <strong>URL Pattern:</strong> /path/-/param_name:value/boolean_flag
        </div>
        <div className="pageparams-manager__info-item">
          <strong>Active Params:</strong> {validParamsCount} valid
        </div>
        <div className="pageparams-manager__info-current">
          Current:{" "}
          {Object.entries(pageParams || {}).length
            ? Object.entries(pageParams || {})
                .map(([key, value]) => `${key}:${value}`)
                .join(", ")
            : "none"}
        </div>
      </div>

      {hasValidationErrors && (
        <div className="pageparams-manager__validation-errors">
          <strong>Validation Errors:</strong>
          <br />
          Parameter names must start with letter/digit/underscore, then can
          contain dots and dashes
          <br />
          <small>
            Names cannot start with a dash or dot, but can contain them after
            the first character.
          </small>
        </div>
      )}

      <div className="pageparams-manager__list">
        {editingParams.map((param) => {
          const error = validationErrors.find((e) => e.id === param.id);
          const isBooleanValue = typeof param.value === "boolean";

          return (
            <div
              key={param.id}
              className={`pageparams-manager__param ${
                param.isValid
                  ? "pageparams-manager__param--valid"
                  : "pageparams-manager__param--invalid"
              }`}
            >
              <div className="pageparams-manager__param-header">
                <div className="pageparams-manager__param-name-container">
                  <label className="pageparams-manager__param-label">
                    Name:
                  </label>
                  <input
                    value={param.key}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(param.id, "key", e.target.value)
                    }
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    placeholder="param_name"
                    className={`pageparams-manager__param-input ${
                      param.isValid
                        ? "pageparams-manager__param-input--valid"
                        : "pageparams-manager__param-input--invalid"
                    }`}
                  />
                  {error && (
                    <div className="pageparams-manager__param-error">
                      {error.message}
                    </div>
                  )}
                </div>
                <div
                  className={`pageparams-manager__param-validation-icon ${
                    param.isValid
                      ? "pageparams-manager__param-validation-icon--valid"
                      : "pageparams-manager__param-validation-icon--invalid"
                  }`}
                >
                  {param.isValid ? "✓" : "✗"}
                </div>
              </div>

              <div className="pageparams-manager__param-controls">
                {isBooleanValue ? (
                  <div className="pageparams-manager__param-boolean-controls">
                    <button
                      onClick={() => handleToggleBoolean(param.id)}
                      className={`pageparams-manager__button pageparams-manager__button--boolean-toggle ${
                        param.value
                          ? "pageparams-manager__button--boolean-toggle--true"
                          : "pageparams-manager__button--boolean-toggle--false"
                      }`}
                    >
                      Boolean: {String(param.value)}
                    </button>
                    <button
                      onClick={() => handleInputChange(param.id, "value", "")}
                      className="pageparams-manager__button"
                    >
                      To String
                    </button>
                  </div>
                ) : (
                  <div className="pageparams-manager__param-string-controls">
                    <div className="pageparams-manager__param-string-input-container">
                      <label className="pageparams-manager__param-label">
                        Value:
                      </label>
                      <input
                        value={String(param.value)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(param.id, "value", e.target.value)
                        }
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        placeholder="value"
                        className="pageparams-manager__param-input pageparams-manager__param-input--valid"
                      />
                    </div>
                    <button
                      onClick={() => handleInputChange(param.id, "value", true)}
                      className="pageparams-manager__button pageparams-manager__button--to-boolean"
                    >
                      To Boolean
                    </button>
                    <button
                      onClick={() => handleRemoveArgument(param.id)}
                      className="pageparams-manager__button pageparams-manager__button--remove"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAddArgument}
        className="pageparams-manager__add-button"
      >
        Add Parameter
      </button>

      <div className="pageparams-manager__examples">
        <div>
          <strong>Valid names:</strong> filter, user_id, Tab1, debug, user_name,
          filter_type, user.id, filter-type
        </div>
        <div>
          <strong>Invalid names:</strong> -param, .config, @user, user@domain,
          123-param
        </div>
      </div>
    </section>
  );
}
