export type AuthState = {
  user?: Record<string, any>;
  profile?: Record<string, any>;
  organization?: Record<string, any>;
};

export type PageParams = Record<string, string | boolean>;

export type LinkParams = Record<string, string>;

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
  name: string;
  time: string;
  pageParams: PageParams;
  linkParams: LinkParams;
  globalState: GlobalState;
  moduleState: ModuleState;
  auth: AuthState;
  other: Record<string, any>;
} 