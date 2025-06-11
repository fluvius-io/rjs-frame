/**
 * Utility functions for matchParams functionality
 */

// Combined match configuration interface
export interface MatchConfig {
  /** Check if the key does not exist at all */
  $absent?: true;
  /** Check if the key exists (regardless of value) */
  $exists?: true;
}

// Type for matchParams prop values
export type MatchParamValue = boolean | string | RegExp | MatchConfig;

export type MatchParams =
  | Record<string, MatchParamValue>
  | ((pageParams: Record<string, any>) => boolean);

/**
 * Check if a value is a match config object
 */
function isMatchConfig(value: any): value is MatchConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    ("$absent" in value || "$exists" in value)
  );
}

/**
 * Check if a component should render based on matchParams
 * @param matchParams - The matching parameters configuration
 * @param pageParams - The current page parameters
 * @param componentName - Name of the component for error logging (optional)
 * @returns true if component should render, false otherwise
 */
export function shouldRender(
  matchParams: MatchParams | undefined,
  pageParams: Record<string, any>,
  componentName: string = "Component"
): boolean {
  // If no matchParams specified, always render (null/empty means always rendered)
  if (!matchParams) {
    return true;
  }

  // If matchParams is a function, call it with the entire pageParams record
  if (typeof matchParams === "function") {
    try {
      return matchParams(pageParams);
    } catch (error) {
      console.error(`[${componentName}] Error in matchParams function:`, error);
      return false;
    }
  }

  // If matchParams is a record, check each match condition
  if (typeof matchParams === "object" && matchParams !== null) {
    // Handle empty object case
    if (Object.keys(matchParams).length === 0) {
      return true;
    }

    // Check each match condition
    for (const [key, matcher] of Object.entries(matchParams)) {
      const paramValue = pageParams[key];
      const paramExists = key in pageParams;

      // Handle match configuration objects
      if (isMatchConfig(matcher)) {
        // Check absence first (highest priority)
        if (matcher.$absent === true) {
          if (paramExists) {
            return false;
          }
          continue; // This condition passed, check next
        }

        // Check existence
        if (matcher.$exists === true) {
          if (!paramExists) {
            return false;
          }
          continue; // This condition passed, check next
        }

        // If MatchConfig object has no valid properties, treat as always true
        continue;
      }

      // For all other matchers, parameter must exist
      if (!paramExists) {
        return false;
      }

      // Boolean match: true/false
      if (typeof matcher === "boolean") {
        if (paramValue !== matcher) {
          return false;
        }
      }
      // String match: exact comparison
      else if (typeof matcher === "string") {
        if (paramValue !== matcher) {
          return false;
        }
      }
      // RegExp match: test against the regex
      else if (matcher instanceof RegExp) {
        if (!matcher.test(String(paramValue))) {
          return false;
        }
      }
    }

    // All conditions passed
    return true;
  }

  // Unknown matchParams type
  console.warn(
    `[${componentName}] Unknown matchParams type:`,
    typeof matchParams
  );
  return false;
}
