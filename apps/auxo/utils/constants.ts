import chroma from 'chroma-js';

export const AVG_SECONDS_IN_MONTH = 2628000;
export const AVG_SECONDS_IN_DAY = 86400;
export const MAX_LOCK_DURATION_IN_SECONDS = 94608000;
// JS to Solidity one hour
export const ONE_HOUR_DEADLINE = 3600000;
export const DEADLINE = Math.floor(
  Date.now() / 1000 + ONE_HOUR_DEADLINE,
).toString();

export const CONVERSION_CURVE = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '83333333333300000', // 6
  '105586554548800000', // 7
  '128950935744800000', // 8
  '153286798191400000', // 9
  '178485723463700000', // 10
  '204461099502300000', // 11
  '231142134539100000', // 12
  '258469880674300000', // 13
  '286394488282000000', // 14
  '314873248847800000', // 15
  '343869161986300000', // 16
  '373349862059400000', // 17
  '403286798191400000', // 18
  '433654597035900000', // 19
  '464430560048100000', // 20
  '495594261536300000', // 21
  '527127223437300000', // 22
  '559012649336100000', // 23
  '591235204823000000', // 24
  '623780834516600000', // 25
  '656636608405400000', // 26
  '689790591861100000', // 27
  '723231734933100000', // 28
  '756949777475800000', // 29
  '790935167376600000', // 30
  '825178989697100000', // 31
  '859672904965600000', // 32
  '894409095191000000', // 33
  '929380216424000000', // 34
  '964579356905500000', // 35
  '1000000000000000000', // 36
];

export const LEVELS_REWARDS = [
  [0, 0.0833],
  [1, 0.1056],
  [2, 0.129],
  [3, 0.1533],
  [4, 0.1785],
  [5, 0.2045],
  [6, 0.2311],
  [7, 0.2585],
  [8, 0.2864],
  [9, 0.3149],
  [10, 0.3439],
  [11, 0.3733],
  [12, 0.4033],
  [13, 0.4337],
  [14, 0.4644],
  [15, 0.4956],
  [16, 0.5271],
  [17, 0.559],
  [18, 0.5912],
  [19, 0.6238],
  [20, 0.6566],
  [21, 0.6898],
  [22, 0.7232],
  [23, 0.7569],
  [24, 0.7909],
  [25, 0.8252],
  [26, 0.8597],
  [27, 0.8944],
  [28, 0.9294],
  [29, 0.9646],
  [30, 1],
];

export const TOKEN_NAMES = {
  ARV: 'ARV',
  PRV: 'PRV',
} as const;

// This output is used to generate the chart data
// e.g. [0, 10], [1, 13], ..., [30, 100]

export const LEVEL_CHART_DATA: [number, number][] = Array.from(
  { length: 31 },
  (_, i) => [i, i * 3 + 10],
);

export const GRADIENTS = ['rgba(11, 120, 221, 1)', 'rgba(11, 221, 145, 1)'];

function generateEnrichedData(
  data: [number, number][],
): [number, number, string, string][] {
  // Using chroma-js to generate the gradient
  // we want to have a smooth chart made by all the bars matching the GREADIENTS
  // so we don't see any white space between the bars
  const gradient = chroma.scale(GRADIENTS).mode('lab');
  // split the gradient into 30 parts * 2 (one for each side of the bar)
  const gradientSteps = gradient.colors(31 * 2);
  // now we can assing to each bar the color from the gradient, left and right
  return data.map(([level, value], i) => {
    const leftColor = gradientSteps[i * 2];
    const rightColor = gradientSteps[i * 2 + 1];
    return [level, value, leftColor, rightColor];
  });
}

export const COLORED_CHART_DATA = generateEnrichedData(LEVEL_CHART_DATA);

export const MERKLE_TREES_BY_USER_URL =
  'https://raw.githubusercontent.com/AuxoDAO/auxo-reporter/main/reports/latest/merkle-tree-combined.json';

export const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

export const PREFERENCES = {
  AUTOCOMPOUND: 0,
  CLAIM: 1,
  WITHDRAW: 2,
} as const;

export const LENDER_ROLE =
  '0xc60d7a62d8843f2b14bc63f2a5240b187980481ad8c001a3caf4916aef3f667e';
