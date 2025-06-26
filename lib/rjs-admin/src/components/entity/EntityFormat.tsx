import { Loader2, LucideFileWarning } from "lucide-react";
import React, { Component } from "react";
import type { ApiParams, ApiResponse } from "rjs-frame";
import { APIManager } from "rjs-frame";
import "./EntityFormat.css";

export interface EntityFormatProps {
  itemId: string;
  entity?: any;
  apiName?: string; // API endpoint name (can be "collection:queryName" or just "queryName")
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (data: any) => void;
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
  apiName: string = "no-existing-api-name";
  static formats: Record<string, typeof EntityFormat> = {};

  constructor(props: EntityFormatProps) {
    super(props);
    this.apiName = props.apiName || this.apiName;
    this.state = {
      entity: props.entity || null,
      loading: false,
      error: null,
    };
  }

  static registerFormat(name: string, format: typeof EntityFormat) {
    EntityFormat.formats[name] = format;
  }

  static formatEntity(formatName: string, entity: any): React.ReactNode {
    const EntityFormatComponent = EntityFormat.formats[formatName];
    if (!EntityFormatComponent) {
      return <div>Format {formatName} not found</div>;
    }
    if (typeof entity !== "object") {
      return <EntityFormatComponent itemId={entity} />;
    } else {
      return <EntityFormatComponent itemId={entity.id} entity={entity} />;
    }
  }

  componentDidMount() {
    this.fetchEntity();
  }

  componentDidUpdate(prevProps: EntityFormatProps) {
    // Refetch if the _id, apiName, or params change
    if (
      prevProps.itemId !== this.props.itemId ||
      prevProps.apiName !== this.props.apiName ||
      JSON.stringify(prevProps.params) !== JSON.stringify(this.props.params)
    ) {
      this.fetchEntity();
    }
  }

  protected fetchEntity = async () => {
    const { itemId, params, onError, onLoad } = this.props;
    const apiName = this.apiName;

    if (!itemId) {
      this.setState({
        error: new Error("itemId prop is required"),
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
        itemId,
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

      onLoad && onLoad(response.data);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to fetch entity");

      this.setState({
        entity: null,
        loading: false,
        error: err,
      });

      onError && onError(err);
    }
  };

  renderLoading = (): React.ReactNode => {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading ...
      </div>
    );
  };

  renderError = (error: Error): React.ReactNode => {
    const { entity } = this.state;
    return (
      <div
        title={error.message}
        onClick={this.fetchEntity}
        className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer"
      >
        <LucideFileWarning className="w-4 h-4 text-red-500" />
        {entity ? entity.id : this.props.itemId}
      </div>
    );
  };

  renderText = (entity: any): React.ReactNode => {
    return entity.name || entity.id || entity._id || "[Unknown]";
  };

  renderEntity = (entity: any): React.ReactNode => {
    // Default rendering - show entity as formatted JSON
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500">
        Entity {this.renderText(entity)}
        <pre>{JSON.stringify(entity, null, 2)}</pre>
      </div>
    );
  };

  render(): React.ReactNode {
    const { className = "" } = this.props;
    const { entity, loading, error } = this.state;
    if (loading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError(error);
    }

    if (!entity) {
      return <div className="ef__empty">Entity not found</div>;
    }

    return (
      <div className={`entity-format ${className}`}>
        {this.renderEntity(entity)}
      </div>
    );
  }
}

export default EntityFormat;
