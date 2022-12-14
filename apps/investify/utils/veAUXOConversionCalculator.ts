import { ethers } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';

const veAUXOConversionCalculator = (
  depositValue: BigNumberReference,
  commitmentValue: number,
  decimals: number,
) => {
  if (!Number.isNaN(Number(depositValue.value.toString())) && commitmentValue) {
    const k = 56.0268900276223;
    const commitmentMultiplier =
      (commitmentValue / k) * Math.log10(commitmentValue);

    return (
      Number(ethers.utils.formatUnits(depositValue.value, decimals)) *
      commitmentMultiplier
    );
  } else {
    return 0;
  }
};

export default veAUXOConversionCalculator;
