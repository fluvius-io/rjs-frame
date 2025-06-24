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
  created: string;
  creator: string;
  updated: string | null;
  updater: string | null;
  etag: string | null;
}
