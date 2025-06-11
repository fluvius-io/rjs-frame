import React, { useContext } from "react";
import {
  PageLayoutContext,
  PageSlotContext,
  type PageSlotContextType,
} from "../contexts/LayoutContexts";
import { pageStore } from "../store/pageStore";
import "../styles/index.css";
import { shouldRender, type MatchParams } from "../utils/matchParams";

export interface PageSlotProps {
  name?: string;
  renderEmpty?: boolean;
  allowToggle?: boolean;
  matchParams?: MatchParams;
  defaultParamValue?: string;
  className?: string;
  children?: React.ReactNode;
}

// Default template component - defined outside to prevent recreation on every render
const DefaultSlotTemplate: React.ComponentType<{
  content: React.ReactNode[];
}> = ({ content }) => <>{content}</>;

export const PageSlot = (props: PageSlotProps) => {
  const context = useContext(PageLayoutContext);
  const { name: slotName = "main", renderEmpty = false } = props;
  const pageParams = pageStore.get().pageParams || {};

  if (!context) {
    return (
      <div className="page-slot page-slot--error">
        ERROR: PageSlot must be rendered within a PageLayout
      </div>
    );
  }

  // Check if slot should be rendered based on matchParams
  if (!shouldRender(props.matchParams, pageParams, `PageSlot[${slotName}]`)) {
    return null;
  }

  let slotContent = context.pageModules[slotName];
  let hasSlotContent = !!slotContent && slotContent.length > 0;
  let renderingContent = hasSlotContent
    ? slotContent
    : props.children
    ? [props.children]
    : [];

  if (!renderEmpty && (!renderingContent || renderingContent.length === 0)) {
    return null;
  }

  let slotContext: PageSlotContextType = { name: slotName };

  const pageSlotClassName = `page-slot ${props.className || ""}`;

  return (
    <PageSlotContext.Provider value={slotContext}>
      <div className={pageSlotClassName} data-slot-name={slotName}>
        {renderingContent}
      </div>
    </PageSlotContext.Provider>
  );
};
