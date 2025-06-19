/**
 * API Configuration for inv-main
 *
 * This file sets up the API manager with default collections
 */

import { APIManager, ApiCollectionConfig } from "rjs-frame";

// Set up IdmCollection configuration
const idmCollectionConfig: ApiCollectionConfig = {
  name: "idm",
  baseUrl: "/api",
  debug: true,
  queries: {
    user: {
      path: "/idm.user/",
      meta: "/_meta/idm.user/",
    },
    organization: {
      path: "/idm.organization/",
      meta: "/_meta/idm.organization/",
    },
  },
  processResponse: (response: any) => {
    let data = response.data;
    if (data && data.data) {
      response.data = data.data;
    }
    if (data && data.meta) {
      response.meta = data.meta;
    }
    return response;
  },
};

// Register the IdmCollection
APIManager.registerConfig(idmCollectionConfig);

export { APIManager };
