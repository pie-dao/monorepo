export interface AirdropResponse {
    amount: string;
    airdropAmounts: AirdropAmount[];
}

export interface AirdropAmount {
    id: string;
    amount: string;
}