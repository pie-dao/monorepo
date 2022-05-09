export interface Claimer {
  amount: string;
  metaData: Metadata;
}

export interface Metadata {
  reason: Array<string>;
}