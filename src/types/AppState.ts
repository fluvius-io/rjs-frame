import type { AuthContext } from "./AuthContext";

export type PageParams = Record<string, string | boolean>;

export type LinkParams = Record<string, string>;

export type HashParams = Record<string, string>;

export type AppSettings = {
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
  appSettings: AppSettings;
  moduleState: ModuleState;
  auth: AuthContext | null;
}
