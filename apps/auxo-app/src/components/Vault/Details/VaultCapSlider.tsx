import { useSelectedVault } from '../../../hooks/useSelectedVault';
import { prettyNumber } from '../../../utils';
import { zeroBalance } from '../../../utils/balances';
import { useApproximatePendingAsUnderlying } from '../../../hooks/useMaxDeposit';
import { FaLock } from 'react-icons/fa';

export const useLocked = (): number => {
  /**
   * When computing total value locked in auxo, we take the deposits in underlying USDC
   * We also add the shares in the batch burn process, multiplied by the Exchange rate
   * NB: need to understand how much ER and Amount Per Share can differ
   */
  const vault = useSelectedVault();
  const amountDepositedUnderlying =
    vault?.userBalances?.vaultUnderlying ?? zeroBalance();
  const amountPendingUnderlying = useApproximatePendingAsUnderlying();
  return amountPendingUnderlying.label + amountDepositedUnderlying.label;
};

const VaultCapSlider = () => {
  const vault = useSelectedVault();
  const deposits = vault?.userBalances?.vaultUnderlying;
  const cap = vault?.cap.underlying;
  const currency = vault?.symbol;
  const amount = useLocked();
  const barWidth = (): string =>
    (cap ? Math.round((amount / cap.label) * 100) : 0) + '%';

  return (
    <div className="flex flex-col w-full text-baby-blue-dark text-xs sm:text-sm font-bold mb-3 sm:mb-2 px-1 sm:px-0">
      <div className="flex w-full justify-between px-1 mb-1 sm:mb-0">
        <div className="flex items-center">
          <FaLock className="mr-1" />
          {deposits ? (
            <p>
              {prettyNumber(amount)} {currency}
            </p>
          ) : (
            <p>0 {currency}</p>
          )}
        </div>
        <p>
          <span className="hidden sm:inline-block">MAX:</span>{' '}
          {prettyNumber(cap?.label)} {currency}
        </p>
      </div>
      <div className="w-full px-1 rounded-xl h-2 sm:h-4 flex items-center bg-white">
        <div
          className="h-1 sm:h-2 rounded-xl
                    bg-gradient-to-r from-return-0 via-return-60 to-return-100
                   "
          // cannot use string concat with arbitrary tailwind values
          style={{
            width: barWidth(),
            transitionDuration: '1s',
            transitionProperty: 'all',
          }}
        ></div>
      </div>
    </div>
  );
};

export default VaultCapSlider;
