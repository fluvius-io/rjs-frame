import * as Tabs from "@radix-ui/react-tabs";
import React, { Component, createContext, useContext } from "react";
import type { ApiParams, ApiResponse } from "rjs-frame";
import { APIManager } from "rjs-frame";
import "../../styles/components/itemview.css";

// Context for ItemView sub-components
export interface ItemViewContextValue {
  item: any | null;
  loading: boolean;
  error: Error | null;
  itemId: string;
  apiName: string;
  refreshItem: () => void;
}

const ItemViewContext = createContext<ItemViewContextValue | null>(null);

export const useItemView = () => {
  const context = useContext(ItemViewContext);
  if (!context) {
    throw new Error("useItemView must be used within an ItemView component");
  }
  return context;
};

// TabItem component for defining named tabs
export interface TabItemProps {
  name: string;
  label: string;
  children: React.ReactNode;
}

export const TabItem: React.FC<TabItemProps> = ({ children }) => {
  // This component is just a wrapper - the actual rendering is handled by ItemView
  return <>{children}</>;
};

export interface ItemViewProps {
  itemId: string;
  resourceName: string; // API endpoint name (can be "collection:queryName" or just "queryName")
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: (data: any) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  params?: ApiParams; // Additional parameters for the API call
  defaultTab?: string; // Default active tab
  children?: React.ReactNode; // Tab content components (TabItem components)
}

interface ItemViewState {
  item: any | null;
  loading: boolean;
  error: Error | null;
  activeTab: string;
}

export class ItemView extends Component<ItemViewProps, ItemViewState> {
  constructor(props: ItemViewProps) {
    super(props);
    this.state = {
      item: null,
      loading: false,
      error: null,
      activeTab: props.defaultTab || "details",
    };
  }

  componentDidMount() {
    this.fetchItem();
  }

  componentDidUpdate(prevProps: ItemViewProps) {
    // Refetch if the _id, apiName, or params change
    if (
      prevProps.itemId !== this.props.itemId ||
      prevProps.resourceName !== this.props.resourceName ||
      JSON.stringify(prevProps.params) !== JSON.stringify(this.props.params)
    ) {
      this.fetchItem();
    }
  }

  fetchItem = async () => {
    const {
      itemId: _id,
      resourceName: apiName,
      params,
      onError,
      onLoad,
    } = this.props;

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
      const response: ApiResponse<any> = await APIManager.queryItem(
        apiName,
        _id,
        {
          cache: true,
          ...params,
        }
      );

      this.setState({
        item: response.data,
        loading: false,
        error: null,
      });

      if (onLoad) {
        onLoad(response.data);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to fetch item");
      this.setState({
        item: null,
        loading: false,
        error: err,
      });

      if (onError) {
        onError(err);
      }
    }
  };

  refreshItem = () => {
    this.fetchItem();
  };

  handleTabChange = (value: string) => {
    this.setState({ activeTab: value });
  };

  // Extract TabItem components from children
  extractTabItems = (): TabItemProps[] => {
    const { children } = this.props;
    if (!children) return [];

    const tabItems: TabItemProps[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === TabItem) {
        tabItems.push(child.props as TabItemProps);
      }
    });

    return tabItems;
  };

  renderLoading = (): React.ReactNode => {
    const { loadingComponent } = this.props;

    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="iv__loading">
        <div className="iv__spinner">Loading item...</div>
      </div>
    );
  };

  renderError = (error: Error): React.ReactNode => {
    const { errorComponent } = this.props;

    if (errorComponent) {
      return errorComponent;
    }

    return (
      <div className="iv__error">
        <div className="iv__error-message">
          Error loading item: {error.message}
        </div>
        <button onClick={this.fetchItem} className="iv__retry">
          Retry
        </button>
      </div>
    );
  };

  renderItemDetails = (): React.ReactNode => {
    const { item } = this.state;

    if (!item) {
      return <div className="iv__empty">No item data available</div>;
    }

    return (
      <div className="iv__details">
        <h3 className="iv__title">Item {item.id || item._id || "Details"}</h3>
        <div className="iv__content">
          <pre className="iv__data">{JSON.stringify(item, null, 2)}</pre>
        </div>
      </div>
    );
  };

  render(): React.ReactNode {
    const { className = "", children } = this.props;
    const { item, loading, error, activeTab } = this.state;

    const contextValue: ItemViewContextValue = {
      item,
      loading,
      error,
      itemId: this.props.itemId,
      apiName: this.props.resourceName,
      refreshItem: this.refreshItem,
    };

    if (loading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError(error);
    }

    if (!item) {
      return (
        <div className={`item-view ${className}`}>
          <div className="iv__empty">No item found</div>
        </div>
      );
    }

    const tabItems = this.extractTabItems();
    const hasCustomTabs = tabItems.length >= 0;

    return (
      <ItemViewContext.Provider value={contextValue}>
        <div className={`item-view ${className} rjs-panel`}>
          <Tabs.Root
            value={activeTab}
            onValueChange={this.handleTabChange}
            className="iv__tabs"
          >
            {hasCustomTabs && (
              <Tabs.List className="iv__tabs-list rjs-panel-header">
                <h2 className="rjs-panel-header-title">Details</h2>
                <Tabs.Trigger value="details" className="iv__tab-trigger">
                  Details
                </Tabs.Trigger>
                {tabItems.map((tabItem) => (
                  <Tabs.Trigger
                    key={tabItem.name}
                    value={tabItem.name}
                    className="iv__tab-trigger"
                  >
                    {tabItem.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            )}

            <Tabs.Content value="details" className="iv__tab-content px-4">
              {this.renderItemDetails()}
            </Tabs.Content>

            {tabItems.map((tabItem) => (
              <Tabs.Content
                key={tabItem.name}
                value={tabItem.name}
                className="iv__tab-content px-4"
              >
                {tabItem.children}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </ItemViewContext.Provider>
    );
  }
}

export default ItemView;
