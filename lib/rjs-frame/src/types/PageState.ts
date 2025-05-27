export type AuthState = {
  user?: Record<string, any>;
  profile?: Record<string, any>;
  organization?: Record<string, any>;
};

export type PageArgument = [string, string];

export type LinkState = Record<string, string>;

export type VarsState = {
  _id: string;
  [key: string]: any;
};

export type PrivateState = {
  [key: string]: {
    component: string;
    [key: string]: any;
  };
};

export interface PageState {
  name: string;
  time: string;
  args: PageArgument[];
  link_state: LinkState;
  vars_state: VarsState;
  priv_state: PrivateState;
  auth: AuthState;
  other: Record<string, any>;
} 