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
  [key: string]: any;
};

export type ModuleState = {
  [key: string]: {
    component: string;
    [key: string]: any;
  };
};

export interface PageState {
  pageName: string;
  initTime: string;
  breadcrumbs: string[];
  pageParams: PageParams;
  linkParams: LinkParams;
  hashParams: HashParams;
  globalState: GlobalState;
  moduleState: ModuleState;
}

// Extended PageState with typed auth context for modern applications
export interface TypedPageState {
  pageName: string;
  initTime: string;
  breadcrumbs: string[];
  pageParams: PageParams;
  linkParams: LinkParams;
  hashParams: HashParams;
  globalState: GlobalState;
  moduleState: ModuleState;
  auth: AuthContext | null;
  other: Record<string, any>;
}
