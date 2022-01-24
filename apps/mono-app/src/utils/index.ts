import { BigNumber } from "@ethersproject/bignumber";
import { Balance } from "../store/vault/Vault";

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type AwaitedReturn<F extends (...args: any) => any> = Awaited<ReturnType<F>>

// format 1000000000 -> '1,000,000,000'
export const prettyNumber = (n?: number): string => n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0'

export const toScale = (amount: number, decimals: number) => BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

export const fromScale = (n: number | BigNumber, decimals: number) => typeof n === 'number' ? n : Number(n.toBigInt() / 10n ** BigInt(decimals));

export const toBalance = (n: number | BigNumber, decimals: number): Balance => ({
  label: fromScale(n, decimals),
  value: String(n)
})