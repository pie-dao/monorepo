import useTranslation from 'next-translate/useTranslation';
import BackBar from '../BackBar/BackBar';
import Heading from '../Heading/Heading';
import { useAppSelector } from '../../hooks';
import { formatDate } from '../../utils/dates';
import classNames from '../../utils/classnames';
import Lock from '../Lock/Lock';

const ChooseMigration: React.FC = () => {
  const { t } = useTranslation('migration');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { destinationWallet } = useAppSelector((state) => state.migration);
  const isSingleLock = false;

  const veDOUGHPositions = [
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
    {
      vested: formatDate('2021-10-01', defaultLocale),
      end: formatDate('2021-10-11', defaultLocale),
      amount: 2321,
    },
  ];

  return (
    <>
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateSubtitle')}
      />
      <BackBar token="veAUXO" />
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs md:text-inherit mt-6">
        <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center divide-y w-full font-medium">
          <div className="flex flex-col items-center w-full border-hidden gap-y-1">
            <h3 className="text-lg font-medium text-secondary">
              {t('veDOUGHToToken', { tokenOut: 'veAUXO' })}
            </h3>
          </div>
          <div className="flex w-full flex-col text-center">
            <div className="flex flex-col gap-y-2 mt-2 max-h-40 pr-4 overflow-y-scroll p-2">
              {veDOUGHPositions.map(({ vested, end, amount }, i) => (
                <div
                  key={i}
                  className={classNames(
                    'flex items-center gap-x-2 p-2 bg-secondary shadow-md text-white rounded-md',
                    i !== 0 && isSingleLock && 'opacity-30',
                  )}
                >
                  <div className="flex flex-shrink-0 w-5 h-5">
                    <Lock fill="#ffffff" isCompleted={false} />
                  </div>
                  <p className="font-normal">
                    <span className="font-medium">{t('vested')}</span>: {vested}
                  </p>
                  <p className="font-normal">
                    <span className="font-medium">{t('end')}</span>: {end}
                  </p>
                  <p className="ml-auto font-medium">
                    {amount} {t('veDOUGH')}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full pt-4">
            <p className="text-primary text-base font-medium pl-2">
              {t('wallet')}: <span>{destinationWallet}</span>
            </p>
          </div>
          <div className="flex flex-col w-full text-center pt-4">
            <button
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
              className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center"
            >
              {t('confirmAndUpgrade')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChooseMigration;
