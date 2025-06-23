// Type definitions for algorithm data
export interface AlgorithmParams {
  type: string;
  title: string;
  required: string[];
  properties: {
    [key: string]: {
      type: string;
      title: string;
      examples?: string[];
      description: string;
      enum?: string[];
      const?: string;
    };
  };
}

export interface AlgorithmData {
  key: string;
  name: string;
  description: string;
  market: string;
  tags: string[];
  params: AlgorithmParams;
  configuration: number[];
  compute_tier: number;
  id: string;
  _created: string;
  _creator: string;
  _updated: string | null;
  _updater: string | null;
  _realm: string | null;
  _deleted: string | null;
  _etag: string | null;
}
