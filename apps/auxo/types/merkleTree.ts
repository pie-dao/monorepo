export type Recipient = {
  windowIndex: number;
  accountIndex: number;
  rewards: string;
  proof: string[];
};

export type PrvWithdrawalRecipient = {
  windowIndex: number;
  amount: string;
  proof: string[];
};

export type MerkleTreesByUser = {
  [user: string]: {
    [token: string]: {
      [month: string]: Recipient;
    };
  };
};

export type UserMerkleTree = MerkleTreesByUser['user'];

export type MerkleTree = {
  windowIndex: number;
  chainId: number;
  aggregateRewards: {
    address: string;
    symbol: string;
    decimals: number;
    amount: string;
    to_auxo: string;
    pro_rata: string;
  };
  recipients: {
    [address: string]: Recipient;
  };
  root: string;
};

export type PrvWithdrawalMerkleTree = {
  windowIndex: number;
  maxAmount: string;
  recipients: {
    [address: string]: PrvWithdrawalRecipient;
  };
  root: string;
};
