import { useApproximatePendingAsUnderlying } from '../../../hooks/useMaxDeposit';
import { Vault } from '../../../store/vault/Vault';
import { prettyNumber } from '../../../utils';
import CardItem from '../../UI/cardItem';
import WithdrawButton from '../Actions/Withdraw/WithdrawButton';
import { useLocked } from './VaultCapSlider';

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
        flex flex-col w-full justify-evenly h-full items-center"
    >
      <CardItem
        loading={loading}
        left={`Your ${vault?.symbol} Wallet Balance`}
        right={prettyNumber(vault?.userBalances?.wallet.label)}
      />
      <CardItem
        loading={loading}
        left={`Your auxo${vault?.symbol} Balance`}
        right={prettyNumber(vault?.userBalances?.vault.label)}
      />
      <CardItem
        loading={loading}
        left={`Est. ${vault?.symbol} Value`}
        right={prettyNumber(vault?.userBalances?.vaultUnderlying.label)}
      />
      <CardItem loading={loading} left="Fees" right="0 %" />
      <div
        className="
          h-[1px] bg-gray-300 w-full my-5"
      />

      <CardItem
        loading={loading}
        left={`Shares Pending Withdrawal`}
        right={prettyNumber(vault?.userBalances?.batchBurn.shares.label ?? 0)}
      />
      <CardItem
        loading={loading}
        left={'Total Locked Quantity'}
        right={prettyNumber(locked)}
      />
      <CardItem
        loading={loading}
        left={`Est. ${vault?.symbol} Withdrawal Value`}
        right={prettyNumber(pendingUnderlying.label ?? 0)}
      />
      <section
        className="flex justify-between items-center
          w-full mt-2 sm:my-1 text-gray-600"
      >
        <p className="font-bold ml-0 text-sm sm:text-base sm:ml-2">
          Available to withdraw
        </p>
        <WithdrawButton showAvailable />
      </section>
    </section>
  );
};

export default VaultSummaryUser;
