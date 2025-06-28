import * as Tabs from "@radix-ui/react-tabs";
import { BotIcon, Loader2Icon, LucideFileWarning } from "lucide-react";
import React, { Component } from "react";
import type { ApiParams, ApiResponse, PageLayoutContext } from "rjs-frame";
import { APIManager } from "rjs-frame";
import { cn } from "../../lib/utils";
import "../../styles/components/itemview.css";
import { ItemViewContext, ItemViewContextValue } from "./context";
import { ItemViewProps, ItemViewState, TabItemProps } from "./types";

export const TabItem: React.FC<TabItemProps> = ({ children }) => {
  // This component is just a wrapper - the actual rendering is handled by ItemView
  return <>{children}</>;
};

export class ItemView extends Component<ItemViewProps, ItemViewState> {
  static TabItem = TabItem;
  declare readonly context: React.ContextType<typeof PageLayoutContext>;

  constructor(props: ItemViewProps) {
    super(props);
    this.state = {
      item: null,
      loading: false,
      error: null,
      activeTab: props.defaultTab || "default",
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

  updateState = (state: Partial<ItemViewState>) => {
    this.setState((prevState) => ({ ...prevState, ...state }));
  };

  fetchItem = async (fetchParams?: ApiParams) => {
    const {
      itemId,
      resourceName: apiName,
      params,
      onError,
      onLoad,
    } = this.props;

    if (!itemId) {
      this.updateState({
        error: new Error("itemId prop is required"),
        loading: false,
      });
      return;
    }

    if (!apiName) {
      this.updateState({
        error: new Error("apiName prop is required"),
        loading: false,
      });
      return;
    }

    this.updateState({ loading: true, error: null });

    try {
      const response: ApiResponse<any> = await APIManager.queryItem(
        apiName,
        itemId,
        {
          cache: true,
          ...params,
          ...fetchParams,
        }
      );

      this.updateState({
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
      this.updateState({
        item: null,
        loading: false,
        error: err,
      });

      if (onError) {
        onError(err);
      }
    }
  };

  handleTabChange = (value: string) => {
    this.updateState({ activeTab: value });
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

  get loadingVisible(): boolean {
    return this.state.loading && !this.state.item;
  }

  renderLoading = (): React.ReactNode => {
    return (
      <div
        className={cn(
          "iv__loading-overlay",
          "iv__loading-overlay--visible",
          "flex",
          "items-center",
          "gap-2"
        )}
      >
        <Loader2Icon className="w-6 h-6 animate-spin" />
        Loading data ...
      </div>
    );
  };

  renderError = (error: Error): React.ReactNode => {
    return (
      <div className="iv__error">
        <h3 className="text-lg font-bold flex gap-2 items-center">
          <LucideFileWarning className="w-6 h-6 text-destructive" />
          Error loading item...
        </h3>
        <p className="text-sm p-6 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => this.fetchItem({ cache: false })}
          className="iv__retry"
        >
          Retry
        </button>
      </div>
    );
  };

  renderItemJSON = (jsonView: boolean): React.ReactNode => {
    const { item } = this.state;

    if (!item) {
      return <div className="iv__empty">No item data available</div>;
    }

    if (!jsonView) {
      return null;
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

  renderItemHeader = (): React.ReactNode => {
    const { item, loading } = this.state;
    const { itemIcon: ItemIcon = BotIcon } = this.props;
    return (
      <div className="flex gap-2 max-w-full items-center">
        <div>
          {loading ? (
            <Loader2Icon className="h-6 w-6 animate-spin" />
          ) : (
            <ItemIcon
              className="h-6 w-6"
              onClick={() => {
                this.fetchItem({ cache: false });
              }}
            />
          )}
        </div>
        <div className="max-w-full">
          <h2 className="rjs-panel-header-title">{item.name || "[No name]"}</h2>
          <p className="text-xs text-muted-foreground">
            {item.description || "[No description]"}
          </p>
        </div>
      </div>
    );
  };

  renderItem = (): React.ReactNode => {
    const { className } = this.props;
    const { activeTab, item } = this.state;
    const tabItems = this.extractTabItems();
    const hasCustomTabs = tabItems.length >= 0;
    const itemJsonView =
      this.props.itemJsonView === undefined
        ? true
        : this.props.itemJsonView || !hasCustomTabs;

    return (
      <div className={`item-view ${className} rjs-panel relative`}>
        <Tabs.Root
          value={activeTab}
          onValueChange={this.handleTabChange}
          className="iv__tabs"
        >
          {hasCustomTabs && (
            <Tabs.List className="iv__tabs-list rjs-panel-header">
              {this.renderItemHeader()}
              <div className="flex gap-1">
                {tabItems.map((tabItem) => (
                  <Tabs.Trigger
                    key={tabItem.name}
                    value={tabItem.name}
                    className="iv__tab-trigger"
                  >
                    {tabItem.label}
                  </Tabs.Trigger>
                ))}
                {itemJsonView && (
                  <Tabs.Trigger value="default" className="iv__tab-trigger">
                    JSON
                  </Tabs.Trigger>
                )}
              </div>
            </Tabs.List>
          )}

          {tabItems.map((tabItem) => (
            <Tabs.Content
              key={tabItem.name}
              value={tabItem.name}
              className="iv__tab-content px-4"
            >
              {tabItem.children}
            </Tabs.Content>
          ))}
          <Tabs.Content value="default" className="iv__tab-content">
            {this.renderItemJSON(itemJsonView)}
          </Tabs.Content>
        </Tabs.Root>

        {/* Loading overlay */}
      </div>
    );
  };

  renderEmpty = (): React.ReactNode => {
    const { className = "" } = this.props;
    return (
      <div className={`item-view ${className}`}>
        <div className="iv__empty">No item found</div>
      </div>
    );
  };

  renderContent = (): React.ReactNode => {
    return (
      <>
        {this.renderItem()}
        {this.loadingVisible && this.renderLoading()}
      </>
    );
  };

  render(): React.ReactNode {
    const { item, loading, error } = this.state;

    const contextValue: ItemViewContextValue = {
      item,
      loading,
      error,
      itemId: this.props.itemId,
      apiName: this.props.resourceName,
      refreshItem: this.fetchItem,
    };

    if (error) {
      return this.renderError(error);
    }

    if (!item) {
      return this.renderEmpty();
    }

    return (
      <ItemViewContext.Provider value={contextValue}>
        {this.renderContent()}
      </ItemViewContext.Provider>
    );
  }
}

export default ItemView;
