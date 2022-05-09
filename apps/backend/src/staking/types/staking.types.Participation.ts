import { Staker } from "./staking.types.Staker";
import { Vote } from "./staking.types.Vote";

export interface Participation {
    address: string;
    delegatedTo: string;
    participation: number;
    staker: Staker;
    votes: Vote[];
}