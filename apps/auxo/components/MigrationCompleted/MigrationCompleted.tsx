import { useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import Heading from '../Heading/Heading';
import PreviewMigration from '../veAUXOMigration/PreviewMigration';
import Image from 'next/image';
import { useMemo } from 'react';
import RiveComponent, { Alignment, Fit, Layout } from '@rive-app/react-canvas';
import AddToWallet from '../AddToWallet/AddToWallet';
import Link from 'next/link';
import classNames from '../../utils/classnames';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { TOKEN_NAMES } from '../../utils/constants';

type Props = {
  token: 'ARV' | 'PRV';
};

const MigrationCompleted: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation('migration');
  const {
    tx,
    isSingleLock,
    migrationType,
    DOUGHInput,
    positions,
    loadingPositions,
  } = useAppSelector((state) => state.migration);

  const textForMigrationType = useMemo(() => {
    const baseText = token === 'ARV' ? 'MigrationVeAUXO' : 'MigrationXAUXO';
    const lockText = isSingleLock ? 'singleLock' : 'multipleLocks';
    return t(`${lockText}${baseText}Completed`);
  }, [token, isSingleLock, t]);

  const shortenedHash = useMemo(() => {
    return tx?.hash?.slice(0, 5) + '...' + tx?.hash?.slice(-5);
  }, [tx]);

  const memoizedLocksLength = useMemo(() => {
    if (!positions) return 0;
    return (
      positions?.filter((position) => position?.lockDuration !== 0).length ?? 0
    );
  }, [positions]);

  return (
    <>
      <Heading
        title={textForMigrationType}
        subtitle={t('benefitsOfMigrating', { token: TOKEN_NAMES[token] })}
      />
      <section className="grid grid-cols-1 xl:grid-flow-col xl:auto-cols-fr gap-4 text-xs md:text-inherit mt-6">
        <div className="w-full transform overflow-hidden rounded-2xl bg-[url('/images/background/migrationCompleted.png')] p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl bg-cover mx-auto">
          <div className="h-[150px] w-full rounded-lg overflow-hidden mb-6">
            <RiveComponent
              src={
                token === 'ARV'
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
          <h3 className="font-bold text-center text-xl text-primary capitalize w-full">
            {t('common:transactionCompleted')}
          </h3>
          <div className="flex flex-col items-center justify-center w-full gap-y-6">
            <div className="mt-2">
              <AddToWallet token={token} displayName={TOKEN_NAMES[token]} />
            </div>
            <div className="mt-2">
              <p className="text-lg text-sub-dark text-center">
                {t('migrationCompletedDescription', {
                  token: TOKEN_NAMES[token],
                })}
              </p>
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
                      className="text-sm font-medium text-primary truncate underline max-w-xs"
                    >
                      {shortenedHash}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div
              className={classNames(
                'w-full gap-x-2 justify-between items-center flex',
                memoizedLocksLength === 0 && 'place-items-center',
              )}
            >
              {loadingPositions ? (
                <LoadingSpinner className="self-center h-full w-full" />
              ) : (
                <>
                  {memoizedLocksLength > 0 && (
                    <Link href="/migration/start" passHref>
                      <button className="w-full px-4 py-2 text-base rounded-full ring-inset ring-1 ring-secondary bg-secondary hover:bg-transparent hover:text-secondary text-white flex place-content-center">
                        {t('startAgain')}
                      </button>
                    </Link>
                  )}
                  <Link href={`/${token}`} passHref>
                    <button className="w-full px-4 py-2 text-base rounded-full ring-inset ring-1 ring-green bg-green hover:bg-transparent hover:text-green text-white flex place-content-center">
                      {t('goToToken', { token: TOKEN_NAMES[token] })}
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MigrationCompleted;
