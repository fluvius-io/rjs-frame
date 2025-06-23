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
};

// Register the IdmCollection
APIManager.registerConfig(idmCollectionConfig);

const TRADE_APIS = [
  "signal",
  "data",
  "algo",
  "bot",
  "manager",
  "market-data",
  "executor",
  "market",
];
for (const api_name of TRADE_APIS) {
  APIManager.registerConfig({
    name: `trade-${api_name}`,
    dynamic: true,
    baseUrl: "/api",
  });
}

export { APIManager };
