import * as Checkbox from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "../../lib/utils";
import { FilterInputProps, QueryValue } from "../../types/querybuilder";

export const FilterInput: React.FC<FilterInputProps> = ({
  operator,
  metadata,
  value,
  onChange,
  customConfig,
  className,
}) => {
  // Use custom config if provided, otherwise use metadata input config
  const inputConfig = customConfig || metadata.input;

  const handleChange = (newValue: QueryValue) => {
    onChange(newValue);
  };

  const renderInput = () => {
    const baseClasses = cn("qb-filter-input", className);

    switch (inputConfig.type) {
      case "text":
        return (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={
              inputConfig.placeholder ||
              `Enter ${metadata.label.toLowerCase()}...`
            }
            className={baseClasses}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={(value as number) || ""}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={
              inputConfig.placeholder ||
              `Enter ${metadata.label.toLowerCase()}...`
            }
            min={inputConfig.min}
            max={inputConfig.max}
            step={inputConfig.step}
            className={baseClasses}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={baseClasses}
          />
        );

      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(baseClasses, "qb-filter-input--select")}
          >
            <option value="">Select {metadata.label.toLowerCase()}...</option>
            {inputConfig.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={
              inputConfig.placeholder ||
              `Enter ${metadata.label.toLowerCase()}...`
            }
            className={cn(baseClasses, "qb-filter-input--textarea")}
            rows={3}
          />
        );

      case "checkbox":
        return (
          <Checkbox.Root
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleChange(checked === true)}
            className={cn(baseClasses, "qb-filter-input--checkbox")}
          >
            <Checkbox.Indicator className="qb-checkbox-indicator">
              ✓
            </Checkbox.Indicator>
          </Checkbox.Root>
        );

      default:
        return (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={
              inputConfig.placeholder ||
              `Enter ${metadata.label.toLowerCase()}...`
            }
            className={baseClasses}
          />
        );
    }
  };

  return renderInput();
};

FilterInput.displayName = "FilterInput";
