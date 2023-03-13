import { useTokenBalance } from '../../hooks/useToken';
import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import AddressCard from '../MigrationCard/AddressCard';
import { isZero } from '../../utils/balances';
import MigrationFAQ from '../MigrationFAQ/MigrationFAQ';

type Props = {
  token: 'ARV' | 'PRV';
};
const SelectWalletMigration: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');

  const noLocks = isZero(useTokenBalance(token), 18);
  const notVeAuxoOrNoLocks = token !== 'ARV' || noLocks;

  return (
    <>
      <Heading title={t('selectWallet')} subtitle={t('selectWalletSubtitle')} />
      <BackBar
        title={t('chooseWhereToMigrate')}
        singleCard={!notVeAuxoOrNoLocks}
      >
        <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
          {notVeAuxoOrNoLocks && (
            <AddressCard isCurrentWallet={true} token={token} />
          )}
          <AddressCard isCurrentWallet={false} />
        </section>
      </BackBar>
      <MigrationFAQ />
    </>
  );
};

export default SelectWalletMigration;
