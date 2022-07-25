import { useMemo } from 'react';
import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { orderBy } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import classNames from '../../utils/classnames';
import { UnderlyingTokenEntity } from '../../api/generated/graphql';
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
        <div className="flex flex-col gap-5">
          {sortedUnderlyingTokens.map((underlyingToken) => (
            <Disclosure
              key={underlyingToken.name}
              as="div"
              className="bg-gradient-primary shadow-md rounded-lg px-3 py-2 overflow-hidden"
              data-cy={`underlying-assets-${underlyingToken.name}`}
            >
              {({ open }) => (
                <>
                  <Disclosure.Button
                    as="div"
                    className="cursor-pointer sm:cursor-auto sm:pointer-events-none"
                  >
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1 flex items-start">
                        <div className="flex-shrink-0 self-center">
                          <Image
                            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${underlyingToken.address}/logo.png`}
                            alt={underlyingToken.name}
                            height={40}
                            width={40}
                            className="rounded-full"
                            data-cy="underlying-asset-image"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pl-4 pr-0 sm:pr-4 grid grid-cols-2 sm:grid-cols-5 sm:gap-4 items-center">
                          <div className="flex flex-col justify-between">
                            <p
                              className="text-base font-bold"
                              data-cy="underlying-asset-symbol"
                            >
                              {underlyingToken.symbol}
                            </p>
                            <p
                              className="text-xs text-sub-dark"
                              data-cy="underlying-asset-name"
                            >
                              {underlyingToken.name}
                            </p>
                          </div>
                          <div className="flex sm:flex-col text-right sm:text-left items-center sm:items-start ml-auto sm:ml-0 gap-x-4">
                            <div>
                              <p
                                className="text-base"
                                data-cy="underlying-asset-price"
                              >
                                {formatBalanceCurrency(
                                  underlyingToken.marketData[0].currentPrice,
                                  defaultLocale,
                                  defaultCurrency,
                                )}
                              </p>
                              <p className="text-xs text-secondary">
                                <span data-cy="underlying-asset-24h-price-change">
                                  {formatBalanceCurrency(
                                    underlyingToken.marketData[0]
                                      .twentyFourHourChange.price,
                                    defaultLocale,
                                    defaultCurrency,
                                  )}
                                </span>
                                {' / '}
                                <span data-cy="underlying-asset-24h-price-percentage-change">
                                  {formatAsPercent(
                                    underlyingToken.marketData[0]
                                      .twentyFourHourChange.change,
                                    defaultLocale,
                                  )}
                                </span>
                              </p>
                            </div>
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: open ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex sm:hidden"
                            >
                              <ChevronDownIcon
                                className="h-5 w-5 text-primary"
                                aria-hidden="true"
                              />
                            </motion.div>
                          </div>
                          <div className="flex-col justify-center text-right hidden sm:block">
                            <p
                              className={classNames(`text-base text-primary`)}
                              data-cy="underlying-asset-amount-per-token"
                            >
                              {formatBalance(
                                underlyingToken.marketData[0].amountPerToken,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                          <div className="flex-col justify-center text-right hidden sm:block">
                            <p
                              className={classNames(
                                `text-base text-primary font-medium`,
                              )}
                              data-cy="underlying-asset-total-held"
                            >
                              {formatBalance(
                                underlyingToken.marketData[0].totalHeld,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                          <div className="hidden sm:block flex-col justify-center text-right">
                            <p
                              className={classNames(
                                `text-base text-primary font-medium`,
                              )}
                              data-cy="underlying-asset-allocation"
                            >
                              {formatBalance(
                                underlyingToken.marketData[0].allocation,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Disclosure.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <Disclosure.Panel
                        as={motion.div}
                        initial="collapsed"
                        animate="open"
                        static
                        exit="collapsed"
                        key={'panel-' + underlyingToken.name}
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="bg-background rounded-lg overflow-hidden"
                      >
                        <motion.div
                          variants={{
                            collapsed: { scale: 0.8 },
                            open: { scale: 1 },
                          }}
                          transition={{ duration: 0.3 }}
                          className="origin-top-center p-4"
                        >
                          <div className="flex justify-between">
                            <p>{t('amountPerToken')}</p>
                            <p className="text-base text-primary">
                              {formatBalance(
                                underlyingToken.marketData[0].amountPerToken,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p>{t('totalHeld')}</p>
                            <p className="text-base text-primary">
                              {formatBalance(
                                underlyingToken.marketData[0].totalHeld,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p>{t('allocation')}</p>
                            <p className="text-base text-primary">
                              {formatBalance(
                                underlyingToken.marketData[0].allocation,
                                defaultLocale,
                                2,
                              )}
                            </p>
                          </div>
                        </motion.div>
                      </Disclosure.Panel>
                    )}
                  </AnimatePresence>
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
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
