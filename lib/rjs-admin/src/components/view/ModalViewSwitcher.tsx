import React from "react";
import { PageModule, updatePageParams } from "rjs-frame";
import { SwitcherProps, SwitcherViewComponentProps } from "./types";

export class ModalViewSwitcher extends PageModule<SwitcherProps> {
  static ViewRegistry = new Map<
    string,
    {
      itemView: React.ElementType;
      defaultProps: Record<string, Partial<SwitcherViewComponentProps>>;
    }
  >();

  static registerView(
    panelType: string,
    itemView: React.ElementType,
    defaultProps?: Record<string, Partial<SwitcherViewComponentProps>>
  ) {
    this.ViewRegistry.set(panelType, {
      itemView,
      defaultProps: defaultProps || {},
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.context?.registerParamSwitcher(this.props.paramKey, this.moduleId);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.context?.unregisterParamSwitcher(this.props.paramKey, this.moduleId);
  }

  getView(panelType: string) {
    const view = ModalViewSwitcher.ViewRegistry.get(panelType);
    if (!view) {
      throw new Error(`Item view ${panelType} not found`);
    }
    return view;
  }

  renderView(panelType: string, props: Partial<SwitcherViewComponentProps>) {
    const { itemView: ItemViewComponent, defaultProps } =
      this.getView(panelType);

    if (!ItemViewComponent) {
      return null;
    }

    return <ItemViewComponent {...defaultProps} {...props} />;
  }

  constructor(props: SwitcherProps) {
    super(props);
    this.context?.registerParamSwitcher(props.paramKey, this.moduleId);
  }

  private handleModalClose = () => {
    const { paramKey } = this.props;
    updatePageParams({ [paramKey]: undefined });
  };

  renderContent() {
    const { paramKey } = this.props;

    if (!this.context) {
      return null;
    }

    if (this.context.getParamSwitcher(paramKey) !== this.moduleId) {
      console.warn(
        `[ModalViewSwitcher] Param switcher ${paramKey} is not active, expected ${
          this.moduleId
        } but got ${this.context.getParamSwitcher(paramKey)}`
      );
      return null;
    }

    const { pageParams } = this.context;
    const paramValue = pageParams[paramKey];
    const isPanelActive = Boolean(paramValue);

    if (!isPanelActive) {
      return null;
    }

    const [panelType, itemId] = (paramValue as string).split(".");

    return this.renderView(panelType, {
      itemId,
      title: `Item Details [${panelType}]`,
      defaultTab: "details",
      open: true,
      onOpenChange: this.handleModalClose,
    });
  }
}

export default ModalViewSwitcher;
