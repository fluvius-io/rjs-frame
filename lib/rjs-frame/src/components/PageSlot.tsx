import React, { useContext } from "react";
import {
  PageLayoutContext,
  PageSlotContext,
  type PageSlotContextType,
} from "../contexts/LayoutContexts";
import { pageStore } from "../store/pageStore";
import "../styles/index.css";
import { cn } from "../utils";
import { shouldRender, type MatchParams } from "../utils/matchParams";

type PageSlotWrapper = (
  children: React.ReactNode[],
  props: PageSlotProps
) => React.ReactNode[];

export interface PageSlotProps {
  name: string;
  matchParams?: MatchParams;
  className?: string;
  tag?: "div" | "section" | "header" | "footer" | "main" | "aside";
  children?: React.ReactNode;
  wrapper?: PageSlotWrapper;
}

export const PageSlot = (props: PageSlotProps) => {
  const pageContext = useContext(PageLayoutContext);
  const { name: slotName, tag = "section", className } = props;
  const { pageParams = {} } = pageStore.get();

  if (!pageContext) {
    return (
      <div className="page-slot page-slot--error">
        ERROR: PageSlot [{slotName}] must be rendered within a PageLayout
      </div>
    );
  }

  if (!shouldRender(props.matchParams, pageParams, `PageSlot[${slotName}]`)) {
    return null;
  }

  const renderContent = () => {
    const slotContent = pageContext.pageModules[slotName] || props.children;
    let wrapperContent = slotContent;
    if (props.wrapper) {
      wrapperContent = props.wrapper(slotContent, props);
    }

    const slotClass = cn(
      "page-slot",
      pageContext.slotClasses[slotName],
      className
    );

    return React.createElement(
      tag,
      {
        className: slotClass,
        "data-slot-name": slotName,
      },
      wrapperContent
    );
  };

  const slotContext: PageSlotContextType = { name: slotName };

  return (
    <PageSlotContext.Provider value={slotContext}>
      {renderContent()}
    </PageSlotContext.Provider>
  );
};
