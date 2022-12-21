import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';

export async function useGasPrice() {
  const { library } = useWeb3React();
  const gasPrice = useCallback(async () => {
    if (!library) return;
    const gasPriceOnChain = await library.getGasPrice();
    const formatted = +ethers.utils.formatUnits(gasPriceOnChain, 'gwei');
    return formatted;
  }, [library]);

  useEffect(() => {
    if (!library) return;
    library.on('block', gasPrice);
    return () => {
      library.removeListener('block', gasPrice);
    };
  }, [library, gasPrice]);
  const gasNow = await gasPrice();
  return gasNow;
}
