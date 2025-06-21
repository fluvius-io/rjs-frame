import React, { Component } from "react";
import type { ApiParams, ApiResponse } from "rjs-frame";
import { APIManager } from "rjs-frame";
import "./EntityFormat.css";

export interface EntityFormatProps {
  _id: string;
  apiName: string; // API endpoint name (can be "collection:queryName" or just "queryName")
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (data: any) => void;
  renderEntity?: (entity: any) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  params?: ApiParams; // Additional parameters for the API call
}

interface EntityFormatState {
  entity: any | null;
  loading: boolean;
  error: Error | null;
}

export class EntityFormat extends Component<
  EntityFormatProps,
  EntityFormatState
> {
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
    // Refetch if the _id, apiName, or params change
    if (
      prevProps._id !== this.props._id ||
      prevProps.apiName !== this.props.apiName ||
      JSON.stringify(prevProps.params) !== JSON.stringify(this.props.params)
    ) {
      this.fetchEntity();
    }
  }

  fetchEntity = async () => {
    const { _id, apiName, params, onError, onLoad } = this.props;

    if (!_id) {
      this.setState({
        error: new Error("_id prop is required"),
        loading: false,
      });
      return;
    }

    if (!apiName) {
      this.setState({
        error: new Error("apiName prop is required"),
        loading: false,
      });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      // Use APIManager.queryItem with the new API structure
      // The apiName can be in format "collection:queryName" or just "queryName"
      const response: ApiResponse<any> = await APIManager.queryItem(
        apiName,
        _id,
        {
          cache: true,
          ...params,
        }
      );

      this.setState({
        entity: response.data,
        loading: false,
        error: null,
      });

      if (onLoad) {
        onLoad(response.data);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to fetch entity");
      this.setState({
        entity: null,
        loading: false,
        error: err,
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
      <div className="entity-format__loading">
        <div className="entity-format__spinner">Loading...</div>
      </div>
    );
  };

  renderError = (error: Error): React.ReactNode => {
    const { errorComponent } = this.props;

    if (errorComponent) {
      return errorComponent;
    }

    return (
      <div className="entity-format__error">
        <div className="entity-format__error-message">
          Error loading entity: {error.message}
        </div>
        <button onClick={this.fetchEntity} className="entity-format__retry">
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
      <div className="entity-format__default">
        <h3 className="entity-format__title">
          Entity {entity.id || entity._id || "Details"}
        </h3>
        <pre className="entity-format__data">
          {JSON.stringify(entity, null, 2)}
        </pre>
      </div>
    );
  };

  render(): React.ReactNode {
    const { className = "" } = this.props;
    const { entity, loading, error } = this.state;

    return (
      <div className={`entity-format ${className}`}>
        {loading && this.renderLoading()}
        {error && this.renderError(error)}
        {!loading && !error && entity && this.renderEntity(entity)}
        {!loading && !error && !entity && (
          <div className="entity-format__empty">No entity found</div>
        )}
      </div>
    );
  }
}

export default EntityFormat;
