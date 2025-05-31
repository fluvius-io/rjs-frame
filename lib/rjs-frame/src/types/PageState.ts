export type AuthState = {
  user?: Record<string, any>;
  profile?: Record<string, any>;
  organization?: Record<string, any>;
};
export type SlotStatusValues = 'active' | 'hidden' | 'starting' | 'error';

export type PageParams = Record<string, string>;

export type LinkState = Record<string, string>;

export type SlotParams = Record<string, string | boolean>;

export type SlotStatus = {
  [key: string]: SlotStatusValues;
};

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
  linkParams: LinkState;
  slotParams: SlotParams;
  slotStatus: SlotStatus;
  globalState: GlobalState;
  moduleState: ModuleState;
  auth: AuthState;
  other: Record<string, any>;
} 