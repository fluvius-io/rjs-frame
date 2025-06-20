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
  // Resize props
  resizable?: "left" | "right" | false;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  onResize?: (width: number) => void;
}

let sectionCount = 0;

export const PageSection = (props: PageSectionProps) => {
  const name = props.name || `section-${sectionCount++}`;
  const { pageParams = {} } = pageStore.get();

  if (!shouldRender(props.matchParams, pageParams, `Section[${name}]`)) {
    return null;
  }

  const {
    tag = "section",
    className,
    resizable = false,
    minWidth = 200,
    maxWidth = 800,
    defaultWidth = 300,
    onResize,
    children,
  } = props;

  let isResizing = false;

  const [width, setWidth] = React.useState(defaultWidth);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const startXRef = React.useRef<number>(0);
  const startWidthRef = React.useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;

    e.preventDefault();

    isResizing = true;
    sectionRef.current?.classList.add("resizing");
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth =
      resizable === "right"
        ? startWidthRef.current + deltaX
        : startWidthRef.current - deltaX;

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);
    onResize?.(clampedWidth);
  };

  const handleMouseUp = () => {
    isResizing = false;
    sectionRef.current?.classList.remove("resizing");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const sectionStyle: React.CSSProperties = resizable
    ? {
        width: `${width}px`,
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        position: "relative",
        flexShrink: 0,
      }
    : {};

  const sectionProps = {
    className: `page-section ${className || ""}`,
    "data-section-params": `${name}:${JSON.stringify(props.matchParams) || ""}`,
    style: sectionStyle,
  };

  if (!resizable) {
    return React.createElement(tag, sectionProps, children);
  }

  return (
    <div ref={sectionRef} className="page-section-resizable">
      {React.createElement(tag, sectionProps, children)}
      <div
        className={`page-section-resize-handle page-section-resize-handle--${resizable}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
