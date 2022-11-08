import React, { useRef, useState } from 'react';
import { useIsFirstRender } from 'usehooks-ts';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom, AxisScale } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { curveLinear } from '@visx/curve';
import { Bar, LinePath } from '@visx/shape';
import { motion, AnimatePresence } from 'framer-motion';
import { Annotation } from '@visx/annotation';
import { HtmlLabel } from '@visx/annotation';
import useTranslation from 'next-translate/useTranslation';
import { nanoid } from '@reduxjs/toolkit';
import { ChartDataFragment } from '../../api/generated/graphql';
import {
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import { useAppSelector } from '../../hooks';

type ValueOf<T> = T[keyof T];
type Index = ValueOf<Pick<ChartDataFragment, 'marketData'>>[0];

const subDark = 'rgba(115, 120, 165, 1)';
const axisBottomTickLabelProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Silka',
  fontSize: 10,
  fill: subDark,
};
const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Silka',
  fontSize: 10,
  textAnchor: 'end' as const,
  fill: subDark,
};

const variantsFlagTooltip = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const priceVariants = {
  visible: {
    pathLength: 1,
  },
  hidden: {
    pathLength: 0,
  },
};

// accessors
const getDate = (d: Index) => new Date(d.timestamp);
const getStockValue = (d: Index) => d.currentPrice;
const getNavValue = (d: Index) => d.nav;

export default function LineChart({
  data,
  gradientColor,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  noAnimation,
  top,
  left,
  children,
  hideTooltip,
  handleTooltip,
  showNav,
  showPrice,
  symbol,
}: {
  data: Index[];
  gradientColor: string;
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  symbol?: string;
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  noAnimation?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
  handleTooltip?: (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
  ) => void;
  hideTooltip?: () => void;
  className?: string;
  showNav?: boolean;
  showFlags?: boolean;
  showPrice?: boolean;
}) {
  const { t } = useTranslation();
  const refs = useRef<SVGPathElement[]>([]);
  const [hovered, setHovered] = useState<EventTarget & SVGPathElement>();
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );

  const isFirst = useIsFirstRender();

  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinearGradient
        id="gradient"
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      {showPrice && (
        <LinePath
          data={data}
          x={(d) => xScale(getDate(d)) || 0}
          y={(d) => yScale(getStockValue(d)) || 0}
          curve={curveLinear}
        >
          {({ path }) => {
            const d = path(data) || '';
            return (
              <motion.path
                d={d}
                data-cy="price-line"
                initial={!noAnimation && isFirst ? 'hidden' : 'visible'}
                variants={priceVariants}
                animate={'visible'}
                transition={
                  !noAnimation ? { duration: 1.5, bounce: 0 } : undefined
                }
                fill="none"
                stroke={
                  noAnimation
                    ? 'rgba(186, 189, 220, 1)'
                    : 'rgba(11, 120, 221, 1)'
                }
                strokeWidth={noAnimation ? 1 : 1.5}
              />
            );
          }}
        </LinePath>
      )}
      {showNav && (
        <LinePath
          data={data}
          x={(d) => xScale(getDate(d)) || 0}
          y={(d) => yScale(getNavValue(d)) || 0}
          curve={curveLinear}
          data-cy="nav-line"
        >
          {({ path }) => {
            const d = path(data) || '';
            return (
              <motion.path
                d={d}
                initial={!noAnimation && isFirst ? 'hidden' : 'visible'}
                variants={priceVariants}
                animate={'visible'}
                transition={
                  !noAnimation ? { duration: 1.5, bounce: 0 } : undefined
                }
                fill="none"
                stroke={noAnimation ? 'rgba(186, 189, 220, 1)' : subDark}
                strokeWidth={1}
              />
            );
          }}
        </LinePath>
      )}
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={'transparent'}
          tickStroke={subDark}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={'transparent'}
          tickStroke={subDark}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <Bar
          x={0}
          y={0}
          width={width - margin.left - margin.right}
          height={yMax}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
          className="cursor-crosshair"
        />
      )}
      {children}
    </Group>
  );
}
