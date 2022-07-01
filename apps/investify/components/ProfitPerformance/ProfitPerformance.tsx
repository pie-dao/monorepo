import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import { useFindUserQuery } from '../../api/generated/graphql';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useFormattedBalance } from '../../hooks';
import classNames from '../../utils/classnames';

const ProfitPerformance: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { data } = useFindUserQuery({ address: account });
  const { hideBalance, defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );

  const profit = useFormattedBalance(
    data?.user?.profit,
    defaultLocale,
    defaultCurrency,
  );

  const performance =
    data?.user?.performance > 0
      ? `+${data?.user?.performance}%`
      : `${data?.user?.performance}%`;

  const ProfitPerformance = [
    {
      title: t('Profit'),
      value: profit,
    },
    {
      title: t('Performance'),
      value: performance,
    },
  ];
  return (
    <div className="flex flex-1 gap-4 items-center min-w-fit">
      {ProfitPerformance.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col flex-0 bg-gradient-primary shadow-md rounded-md lg:h-36 py-2 px-3 items-center w-full lg:max-w-xs"
          >
            <div className="flex self-end">ⓘ</div>
            <div className="flex items-center gap-x-2 self-start">
              <div className="flex-shrink-0 self-start hidden sm:block">
                <Image
                  src="/images/dashboard/pnl.png"
                  alt={item.title}
                  width={80}
                  height={76}
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-base font-medium text-sub-dark">
                  {t(`dashboard:${item.title}`)}
                </div>
                <h2
                  className={classNames(
                    'text-lg text-secondary font-medium',
                    hideBalance && 'hidden-balance',
                  )}
                >
                  {item.value}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfitPerformance;
