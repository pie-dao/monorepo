import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { useMemo } from 'react';
import { UnderlyingTokenEntity } from '../../api/generated/graphql';
import { orderBy } from 'lodash';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';

export default function UnderlyingAssets({
  tokens,
}: {
  tokens: Array<UnderlyingTokenEntity>;
}) {
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const { t } = useTranslation();

  const sortedUnderlyingTokens = useMemo(() => {
    return orderBy(
      tokens,
      (token) => token.marketData[0].marginalTVLPercentage,
      'desc',
    );
  }, [tokens]);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-medium mb-4">{t('underlyingTokens')}</h2>
      <div className="gap-y-5 w-full flex flex-col space-between mt-8">
        <div className="hidden items-center sm:flex">
          <div className="min-w-0 flex-1 flex items-start px-3">
            <div className="flex-shrink-0 w-[40px]"></div>
            <div className="min-w-0 flex-1 px-4 sm:grid sm:grid-cols-5 sm:gap-5 items-end">
              <div className="flex flex-col justify-between">
                <p className="text-xs">{t('token')}</p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-xs">{t('price')}</p>
              </div>
              <div className="hidden sm:flex flex-col justify-center text-right">
                <p className="text-xs">{t('amountPerToken')}</p>
              </div>
              <div className="hidden sm:flex flex-col justify-center text-right">
                <p className="text-xs text-primary">{t('totalHeld')}</p>
              </div>
              <div className="hidden sm:flex flex-col justify-center text-right">
                <p className="text-xs text-primary">{t('allocation')}</p>
              </div>
            </div>
          </div>
        </div>
        {sortedUnderlyingTokens.map((underlyingToken) => (
          <div
            key={underlyingToken.name}
            className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
            data-cy={`underlying-assets-${underlyingToken.name}`}
          >
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-start">
                <div className="flex-shrink-0 self-start">
                  <Image
                    src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${underlyingToken.address}/logo.png`}
                    alt={underlyingToken.name}
                    height={40}
                    width={40}
                    className="rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1 px-4 grid grid-cols-2 sm:grid-cols-5 sm:gap-4 items-center">
                  <div className="flex flex-col justify-between">
                    <p className="text-base font-bold" data-cy="name">
                      {underlyingToken.symbol}
                    </p>
                    <p className="text-xs text-sub-dark">
                      {underlyingToken.name}
                    </p>
                  </div>
                  <div className="flex-col justify-between text-right sm:text-left">
                    <p className="text-base" data-cy="price">
                      {formatBalanceCurrency(
                        underlyingToken.marketData[0].currentPrice,
                        defaultLocale,
                        defaultCurrency,
                      )}
                    </p>
                    <p className="text-xs text-secondary">
                      {`${formatBalanceCurrency(
                        underlyingToken.marketData[0].twentyFourHourChange
                          .price,
                        defaultLocale,
                        defaultCurrency,
                      )} / ${formatAsPercent(
                        underlyingToken.marketData[0].twentyFourHourChange
                          .change,
                        defaultLocale,
                      )}`}
                    </p>
                  </div>
                  <div className="flex-col justify-center text-right hidden sm:block">
                    <p className={classNames(`text-base text-primary`)}>
                      {formatBalance(
                        underlyingToken.marketData[0].amountPerToken,
                        defaultLocale,
                        3,
                      )}
                    </p>
                  </div>
                  <div className="flex-col justify-center text-right hidden sm:block">
                    <p
                      className={classNames(
                        `text-base text-primary font-medium`,
                      )}
                    >
                      {formatBalance(
                        underlyingToken.marketData[0].totalHeld,
                        defaultLocale,
                        3,
                      )}
                    </p>
                  </div>
                  <div className="hidden sm:block flex-col justify-center text-right">
                    <p
                      className={classNames(
                        `text-base text-primary font-medium`,
                      )}
                    >
                      {formatBalance(
                        underlyingToken.marketData[0].allocation,
                        defaultLocale,
                        3,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1 flex gap-4 flex-col sm:flex-row">
              <div className="flex flex-1 items-center gap-x-4">
                <div className="flex flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-secondary h-1.5 rounded-full"
                    style={{
                      width: formatAsPercent(
                        +underlyingToken.marketData[0].marginalTVLPercentage.toFixed(
                          0,
                        ),
                      ),
                    }}
                  ></div>
                </div>
                <div className="text-sm" data-cy="percentage">
                  {formatAsPercent(
                    +underlyingToken.marketData[0].marginalTVLPercentage.toFixed(
                      0,
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
