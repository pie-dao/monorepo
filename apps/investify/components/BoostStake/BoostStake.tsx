import useTranslation from 'next-translate/useTranslation';

const BoostStake: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 rounded-md shadow-md bg-white gap-y-3">
      <div className="text-center gap-y-3 flex flex-col">
        <h3 className="text-lg font-medium text-secondary">
          {t('boostPosition')}
        </h3>
        <p className="text-base text-sub-dark">
          {t('boostPositionDescription')}
        </p>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-full p-2">
        <div className="w-full flex justify-between">
          <dt className="text-base text-sub-dark flex items-center gap-x-2">
            {t('newStakingDate')}
          </dt>
          <dd className="flex ml-auto pr-2 font-medium text-base text-primary">
            Today to EndDate
          </dd>
        </div>
        <div className="w-full flex justify-between">
          <dt className="text-base text-sub-dark flex items-center gap-x-2">
            {t('newStakingDate')}
          </dt>
          <dd className="flex ml-auto pr-2 font-medium text-base text-primary">
            0.10% to 0.23%
          </dd>
        </div>
      </div>
      <div>
        <button className="w-full px-4 py-0.5 text-base text-secondary bg-transparent rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70">
          {t('boostNow')}
        </button>
      </div>
    </div>
  );
};

export default BoostStake;
