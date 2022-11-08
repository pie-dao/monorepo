import ParentSizeModern from '@visx/responsive/lib/components/ParentSizeModern';
import classNames from '../../utils/classnames';
import { motion } from 'framer-motion';
import PriceChart from './PriceChart';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useLazyGetTokenChartQuery } from '../../api/generated/graphql';
import { useBoolean } from 'usehooks-ts';
import { dataRanges, INTERVAL } from '../../types/intervals';

function ChartWrapper({ symbol }: { symbol: string }) {
  const [trigger] = useLazyGetTokenChartQuery();

  const { value: showPrice, setValue: setPriceValue } = useBoolean(true);
  const { value: showNav, toggle: toggleNav } = useBoolean(false);
  const {
    value: showFlags,
    setValue: setFlagValue,
    toggle: toggleFlags,
  } = useBoolean(true);

  const handlePriceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue(e.target.checked);
    !e.target.checked && setFlagValue(e.target.checked);
  };

  const [dataRange, setDataRange] = useState<INTERVAL>('1Y');

  const handleChartTime = (interval: INTERVAL) => {
    trigger({
      symbol,
      currency: 'USD',
      interval,
    });
    setDataRange(interval);
  };

  const { t } = useTranslation();
  return (
    <div data-cy="product-price-chart">
      <div
        data-cy="product-price-chart-range"
        className="flex gap-x-4 justify-around bg-gradient-primary rounded-full shadow-card w-full sm:w-fit px-4 py-1 text-xs ml-auto mb-12"
      >
        {dataRanges.map((range) => (
          <motion.div
            onClick={() => handleChartTime(range)}
            className={classNames(
              'relative cursor-pointer',
              dataRange === range && 'text-secondary',
            )}
            key={range}
            data-cy={range}
          >
            {t(range)}
            {dataRange === range && (
              <motion.div
                className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-secondary"
                layoutId={`underline-shared`}
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="h-[500px]">
        <ParentSizeModern>
          {({ width, height }) => (
            <PriceChart
              width={width}
              height={height}
              symbol={symbol}
              dataRange={dataRange}
              showPrice={showPrice}
              showNav={showNav}
              showFlags={showFlags}
            />
          )}
        </ParentSizeModern>
      </div>
      <div className="flex gap-x-4 justify-around sm:justify-start bg-gradient-primary rounded-full shadow-card w-full px-4 py-1 text-xs ml-auto mb-12">
        <label
          htmlFor="price-toggle"
          className={classNames(
            'inline-flex relative items-center cursor-pointer gap-x-2',
            !showNav && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            type="checkbox"
            checked={showPrice}
            id="price-toggle"
            data-cy="price-toggle"
            onChange={handlePriceValueChange}
            disabled={!showNav}
            className={classNames(
              'focus:outline-none outline-none focus:ring-0 cursor-pointer disabled:bg-gray-300 disabled:hover:bg-gray-300',
              !showNav && 'opacity-50 cursor-not-allowed',
            )}
          />
          <span className="text-sm text-primary">{t('showPrice')}</span>
          <svg
            width="29"
            height="3"
            viewBox="0 0 29 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.513672" width="29" height="2" rx="1" fill="#0b78dd" />
          </svg>
        </label>
        <label
          htmlFor="nav-toggle"
          className={classNames(
            'inline-flex relative items-center cursor-pointer gap-x-2',
            !showPrice && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            type="checkbox"
            checked={showNav}
            id="nav-toggle"
            data-cy="nav-toggle"
            onChange={toggleNav}
            disabled={!showPrice}
            className={classNames(
              'focus:outline-none outline-none focus:ring-0 disabled:bg-gray-300 disabled:hover:bg-gray-300 cursor-pointer',
              !showPrice &&
                'group-disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          />
          <span className={'text-sm text-primary'}>{t('showNav')}</span>
          <svg
            width="29"
            height="3"
            viewBox="0 0 29 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.513672" width="29" height="2" rx="1" fill="#7378A5" />
          </svg>
        </label>
        <label
          htmlFor="flags-toggle"
          className={classNames(
            'inline-flex relative items-center cursor-pointer gap-x-2',
            !showPrice && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            type="checkbox"
            checked={showFlags}
            id="flags-toggle"
            data-cy="flags-toggle"
            className="sr-only peer"
            disabled={!showPrice}
            onChange={toggleFlags}
          />
          <div className="w-6 h-3 bg-sub-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[-3px] after:bg-secondary after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          <span className="text-sm text-primary">{t('showFlags')}</span>
        </label>
      </div>
    </div>
  );
}

export default ChartWrapper;
