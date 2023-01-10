import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import Heading from '../Heading/Heading';
import PreviewMigration from '../veAUXOMigration/PreviewMigration';
import Image from 'next/image';
import { useMemo } from 'react';
import RiveComponent, { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import AddToWallet from '../AddToWallet/AddToWallet';
import Link from 'next/link';

type Props = {
  token: 'veAUXO' | 'xAUXO';
};

const MigrationCompleted: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const { tx, isSingleLock, migrationType, DOUGHInput } = useAppSelector(
    (state) => state.migration,
  );

  const textForMigrationType = useMemo(() => {
    const baseText = token === 'veAUXO' ? 'MigrationVeAUXO' : 'MigrationXAUXO';
    const lockText = isSingleLock ? 'singleLock' : 'multipleLocks';
    return t(`${lockText}${baseText}Completed`);
  }, [token, isSingleLock, t]);

  const shortenedHash = useMemo(() => {
    return tx?.hash?.slice(0, 5) + '...' + tx?.hash?.slice(-5);
  }, [tx]);

  return (
    <>
      <Heading
        title={textForMigrationType}
        subtitle={t('benefitsOfMigrating', { token })}
      />
      <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
        <div className="w-full transform overflow-hidden rounded-2xl bg-[url('/images/background/migrationCompleted.png')] p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl bg-cover mx-auto">
          <h3 className="font-bold text-center text-xl text-primary capitalize w-full">
            {t('common:transactionCompleted')}
          </h3>
          <div className="flex flex-col items-center justify-center w-full gap-y-6">
            <div className="mt-2">
              <AddToWallet token={token} />
            </div>
            <div className="mt-2">
              <p className="text-lg text-sub-dark text-center">
                {t('migrationCompletedDescription', { token })}
              </p>
            </div>
            <div className="h-[150px] w-full rounded-lg overflow-hidden">
              <RiveComponent
                src={
                  token === 'veAUXO'
                    ? `/animations/veDOUGH-veAUXO.riv`
                    : `/animations/veDOUGH-xAUXO.riv`
                }
                layout={
                  new Layout({
                    fit: Fit.Cover,
                    alignment: Alignment.Center,
                  })
                }
              />
            </div>
            <div className="divide-y flex flex-col items-center gap-x-2 self-center justify-between w-full">
              <PreviewMigration
                DOUGHInput={DOUGHInput}
                token={token}
                isSingleLock={isSingleLock}
                previewType={migrationType}
              />
              {tx?.hash && (
                <div className="flex items-center self-center justify-between w-full py-2">
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                    <Image
                      src={'/images/icons/etherscan.svg'}
                      alt={'etherscan'}
                      width={24}
                      height={24}
                    />
                    <span className="text-xl font-medium text-primary">
                      {t('blockExplorer')}
                    </span>
                  </div>
                  <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2">
                    <a
                      href={`https://goerli.etherscan.io/tx/${tx?.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xl font-medium text-secondary truncate underline max-w-xs"
                    >
                      {shortenedHash}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full text-center">
              <p className="uppercase text-secondary font-medium text-lg">
                {t('common:transactionCompleted')}
              </p>
            </div>
            <div className="w-full gap-x-2 justify-between items-center">
              <Link href="/migration/start" passHref>
                <button className="w-full px-4 py-2 text-base rounded-full ring-inset ring-1 ring-secondary bg-secondary hover:bg-transparent hover:text-secondary text-white flex">
                  {t('startAgain')}
                </button>
              </Link>
              <Link href={`/${token}`} passHref>
                <button className="w-full px-4 py-2 text-base rounded-full ring-inset ring-1 ring-green bg-green hover:bg-transparent hover:text-green text-white flex">
                  {t('goTo', { page: token })}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MigrationCompleted;
