import { useApproximatePendingAsUnderlying } from '../../hooks/useMaxDeposit';
import { Vault } from '../../store/products/products.types';
import {
  formatBalanceCurrency,
  formatBalance,
} from '../../utils/formatBalance';
import CardItem from './VaultSummaryItem';
import { useLocked } from '../../hooks/useMaxDeposit';

const VaultSummaryUser = ({
  loading,
  vault,
}: {
  loading: boolean;
  vault: Vault | undefined;
}) => {
  const pendingUnderlying = useApproximatePendingAsUnderlying();
  const locked = useLocked();
  return (
    <section
      className="
        flex flex-col w-full gap-y-3 h-full items-center mt-8"
    >
      <CardItem
        loading={loading}
        left={`Your ${vault?.underlyingSymbol} Wallet Balance`}
        right={formatBalance(vault?.userBalances?.wallet?.label)}
      />
      <CardItem
        loading={loading}
        left={`Your ${vault?.symbol} Balance`}
        right={formatBalance(vault?.userBalances?.vault?.label)}
      />
      <CardItem
        loading={loading}
        left={`Est. ${vault?.underlyingSymbol} Value`}
        right={formatBalance(vault?.userBalances?.vaultUnderlying?.label)}
      />
      <CardItem loading={loading} left="Fees" right="0 %" />
      <div
        className="
          h-[1px] bg-gray-300 w-full my-5"
      />

      <CardItem
        loading={loading}
        left={`Shares Pending Withdrawal`}
        right={formatBalance(
          vault?.userBalances?.batchBurn?.shares?.label ?? 0,
        )}
      />
      <CardItem
        loading={loading}
        left={'Total Locked Quantity'}
        right={formatBalance(locked)}
      />
      <CardItem
        loading={loading}
        left={`Est. ${vault?.underlyingSymbol} Withdrawal Value`}
        right={formatBalance(pendingUnderlying?.label ?? 0)}
      />
    </section>
  );
};

export default VaultSummaryUser;
