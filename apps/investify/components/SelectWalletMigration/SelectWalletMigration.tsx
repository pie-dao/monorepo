import { useTokenBalance } from '../../hooks/useToken';
import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import AddressCard from '../MigrationCard/AddressCard';
import { isZero } from '../../utils/balances';

type Props = {
  token: string;
};
const SelectWalletMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');

  const noLocks = isZero(useTokenBalance(token), 18);
  const notVeAuxoOrNoLocks = token !== 'veAUXO' || !noLocks;

  return (
    <>
      <Heading title={t('selectWallet')} subtitle={t('selectWalletSubtitle')} />
      <BackBar />
      <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
        {notVeAuxoOrNoLocks && <AddressCard isCurrentWallet={true} />}
        <AddressCard isCurrentWallet={false} />
      </section>
      <div className="flex justify-center mt-6">
        <p className="text-sm text-sub-dark font-medium">
          {t('smartContractAddressNotAllowed')}
        </p>
      </div>
    </>
  );
};

export default SelectWalletMigration;
