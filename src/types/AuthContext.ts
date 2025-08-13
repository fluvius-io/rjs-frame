/**
 * Authentication Context Types
 * Type definitions for the authentication context structure
 */

export interface RealmAccess {
  roles: string[];
}

export interface ResourceRoles {
  roles: string[];
}

export interface ResourceAccess {
  account: ResourceRoles;
  [key: string]: ResourceRoles;
}

export interface AuthUser {
  active: boolean | null;
  name__family: string;
  name__given: string;
  name__middle: string | null;
  name__prefix: string | null;
  name__suffix: string | null;
  telecom__email: string;
  telecom__phone: string | null;
  username: string;
  verified_email: string;
  verified_phone: string | null;
  is_super_admin: boolean;
  status: string;
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  last_verified_request: string | null;
  _realm: string | null;
  _id: string;
  _created: string | null;
  _updated: string | null;
  _creator: string;
  _updater: string | null;
  _deleted: string | null;
  _etag: string | null;
}

export interface AuthProfile {
  _id: string;
  name: string;
}

export interface AuthOrganization {
  _id: string;
  name: string;
}

export interface AuthContext {
  realm: string;
  user: AuthUser;
  profile: AuthProfile;
  organization: AuthOrganization;
  iamroles: string[];
}
