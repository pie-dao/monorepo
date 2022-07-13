import { useSelectedVault } from '../../hooks/useSelectedVault';
import { zeroBalance } from '../../utils/balances';
import { formatBalance } from '../../utils/formatBalance';
import { useApproximatePendingAsUnderlying } from '../../hooks/useMaxDeposit';
import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/solid';
import { useMemo } from 'react';

export const useLocked = (): number => {
  /**
   * When computing total value locked in auxo, we take the deposits in underlying USDC
   * We also add the shares in the batch burn process, multiplied by the Exchange rate
   * NB: need to understand how much ER and Amount Per Share can differ
   */
  const vault = useSelectedVault();
  const amountDepositedUnderlying =
    vault?.userBalances?.vaultUnderlying ?? zeroBalance;
  const amountPendingUnderlying = useApproximatePendingAsUnderlying();
  return amountPendingUnderlying.label + amountDepositedUnderlying.label;
};

const VaultCapSlider = () => {
  const vault = useSelectedVault();
  const cap = vault?.cap?.underlying;
  const currency = vault?.symbol;
  const amount = useLocked();
  const barWidth = useMemo((): string => {
    if (cap) {
      return Math.round((amount / cap.label) * 100) + '%';
    }
    return '0%';
  }, [amount, cap]);

  return (
    <div className="flex flex-col w-full text-xs sm:text-sm font-medium mb-3 sm:mb-2 px-1 sm:px-0">
      <div className="flex w-full justify-between px-1 mb-1 sm:mb-0">
        <div className="flex items-center">
          <div className="h-4 w-4">
            {cap?.label === amount ? <LockClosedIcon /> : <LockOpenIcon />}
          </div>
          <p>{barWidth}</p>
        </div>
        <p>
          <span className="hidden sm:inline-block">MAX:</span>{' '}
          {formatBalance(cap?.label)} {currency}
        </p>
      </div>
      <div className="mt-2 w-full rounded-xl h-2 flex items-center bg-white border border-custom-border">
        <div
          className={`h-2 rounded-xl bg-secondary`}
          style={{
            width: barWidth,
            transitionDuration: '0.6s',
            transitionProperty: 'all',
          }}
        ></div>
      </div>
    </div>
  );
};

export default VaultCapSlider;
