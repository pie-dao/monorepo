import ParentSizeModern from '@visx/responsive/lib/components/ParentSizeModern';
import classNames from '../../utils/classnames';
import { motion } from 'framer-motion';
import APYOverTime from './APYOverTime';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useLazyGetTokenChartQuery } from '../../api/generated/graphql';
import { dataRanges, INTERVAL } from '../../types/intervals';

function APYChart({ symbol }: { symbol: string }) {
  const [trigger] = useLazyGetTokenChartQuery();

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
            <APYOverTime
              width={width}
              height={height}
              symbol={symbol}
              dataRange={dataRange}
              showPrice={true}
              showNav={false}
            />
          )}
        </ParentSizeModern>
      </div>
    </div>
  );
}

export default APYChart;
