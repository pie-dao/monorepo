import { useCallback, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { formatAsPercent, formatBalance } from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';
import { useEnanchedPools } from '../../hooks/useEnanchedPools';
import Countdown from '../Countdown/Countdown';
import { UseUserPreference } from '../../hooks/useLending';

import { PREFERENCES } from '../../utils/constants';
import { invert, isEqual } from 'lodash';
import { zeroBalance } from '../../utils/balances';
import { STATES } from '../../store/lending/lending.types';
import classNames from '../../utils/classnames';

type Props = {
  poolAddress: string;
};

const LendInfo: React.FC<Props> = ({ poolAddress }) => {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const { t } = useTranslation();
  const { data } = useEnanchedPools(poolAddress);
  const userPreference = UseUserPreference(poolAddress);
  const currentMonthYear = new Date().toLocaleString(defaultLocale, {
    month: 'long',
    year: 'numeric',
  });

  const poolState = useMemo(() => {
    const currentState = Object.keys(STATES).find(
      (key) => STATES[key as keyof typeof STATES] === data?.lastEpoch?.state,
    );

    return currentState?.toLowerCase() ?? '';
  }, [data?.lastEpoch?.state]);

  const classesByState = {
    [STATES.ACTIVE]:
      'bg-gradient-major-secondary-predominant bg-clip-text text-transparent',
    [STATES.PENDING]: 'text-secondary',
    [STATES.CLOSED]: 'text-primary',
    [STATES.LOCKED]: 'text-primary',
  };

  const preference = useMemo(() => {
    return Object.keys(PREFERENCES)
      .find(
        (key) =>
          PREFERENCES[key as keyof typeof PREFERENCES] === userPreference,
      )
      ?.toLowerCase();
  }, [userPreference]);

  const summaryData = useMemo(() => {
    return [
      {
        title: t('yourPrincipal'),
        value: (
          <>
            {formatBalance(
              data?.userData?.balance?.label ?? 0,
              defaultLocale,
              2,
              'standard',
            )}{' '}
            {data?.attributes?.token?.data?.attributes?.name}
          </>
        ),
      },
      {
        title: t('claimableYield'),
        value: (
          <>
            {formatBalance(
              data?.userData?.yield?.label ?? 0,
              defaultLocale,
              2,
              'standard',
            )}{' '}
            {data?.attributes?.token?.data?.attributes?.name}
          </>
        ),
      },
      {
        title: t('preference'),
        value:
          data?.userData?.balance?.label !== undefined &&
          !isEqual(data?.userData?.balance, zeroBalance)
            ? t(`lending${preference}`)
            : null,
      },
      {
        title: t('maxPoolCapacity'),
        value: (
          <>
            {formatBalance(
              data?.lastEpoch?.totalBorrow?.label ?? 0,
              defaultLocale,
              2,
              'standard',
            )}
            {' / '}
            {formatBalance(
              data?.lastEpoch?.depositLimit?.label ?? 0,
              defaultLocale,
              2,
              'standard',
            )}{' '}
            {data?.attributes?.token?.data?.attributes?.name}
          </>
        ),
      },
    ];
  }, [
    t,
    data?.userData?.balance,
    data?.userData?.yield?.label,
    data?.attributes?.token?.data?.attributes?.name,
    data?.lastEpoch?.totalBorrow?.label,
    data?.lastEpoch?.depositLimit?.label,
    defaultLocale,
    userPreference,
  ]);

  return (
    <div className="flex flex-col px-4 py-3 rounded-lg shadow-md bg-white gap-y-2 h-full">
      <div className="flex justify-between w-full mb-2 pb-2 border-b border-custom-border items-center">
        <p className="text-primary font-semibold text-lg">{currentMonthYear}</p>
        {data?.lastEpoch?.rate?.label ? (
          <p className="text-base text-white bg-gradient-major-secondary-predominant rounded-lg px-2 py-0.5 font-medium">
            {formatAsPercent(data?.lastEpoch?.rate?.label, defaultLocale, 2)}{' '}
            {t('APR')}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col  text-center w-full">
        <p className="text-primary font-medium text-lg">{t('poolState')}</p>
        <p
          className={classNames(
            'text-2xl font-semibold',
            classesByState[data?.lastEpoch?.state],
          )}
        >
          {t(poolState)}
        </p>

        {/* <Countdown date={data?.attributes?.date_until_next_state} /> */}
      </div>
      {summaryData.map(({ title, value }, index) => {
        if (!value) return null;
        return (
          <div
            className="bg-sidebar flex items-center gap-x-2 rounded-lg shadow-card self-center w-full p-2"
            key={index}
          >
            <dt className="text-base text-primary font-medium flex items-center gap-x-2">
              {title}
            </dt>
            <dd className="flex ml-auto font-semibold text-base text-primary">
              {value}
            </dd>
          </div>
        );
      })}
    </div>
  );
};

export default LendInfo;
