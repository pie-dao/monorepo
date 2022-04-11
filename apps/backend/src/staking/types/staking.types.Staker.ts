export interface Staker {
    id: string;
    accountVeTokenBalance: string;
    accountWithdrawableRewards: string;
    accountWithdrawnRewards: string;
    accountLocks: Lock[];
    accountRewards: Reward[];
}

export interface Lock {
    id: string;
    lockId: string;
    lockDuration: string;
    lockedAt: string;
    amount: string;
    withdrawn: string;
    ejected: boolean;
    boosted: boolean;
}

interface Reward {
    amount: string;
    id: string;
    timestamp: string;
    type: string;
}