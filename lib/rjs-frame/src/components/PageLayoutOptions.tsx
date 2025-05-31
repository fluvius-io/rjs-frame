import React from 'react';
import { PageParamsManager } from './PageParamsManager';
import '../styles/components/PageLayoutOptions.scss';

export interface PageLayoutOptionsProps {
  isVisible: boolean;
  layoutId: string;
  modules: Record<string, React.ReactNode[]>;
  xRayEnabled: boolean;
  isActiveInstance: boolean;
  totalInstances: number;
  onClose: () => void;
  onToggleXRay: () => void;
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
      onToggleXRay 
    } = this.props;

    if (!isVisible) return null;

    const moduleKeys = Object.keys(modules);
    const moduleCount = moduleKeys.reduce((count, key) => count + modules[key].length, 0);

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
                  <span>{isActiveInstance ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              
              <div className="module-details">
                <h4>Module Slots Details:</h4>
                <ul>
                  {moduleKeys.map(key => (
                    <li key={key}>
                      <strong>{key}:</strong> {modules[key].length} module(s)
                    </li>
                  ))}
                </ul>
              </div>

              {totalInstances > 1 && (
                <div className="warning-message">
                  ⚠️ Warning: {totalInstances} PageLayout instances detected. Only the active instance responds to keyboard shortcuts.
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
                  {!isActiveInstance && ' (Disabled - not active instance)'}
                </p>
              </div>
            </section>

            <section className="page-layout-pageparams">
              <PageParamsManager />
            </section>
          </div>
          
          <div className="page-layout-options-footer">
            <p>Press <kbd>Ctrl+O</kbd> to toggle this dialog, <kbd>Esc</kbd> to close, or <kbd>Cmd+X</kbd>/<kbd>Alt+X</kbd> to toggle X-Ray mode</p>
            {!isActiveInstance && (
              <p className="inactive-warning">This instance is inactive and won't respond to keyboard shortcuts.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
} 