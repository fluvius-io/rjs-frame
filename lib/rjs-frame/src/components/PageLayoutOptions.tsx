import React from "react";
import "../styles/components/PageLayoutOptions.css";
import { PageParamsManager } from "./PageParamsManager";

// Simple Trash2 icon component
const Trash2Icon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export interface PageLayoutOptionsProps {
  isVisible: boolean;
  layoutId: string;
  modules: Record<string, React.ReactNode[]>;
  xRayEnabled: boolean;
  isActiveInstance: boolean;
  totalInstances: number;
  onClose: () => void;
  onToggleXRay: () => void;
  onRemoveModule?: (slotName: string, moduleIndex: number) => void;
}

export class PageLayoutOptions extends React.Component<PageLayoutOptionsProps> {
  render() {
    const {
      isVisible,
      layoutId,
      modules,
      xRayEnabled,
      isActiveInstance,
      totalInstances,
      onClose,
      onToggleXRay,
      onRemoveModule,
    } = this.props;

    if (!isVisible) return null;

    const moduleKeys = Object.keys(modules);
    const moduleCount = moduleKeys.reduce(
      (count, key) => count + modules[key].length,
      0
    );

    return (
      <div className="page-layout-options-overlay">
        <div className="page-layout-options-dialog">
          <div className="page-layout-options-header">
            <h2>PageLayout Options</h2>
            <button
              className="page-layout-options-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="page-layout-options-content">
            <section className="page-layout-info">
              <h3>Layout Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Layout ID:</label>
                  <span>{layoutId}</span>
                </div>
                <div className="info-item">
                  <label>Module Slots:</label>
                  <span>{moduleKeys.length}</span>
                </div>
                <div className="info-item">
                  <label>Total Modules:</label>
                  <span>{moduleCount}</span>
                </div>
                <div className="info-item">
                  <label>Instance Status:</label>
                  <span>{isActiveInstance ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div className="module-details">
                <h4 className="border-b">Module Slots Details</h4>
                <ul>
                  {moduleKeys.map((slotName) => (
                    <li key={slotName} className="module-slot-item">
                      <div className="module-slot-header">
                        <strong>{slotName}</strong>
                      </div>
                      {modules[slotName].length > 0 && (
                        <ul className="module-list">
                          {modules[slotName].map((module, index) => {
                            // Try to get module name from React element
                            const moduleName = React.isValidElement(module)
                              ? (module.type as any)?.displayName ||
                                (module.type as any)?.name ||
                                (module.type as any)?.constructor?.name
                              : `Module ${index + 1}`;

                            return (
                              <li
                                key={`${slotName}-${index}`}
                                className="module-item"
                              >
                                <span className="module-name">
                                  {index + 1}.{" "}
                                  {[
                                    moduleName,
                                    (module as any)?.displayName,
                                    (module as any)?.name,
                                    (module as any)?.constructor?.name,
                                  ].join(" | ")}
                                </span>
                                {onRemoveModule && (
                                  <button
                                    className="module-remove-button"
                                    onClick={() =>
                                      onRemoveModule(slotName, index)
                                    }
                                    title={`Remove ${moduleName} from ${slotName}`}
                                    aria-label={`Remove ${moduleName} from ${slotName}`}
                                  >
                                    <Trash2Icon className="trash-icon" />
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {totalInstances > 1 && (
                <div className="warning-message">
                  ⚠️ Warning: {totalInstances} PageLayout instances detected.
                  Only the active instance responds to keyboard shortcuts.
                </div>
              )}
            </section>

            <section className="page-layout-controls">
              <h3>Debug Options</h3>
              <div className="control-item">
                <label>
                  <input
                    type="checkbox"
                    checked={xRayEnabled}
                    onChange={onToggleXRay}
                    disabled={!isActiveInstance}
                  />
                  Enable X-Ray Mode
                </label>
                <p className="control-description">
                  Shows visual borders around layout components for debugging
                  {!isActiveInstance && " (Disabled - not active instance)"}
                </p>
              </div>
            </section>

            <section className="page-layout-pageparams">
              <PageParamsManager />
            </section>
          </div>

          <div className="page-layout-options-footer">
            <p style={{ lineHeight: "2em" }}>
              Press <kbd>Option+O</kbd> / <kbd>Win+O</kbd> to toggle this
              dialog, <kbd>Esc</kbd> to close, <br />
              or <kbd>Option+X</kbd> / <kbd>Win+X</kbd> to toggle X-Ray mode
            </p>
            {!isActiveInstance && (
              <p className="inactive-warning">
                This instance is inactive and won't respond to keyboard
                shortcuts.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
