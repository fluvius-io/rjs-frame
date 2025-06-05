import React, { Component } from 'react';
import { APIManager } from '../api/APIManager';
import { ApiResponse } from '../api/types';
import '../styles/components/EntityFormat.css';

export interface EntityFormatProps {
  _id: string;
  apiName?: string; // API endpoint name, defaults to 'entity'
  collectionName?: string; // Collection name if using multiple collections
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (data: any) => void;
  renderEntity?: (entity: any) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

interface EntityFormatState {
  entity: any | null;
  loading: boolean;
  error: Error | null;
}

export class EntityFormat extends Component<EntityFormatProps, EntityFormatState> {
  constructor(props: EntityFormatProps) {
    super(props);
    this.state = {
      entity: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchEntity();
  }

  componentDidUpdate(prevProps: EntityFormatProps) {
    // Refetch if the _id changes
    if (prevProps._id !== this.props._id || prevProps.apiName !== this.props.apiName) {
      this.fetchEntity();
    }
  }

  fetchEntity = async () => {
    const { _id, apiName = 'entity', collectionName, onError, onLoad } = this.props;

    if (!_id) {
      this.setState({ error: new Error('_id prop is required'), loading: false });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const fullApiName = collectionName ? `${collectionName}:${apiName}` : apiName;
      const response: ApiResponse<any> = await APIManager.queryItem(fullApiName, _id);
      
      this.setState({ 
        entity: response.data, 
        loading: false, 
        error: null 
      });

      if (onLoad) {
        onLoad(response.data);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch entity');
      this.setState({ 
        entity: null, 
        loading: false, 
        error: err 
      });

      if (onError) {
        onError(err);
      }
    }
  };

  renderLoading = (): React.ReactNode => {
    const { loadingComponent } = this.props;
    
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="entity-format-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  };

  renderError = (error: Error): React.ReactNode => {
    const { errorComponent } = this.props;
    
    if (errorComponent) {
      return errorComponent;
    }

    return (
      <div className="entity-format-error">
        <div className="error-message">
          Error loading entity: {error.message}
        </div>
        <button 
          onClick={this.fetchEntity}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  };

  renderEntity = (entity: any): React.ReactNode => {
    const { renderEntity } = this.props;

    if (renderEntity) {
      return renderEntity(entity);
    }

    // Default rendering - show entity as formatted JSON
    return (
      <div className="entity-format-default">
        <h3>Entity {entity.id || entity._id || 'Details'}</h3>
        <pre className="entity-data">
          {JSON.stringify(entity, null, 2)}
        </pre>
      </div>
    );
  };

  render(): React.ReactNode {
    const { className = '' } = this.props;
    const { entity, loading, error } = this.state;

    return (
      <div className={`entity-format ${className}`}>
        {loading && this.renderLoading()}
        {error && this.renderError(error)}
        {!loading && !error && entity && this.renderEntity(entity)}
        {!loading && !error && !entity && (
          <div className="entity-format-empty">
            No entity found
          </div>
        )}
      </div>
    );
  }
}

export default EntityFormat; 