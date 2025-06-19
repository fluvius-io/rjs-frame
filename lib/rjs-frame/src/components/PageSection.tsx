import React from "react";
import { pageStore } from "../store/pageStore";
import "../styles/index.css";
import { shouldRender, type MatchParams } from "../utils/matchParams";

export interface PageSectionProps {
  name?: string;
  matchParams?: MatchParams;
  className?: string;
  tag?: "div" | "section" | "header" | "footer" | "main" | "aside";
  children?: React.ReactNode;
}

let sectionCount = 0;

export const PageSection = (props: PageSectionProps) => {
  const {
    name = `section-${sectionCount++}`,
    tag = "section",
    className,
  } = props;
  const { pageParams = {} } = pageStore.get();

  if (!shouldRender(props.matchParams, pageParams, `PageSection[${name}]`)) {
    return null;
  }

  const renderContent = (children: React.ReactNode) => {
    return React.createElement(
      tag,
      {
        className: `page-section ${className}`,
        "data-section-params": JSON.stringify(props.matchParams) || "",
      },
      children
    );
  };

  return renderContent(props.children);
};
