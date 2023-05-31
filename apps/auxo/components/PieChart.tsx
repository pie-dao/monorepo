import React, { useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { Annotation, Label, Connector, CircleSubject } from '@visx/annotation';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, to } from '@react-spring/web';
import { isEmpty } from 'lodash';

// accessor functions
const usage = (d: { label: string; value: number }) => d.value;

const defaultMargin = { top: 0, right: 20, bottom: 0, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  data: {
    label: string;
    value: number;
  }[];
  margin?: typeof defaultMargin;
  animate?: boolean;
};

export default function PieChart({
  width,
  height,
  data,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [selectedBrowser, setSelectedBrowser] = useState<string | null>(null);

  if (width < 10) return null;
  if (isEmpty(data)) return null;
  console.log(data);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2.5;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 80;

  // color scales
  const getBrowserColor = scaleOrdinal({
    domain: data.map((d) => d.label),
    range: ['#CE278F', '#6463AC', '#49C2F0'],
  });

  return (
    <svg width={width} height={height}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={data}
          pieValue={usage}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              getColor={(arc) => getBrowserColor(arc.data.label)}
              onClickDatum={(arc) =>
                setSelectedBrowser(
                  selectedBrowser && selectedBrowser === arc.data.label
                    ? null
                    : arc.data.label,
                )
              }
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
    return (
      <g key={key}>
        <animated.path
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <Annotation
            x={centroidX}
            y={centroidY}
            dx={centroidX > 0 ? 50 : -50}
            dy={centroidY > 0 ? 30 : -30}
          >
            <CircleSubject
              stroke="rgba(0,0,0,1)"
              fill="rgba(0,0,0,1)"
              radius={4}
            />
            <Connector type="elbow" />
            <Label
              backgroundFill="transparent"
              titleFontSize={12}
              subtitleDy={0}
              titleFontWeight="thin"
              title={getKey(arc)}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              subtitle={`${arc.data.value}%`}
              showAnchorLine={false}
            ></Label>
          </Annotation>
        )}
      </g>
    );
  });
}
