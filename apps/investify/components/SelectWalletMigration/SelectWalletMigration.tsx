import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import AddressCard from '../MigrationCard/AddressCard';

const SelectWalletMigration: React.FC = () => {
  const { t } = useTranslation('migration');

  return (
    <>
      <Heading title={t('selectWallet')} subtitle={t('selectWalletSubtitle')} />
      <BackBar token="veAUXO" />
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs md:text-inherit mt-6">
        <AddressCard isCurrentWallet={true} />
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
