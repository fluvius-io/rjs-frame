import type { AuthContext } from "./AuthContext";

export type AuthState = {
  user?: Record<string, any>;
  profile?: Record<string, any>;
  organization?: Record<string, any>;
};

export type PageParams = Record<string, string | boolean>;

export type LinkParams = Record<string, string>;

export type HashParams = Record<string, string>;

export type GlobalState = {
  _id: string;
  xRay: boolean;
  [key: string]: any;
};

export type ModuleState = {
  [key: string]: {
    [key: string]: any;
  };
};

export interface AppState {
  pageName: string;
  initTime: string;
  breadcrumbs: string[];
  pagePath: string;
  pageParams: PageParams;
  linkParams: LinkParams;
  hashParams: HashParams;
  globalState: GlobalState;
  moduleState: ModuleState;
  auth: AuthContext | null;
}
