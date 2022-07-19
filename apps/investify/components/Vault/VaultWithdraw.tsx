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
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

export default function VaultWidthdraw() {
  const { t } = useTranslation();
  const [withdrawValue, setWithdrawValue] = useState(zeroBalance);
  const activeVault = useSelectedVault();
  const available = `${activeVault?.userBalances?.batchBurn?.available?.label} ${activeVault?.symbol}`;

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
        disabled={status === WITHDRAWAL.READY}
      />
      <BalanceWarning
        open={compareBalances(parsedActutalBalance, 'lt', withdrawValue)}
      >
        {t('maxWithdrawal', { max: `${parsedActutalBalance.label} ${symbol}` })}
      </BalanceWarning>
      <ApproveWithdrawButton
        withdraw={withdrawValue}
        setWithdraw={setWithdrawValue}
      />
      {status === WITHDRAWAL.READY && (
        <div className="mt-6">
          <p className="text-lg font-medium">{t('withdrawReady')}</p>
          <p className="mt-1 text-base">
            <Trans
              i18nKey="withdrawBalance"
              values={{ balance: available }}
              components={{
                balance: <span className="text-secondary" />,
              }}
            />
          </p>
          <WithdrawButton className="mt-6" />
        </div>
      )}
    </>
  );
}
