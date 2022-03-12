export type VaultRowEntry = {
  label: any;
  sort: {
    isSortable: boolean;
    value?: number | string;
  };
  addStyles?: boolean;
  icon?: React.ReactNode;
  isAction?: boolean;
  hide?: boolean;
};

export type VaultRow = Record<string, VaultRowEntry>;

export type VaultRowReturnValue = {
  rows: Array<{ address: string; data: VaultRow }>;
  headers: Array<keyof VaultRow>;
};

export type Sort = {
  index: number;
  asc: boolean;
};
