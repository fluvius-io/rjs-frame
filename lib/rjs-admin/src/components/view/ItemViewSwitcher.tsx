import React from "react";
import { PageModule, PageModuleProps, updatePageParams } from "rjs-frame";
import { ItemViewProps } from "./types";

export interface ItemViewSwitcherProps extends PageModuleProps {
  paramKey: string;
}

export class ItemViewSwitcher extends PageModule<ItemViewSwitcherProps> {
  static ItemViewRegistry = new Map<
    string,
    {
      itemView: React.ElementType;
      defaultProps: Record<string, any>;
    }
  >();

  static registerItemView(
    panelType: string,
    itemView: React.ElementType,
    defaultProps?: Record<string, any>
  ) {
    this.ItemViewRegistry.set(panelType, {
      itemView,
      defaultProps: defaultProps || {},
    });
  }

  getItemView(panelType: string) {
    const view = ItemViewSwitcher.ItemViewRegistry.get(panelType);
    if (!view) {
      throw new Error(`Item view ${panelType} not found`);
    }
    return view;
  }

  renderItemView(panelType: string, props: Partial<ItemViewProps>) {
    const { itemView: ItemViewComponent, defaultProps } =
      this.getItemView(panelType);

    if (!ItemViewComponent) {
      return null;
    }

    return <ItemViewComponent {...defaultProps} {...props} />;
  }

  componentDidMount() {
    console.log("ItemViewSwitcher mounted");
  }

  constructor(props: ItemViewSwitcherProps) {
    super(props);
  }

  private handlePanelClose = () => {
    const { paramKey } = this.props;
    updatePageParams({ [paramKey]: undefined });
  };

  renderContent() {
    const { paramKey } = this.props;

    if (!this.context) {
      return null;
    }

    const { pageParams } = this.context;
    const paramValue = pageParams[paramKey];
    const isPanelActive = Boolean(paramValue);

    if (!isPanelActive) {
      return null;
    }

    const [panelType, itemId] = (paramValue as string).split(".");

    return this.renderItemView(panelType, {
      itemId,
      resourceName: "user-profile:profile",
      defaultTab: "details",
    });
  }
}

export default ItemViewSwitcher;
