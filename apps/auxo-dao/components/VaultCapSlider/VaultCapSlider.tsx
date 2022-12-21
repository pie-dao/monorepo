import { useMemo } from 'react';
import { useLocked } from '../../hooks/useMaxDeposit';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { formatBalance } from '../../utils/formatBalance';
import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/solid';

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
