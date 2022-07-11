import {
  useSelectedVault,
  useVaultTokenBalance,
} from '../../hooks/useSelectedVault';
import { useState } from 'react';
import VaultInput from './VaultInput';
import { compareBalances, zeroBalance } from '../../utils/balances';
import ApproveWithdrawButton from './ApproveWithdrawButton';
import WithdrawButton from './WithdrawButton';
import { BalanceWarning } from './Alerts';
import { useStatus, WITHDRAWAL } from '../../hooks/useWithdrawalStatus';

export default function VaultWidthdraw() {
  const [withdrawValue, setWithdrawValue] = useState(zeroBalance);
  const activeVault = useSelectedVault();
  const parsedActutalBalance = useVaultTokenBalance();
  const status = useStatus();
  const { symbol } = activeVault;
  return (
    <>
      <VaultInput
        label={symbol}
        value={withdrawValue}
        setValue={setWithdrawValue}
        max={parsedActutalBalance}
      />
      <BalanceWarning
        open={compareBalances(parsedActutalBalance, 'lt', withdrawValue)}
      >
        You can only withdraw {parsedActutalBalance.label} {symbol}
      </BalanceWarning>
      <ApproveWithdrawButton
        withdraw={withdrawValue}
        setWithdraw={setWithdrawValue}
      />
      {status === WITHDRAWAL.READY && (
        <div className="h-64 bg-baby-blue-light rounded-xl p-3 text-baby-blue-dark mt-3 flex flex-col items-center justify-evenly">
          <p className="text-4xl font-bold underline underline-offset-4 decoration-white">
            Ready to Withdraw
          </p>
          <p className="">Withdraw your existing balance</p>
          <WithdrawButton />
        </div>
      )}
    </>
  );
}
