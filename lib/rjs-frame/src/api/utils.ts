import {
  ApiParams,
  ConfigurationError,
  UriPattern,
  UriProcessor,
} from "./types";

/**
 * Resolves a URI from a path, optional processor, and params, with baseUrl.
 * Throws ConfigurationError on invalid input.
 */
export function resolveUrl(
  path: UriPattern,
  processor?: UriProcessor,
  params?: ApiParams
): string {
  let url: string = path.replace(/\/\//g, "/").trim();

  if (url.includes("://")) {
    throw new ConfigurationError(
      `URI '${url}' is a full URL. Use ApiParams.baseUrl parameter instead.`
    );
  }

  if (processor) {
    url = processor(url, params);
  }

  if (url.includes("?")) {
    throw new ConfigurationError(
      `URI '${url}' contains a query string. Use ApiParams.search parameter instead.`
    );
  }

  if (params?.search) {
    let urlParams = new URLSearchParams(params.search);
    url = url + "?" + urlParams.toString();
  }

  let pathParams = params?.path || {};
  url = url.replace(/{(\w+)}/g, (match, key) => {
    if (pathParams[key]) {
      return pathParams[key];
    } else {
      throw new ConfigurationError(`Path parameter '${match}' not provided`);
    }
  });

  return url;
}
