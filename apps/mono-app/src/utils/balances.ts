import { BigNumber } from "@ethersproject/bignumber";
import { Balance } from "../store/vault/Vault";

export const addBalances = (b1: Balance, b2: Balance): Balance => {
  const label = b1.label + b2.label;
  const value = BigNumber.from(b1.value)
    .add(BigNumber.from(b2.value))
    .toString();
  return {
    label,
    value,
  };
};

export const subBalances = (b1: Balance, b2: Balance): Balance => {
  const label = b1.label - b2.label;
  const value = BigNumber.from(b1.value)
    .sub(BigNumber.from(b2.value))
    .toString();
  return {
    label,
    value,
  };
};

export const zeroBalance = (): Balance => ({ label: 0, value: "0" });
