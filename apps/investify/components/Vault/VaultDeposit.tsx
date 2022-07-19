import {
  useSelectedVault,
  useUserTokenBalance,
} from '../../hooks/useSelectedVault';
import { useState } from 'react';
import VaultInput from './VaultInput';
import { compareBalances, zeroBalance } from '../../utils/balances';
import { useMaxDeposit } from '../../hooks/useMaxDeposit';
import DepositActions from './ApproveDepositButton';
import { BalanceWarning } from './Alerts';

export default function VaultDeposit() {
  const [depositValue, setDepositValue] = useState(zeroBalance);
  const max = useMaxDeposit();
  const balance = useUserTokenBalance();
  const label = useSelectedVault()?.underlyingSymbol;
  const compareMaxAndUserBalance = compareBalances(max, 'gte', balance)
    ? max
    : balance;

  return (
    <>
      <VaultInput
        label={label}
        value={depositValue}
        setValue={setDepositValue}
        max={compareMaxAndUserBalance}
      />
      <BalanceWarning
        open={compareBalances(compareMaxAndUserBalance, 'lt', depositValue)}
      >
        You can only deposit {compareMaxAndUserBalance.label} {label}
      </BalanceWarning>
      <DepositActions deposit={depositValue} setDeposit={setDepositValue} />
    </>
  );
}
