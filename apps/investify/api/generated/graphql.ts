import { api } from '../baseApi';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Timestamp: any;
};

export type EventData = {
  __typename?: 'EventData';
  amount: Scalars['Float'];
  priceInCurrency: Scalars['Float'];
  priceInETH: Scalars['Float'];
};

export type Governance = {
  __typename?: 'Governance';
  status: Scalars['String'];
  timestamp: Scalars['Timestamp'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type GovernanceEntity = {
  __typename?: 'GovernanceEntity';
  status: Scalars['String'];
  timestamp: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Interests = {
  __typename?: 'Interests';
  apr: Scalars['Float'];
  apy: Scalars['Float'];
};

export type LinkEntity = {
  __typename?: 'LinkEntity';
  title: Scalars['String'];
  url: Scalars['String'];
};

/** Contains market information for a given token at a specific timestamp. */
export type MarketDataEntity = {
  __typename?: 'MarketDataEntity';
  allTimeHigh: Scalars['Float'];
  allTimeLow: Scalars['Float'];
  circulatingSupply: Scalars['Float'];
  currentPrice: Scalars['Float'];
  /** The premium or the discount between price and nav. Positive is premium, negative is discount. */
  deltaToNav: Scalars['Float'];
  discount: Scalars['Float'];
  event?: Maybe<UserEvent>;
  /** The performance (%) from the creation of the pie until today. All pies start at $1, so the performance is the nav. */
  fromInception: Scalars['Float'];
  holders: Scalars['Float'];
  interests: Interests;
  /** AKA streaming fee is an annualized fee for the pie. */
  managementFee: Scalars['Float'];
  /** Total supply * nav. */
  marketCap: Scalars['Float'];
  marketCapRank: Scalars['Float'];
  /** Nav is the difference between the price of the token and the aggregated price of its unerlyings. */
  nav: Scalars['Float'];
  /** The number of users that are holding this token. (defaults to `0` if not available) */
  numberOfHolders: Scalars['Int'];
  swapFee: Scalars['Float'];
  timestamp: Scalars['Timestamp'];
  totalSupply: Scalars['Float'];
  totalVolume: Scalars['Float'];
  twentyFourHourChange: PriceChange;
};

/** Contains market information for a given token at a specific timestamp. */
export type MarketDataEntityCurrentPriceArgs = {
  currency?: Scalars['String'];
};

export type Option = {
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
};

export type Options = {
  entity?: InputMaybe<Option>;
  marketData?: InputMaybe<Option>;
};

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderBy = {
  field: Scalars['String'];
  value: Order;
};

export type PieVaultEntity = {
  __typename?: 'PieVaultEntity';
  address: Scalars['String'];
  /** The chain on which this token lives. */
  chain: Scalars['String'];
  currency: Scalars['String'];
  decimals: Scalars['Int'];
  governance: Array<GovernanceEntity>;
  inceptionDate: Scalars['String'];
  /** The kind of this token (eg: 'PieVault', 'YieldVault', etc). */
  kind: Scalars['String'];
  /** Market data for this token. */
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  riskGrade: Scalars['String'];
  symbol: Scalars['String'];
  underlyingTokens: Array<UnderlyingTokenEntity>;
};

export type PriceChange = {
  __typename?: 'PriceChange';
  change: Scalars['Float'];
  price: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<User>>>;
  getTokenChart?: Maybe<UserTokenEntity>;
  me: User;
  /** Returns a pie vault by its address. */
  pieVault: PieVaultEntity;
  /** Returns all pie vaults. */
  pieVaults: Array<PieVaultEntity>;
  /** Returns all tokens regardless of their kind. */
  tokens: Array<TokenEntity>;
  tokensBySymbol?: Maybe<Array<Maybe<TokenEntity>>>;
  user?: Maybe<User>;
  vaults?: Maybe<Array<Maybe<YieldVaultEntity>>>;
};

export type QueryGetTokenChartArgs = {
  currency?: Scalars['String'];
  interval?: Scalars['String'];
  symbol: Scalars['String'];
};

export type QueryPieVaultArgs = {
  address: Scalars['String'];
  chain: Scalars['String'];
  currency: Scalars['String'];
};

export type QueryPieVaultsArgs = {
  currency: Scalars['String'];
  options?: InputMaybe<Options>;
};

export type QueryTokensArgs = {
  filters?: InputMaybe<Options>;
};

export type QueryTokensBySymbolArgs = {
  symbols: Array<Scalars['String']>;
};

export type QueryUserArgs = {
  address: Scalars['String'];
  currency?: Scalars['String'];
};

export type QueryVaultsArgs = {
  currency?: Scalars['String'];
};

export type StrategyEntity = {
  __typename?: 'StrategyEntity';
  allocationPercentage: Scalars['Float'];
  description: Scalars['String'];
  links: Array<LinkEntity>;
  title: Scalars['String'];
};

export type TokenEntity = TokenInterface & {
  __typename?: 'TokenEntity';
  address: Scalars['String'];
  /** The chain on which this token lives. */
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
  governance: Array<Governance>;
  inceptionDate: Scalars['Timestamp'];
  /** The kind of this token (eg: 'PieVault', 'YieldVault', etc). */
  kind: Scalars['String'];
  /** Market data for this token. */
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  riskGrade: Scalars['String'];
  symbol: Scalars['String'];
  underlyingTokens: Array<UnderlyingTokenEntity>;
};

export type TokenInterface = {
  address: Scalars['String'];
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
  governance: Array<Governance>;
  inceptionDate: Scalars['Timestamp'];
  kind: Scalars['String'];
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  riskGrade: Scalars['String'];
  symbol: Scalars['String'];
  underlyingTokens: Array<UnderlyingTokenEntity>;
};

export type UnderlyingTokenEntity = {
  __typename?: 'UnderlyingTokenEntity';
  address: Scalars['String'];
  /** The chain on which this token lives. */
  chain: Scalars['String'];
  decimals: Scalars['Float'];
  /** The kind of this token (eg: 'PieVault', 'YieldVault', etc). */
  kind: Scalars['String'];
  /** Market data for this underlying token. */
  marketData: Array<UnerlyingMarketData>;
  name: Scalars['String'];
  symbol: Scalars['String'];
};

/** Contains market information for an underlying token. */
export type UnerlyingMarketData = {
  __typename?: 'UnerlyingMarketData';
  allocation: Scalars['Float'];
  amountPerToken?: Maybe<Scalars['Float']>;
  currentPrice: Scalars['Float'];
  /** Total supply * nav. */
  marketCap: Scalars['Float'];
  /** Nav is the difference between the price of the token and the aggregated price of its unerlyings. */
  nav: Scalars['Float'];
  totalHeld: Scalars['Float'];
  totalSupply: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String'];
  performance: Scalars['Float'];
  pieVaults: Array<UserTokenEntity>;
  profit: Scalars['Float'];
  totalBalance: Scalars['Float'];
  twentyFourHourChange: PriceChange;
  yieldVaults: Array<UserYieldVaultEntity>;
};

export type UserEvent = {
  __typename?: 'UserEvent';
  eventData: EventData;
  eventType: Scalars['String'];
};

export type UserTokenEntity = TokenInterface & {
  __typename?: 'UserTokenEntity';
  address: Scalars['String'];
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
  governance: Array<Governance>;
  inceptionDate: Scalars['Timestamp'];
  kind: Scalars['String'];
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  riskGrade: Scalars['String'];
  symbol: Scalars['String'];
  underlyingTokens: Array<UnderlyingTokenEntity>;
};

export type UserYieldVaultEntity = YieldVaultInterface & {
  __typename?: 'UserYieldVaultEntity';
  address: Scalars['String'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalEarnings: Scalars['Float'];
  twentyFourHourEarnings: Scalars['Float'];
};

export type YieldVaultEntity = YieldVaultInterface & {
  __typename?: 'YieldVaultEntity';
  address: Scalars['String'];
  name: Scalars['String'];
  strategies: Array<StrategyEntity>;
  symbol: Scalars['String'];
  underlyingToken: TokenEntity;
};

export type YieldVaultInterface = {
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type UnderlyingTokenEntity = {
  __typename?: 'underlyingTokenEntity';
  address: Scalars['String'];
  decimals: Scalars['Float'];
  marketData: Array<UnderlyingTokenMarketData>;
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type UnderlyingTokenMarketData = {
  __typename?: 'underlyingTokenMarketData';
  allocation: Scalars['Float'];
  amountPerToken: Scalars['Float'];
  currentPrice: Scalars['Float'];
  marginalTVLPercentage: Scalars['Float'];
  totalHeld: Scalars['Float'];
  twentyFourHourChange: PriceChange;
};

export type UnderlyingTokenMarketDataCurrentPriceArgs = {
  currency?: Scalars['String'];
};

export type PieVaultQueryVariables = Exact<{
  currency?: Scalars['String'];
  address: Scalars['String'];
  chain?: Scalars['String'];
}>;

export type PieVaultQuery = {
  __typename?: 'Query';
  pieVault: {
    __typename?: 'PieVaultEntity';
    address: string;
    chain: string;
    currency: string;
    decimals: number;
    inceptionDate: string;
    kind: string;
    name: string;
    riskGrade: string;
    symbol: string;
    marketData: Array<{
      __typename?: 'MarketDataEntity';
      allTimeHigh: number;
      allTimeLow: number;
      currentPrice: number;
      deltaToNav: number;
      fromInception: number;
      managementFee: number;
      marketCap: number;
      nav: number;
      numberOfHolders: number;
      swapFee: number;
      totalSupply: number;
      interests: { __typename?: 'Interests'; apr: number; apy: number };
      twentyFourHourChange: {
        __typename?: 'PriceChange';
        change: number;
        price: number;
      };
    }>;
  };
};

export type FindUserQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type FindUserQuery = {
  __typename?: 'Query';
  user?: {
    __typename?: 'User';
    address: string;
    totalBalance: number;
    profit: number;
    performance: number;
    pieVaults: Array<{
      __typename?: 'UserTokenEntity';
      symbol: string;
      name: string;
    }>;
    twentyFourHourChange: {
      __typename?: 'PriceChange';
      price: number;
      change: number;
    };
    yieldVaults: Array<{
      __typename?: 'UserYieldVaultEntity';
      name: string;
      symbol: string;
      twentyFourHourEarnings: number;
      totalEarnings: number;
      address: string;
    }>;
  } | null;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: 'Query';
  allUsers?: Array<{ __typename?: 'User'; address: string } | null> | null;
};

export type ChartDataFragment = {
  __typename?: 'UserTokenEntity';
  marketData: Array<{
    __typename?: 'MarketDataEntity';
    currentPrice: number;
    nav: number;
    timestamp: any;
    totalVolume: number;
    event?: {
      __typename?: 'UserEvent';
      eventType: string;
      eventData: {
        __typename?: 'EventData';
        amount: number;
        priceInETH: number;
        priceInCurrency: number;
      };
    } | null;
  }>;
};

export type UserFieldsFragment = {
  __typename?: 'User';
  address: string;
  totalBalance: number;
  profit: number;
  performance: number;
  pieVaults: Array<{
    __typename?: 'UserTokenEntity';
    symbol: string;
    name: string;
  }>;
  twentyFourHourChange: {
    __typename?: 'PriceChange';
    price: number;
    change: number;
  };
  yieldVaults: Array<{
    __typename?: 'UserYieldVaultEntity';
    name: string;
    symbol: string;
    twentyFourHourEarnings: number;
    totalEarnings: number;
    address: string;
  }>;
};

export type GetProductsBySymbolQueryVariables = Exact<{
  symbols: Array<Scalars['String']> | Scalars['String'];
  currency: Scalars['String'];
}>;

export type GetProductsBySymbolQuery = {
  __typename?: 'Query';
  tokensBySymbol?: Array<{
    __typename?: 'TokenEntity';
    symbol: string;
    riskGrade: string;
    inceptionDate: any;
    marketData: Array<{
      __typename?: 'MarketDataEntity';
      currentPrice: number;
      fromInception: number;
      discount: number;
      nav: number;
      marketCap: number;
      holders: number;
      allTimeHigh: number;
      allTimeLow: number;
      swapFee: number;
      managementFee: number;
      totalSupply: number;
      twentyFourHourChange: {
        __typename?: 'PriceChange';
        price: number;
        change: number;
      };
    }>;
    underlyingTokens: Array<{
      __typename?: 'underlyingTokenEntity';
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      marketData: Array<{
        __typename?: 'underlyingTokenMarketData';
        currentPrice: number;
        amountPerToken: number;
        totalHeld: number;
        allocation: number;
        marginalTVLPercentage: number;
        twentyFourHourChange: {
          __typename?: 'PriceChange';
          price: number;
          change: number;
        };
      }>;
    }>;
    governance: Array<{
      __typename?: 'Governance';
      title: string;
      url: string;
      status: string;
      timestamp: any;
    }>;
  } | null> | null;
};

export type GetVaultsQueryVariables = Exact<{
  currency: Scalars['String'];
}>;

export type GetVaultsQuery = {
  __typename?: 'Query';
  vaults?: Array<{
    __typename?: 'YieldVaultEntity';
    symbol: string;
    name: string;
    address: string;
    underlyingToken: {
      __typename?: 'TokenEntity';
      marketData: Array<{
        __typename?: 'MarketDataEntity';
        currentPrice: number;
      }>;
    };
    strategies: Array<{
      __typename?: 'StrategyEntity';
      title: string;
      description: string;
      allocationPercentage: number;
      links: Array<{ __typename?: 'LinkEntity'; title: string; url: string }>;
    }>;
  } | null> | null;
};

export type GetTokenChartQueryVariables = Exact<{
  symbol: Scalars['String'];
  currency: Scalars['String'];
  interval: Scalars['String'];
}>;

export type GetTokenChartQuery = {
  __typename?: 'Query';
  getTokenChart?: {
    __typename?: 'UserTokenEntity';
    marketData: Array<{
      __typename?: 'MarketDataEntity';
      currentPrice: number;
      nav: number;
      timestamp: any;
      totalVolume: number;
      event?: {
        __typename?: 'UserEvent';
        eventType: string;
        eventData: {
          __typename?: 'EventData';
          amount: number;
          priceInETH: number;
          priceInCurrency: number;
        };
      } | null;
    }>;
  } | null;
};

export const ChartDataFragmentDoc = `
    fragment ChartData on UserTokenEntity {
  marketData {
    currentPrice
    nav
    timestamp
    totalVolume
    event {
      eventType
      eventData {
        amount
        priceInETH
        priceInCurrency
      }
    }
  }
}
    `;
export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  address
  totalBalance
  pieVaults {
    symbol
    name
  }
  twentyFourHourChange {
    price
    change
  }
  yieldVaults {
    name
    symbol
    twentyFourHourEarnings
    totalEarnings
    address
  }
  profit
  performance
}
    `;
export const PieVaultDocument = `
    query pieVault($currency: String! = "usd", $address: String!, $chain: String! = "ETHEREUM") {
  pieVault(currency: $currency, address: $address, chain: $chain) {
    address
    chain
    currency
    decimals
    inceptionDate
    kind
    name
    riskGrade
    symbol
    marketData {
      allTimeHigh
      allTimeLow
      currentPrice
      deltaToNav
      fromInception
      interests {
        apr
        apy
      }
      managementFee
      marketCap
      nav
      numberOfHolders
      swapFee
      totalSupply
      twentyFourHourChange {
        change
        price
      }
    }
  }
}
    `;
export const FindUserDocument = `
    query findUser($address: String!) {
  user(address: $address) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const AllUsersDocument = `
    query allUsers {
  allUsers {
    address
  }
}
    `;
export const GetProductsBySymbolDocument = `
    query getProductsBySymbol($symbols: [String!]!, $currency: String!) {
  tokensBySymbol(symbols: $symbols) {
    marketData {
      currentPrice(currency: $currency)
      twentyFourHourChange {
        price
        change
      }
      fromInception
      discount
      nav
      marketCap
      holders
      allTimeHigh
      allTimeLow
      swapFee
      managementFee
      totalSupply
    }
    underlyingTokens {
      name
      symbol
      address
      decimals
      marketData {
        currentPrice(currency: $currency)
        amountPerToken
        totalHeld
        allocation
        twentyFourHourChange {
          price
          change
        }
        marginalTVLPercentage
      }
    }
    symbol
    riskGrade
    inceptionDate
    governance {
      title
      url
      status
      timestamp
    }
  }
}
    `;
export const GetVaultsDocument = `
    query getVaults($currency: String!) {
  vaults(currency: $currency) {
    underlyingToken {
      marketData {
        currentPrice(currency: $currency)
      }
    }
    symbol
    name
    address
    strategies {
      title
      description
      allocationPercentage
      links {
        title
        url
      }
    }
  }
}
    `;
export const GetTokenChartDocument = `
    query getTokenChart($symbol: String!, $currency: String!, $interval: String!) {
  getTokenChart(symbol: $symbol, currency: $currency, interval: $interval) {
    ...ChartData
  }
}
    ${ChartDataFragmentDoc}`;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    pieVault: build.query<PieVaultQuery, PieVaultQueryVariables>({
      query: (variables) => ({ document: PieVaultDocument, variables }),
    }),
    findUser: build.query<FindUserQuery, FindUserQueryVariables>({
      query: (variables) => ({ document: FindUserDocument, variables }),
    }),
    allUsers: build.query<AllUsersQuery, AllUsersQueryVariables | void>({
      query: (variables) => ({ document: AllUsersDocument, variables }),
    }),
    getProductsBySymbol: build.query<
      GetProductsBySymbolQuery,
      GetProductsBySymbolQueryVariables
    >({
      query: (variables) => ({
        document: GetProductsBySymbolDocument,
        variables,
      }),
    }),
    getVaults: build.query<GetVaultsQuery, GetVaultsQueryVariables>({
      query: (variables) => ({ document: GetVaultsDocument, variables }),
    }),
    getTokenChart: build.query<GetTokenChartQuery, GetTokenChartQueryVariables>(
      {
        query: (variables) => ({ document: GetTokenChartDocument, variables }),
      },
    ),
  }),
});

export { injectedRtkApi as api };
export const {
  usePieVaultQuery,
  useLazyPieVaultQuery,
  useFindUserQuery,
  useLazyFindUserQuery,
  useAllUsersQuery,
  useLazyAllUsersQuery,
  useGetProductsBySymbolQuery,
  useLazyGetProductsBySymbolQuery,
  useGetVaultsQuery,
  useLazyGetVaultsQuery,
  useGetTokenChartQuery,
  useLazyGetTokenChartQuery,
} = injectedRtkApi;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockPieVaultQuery((req, res, ctx) => {
 *   const { currency, address, chain } = req.variables;
 *   return res(
 *     ctx.data({ pieVault })
 *   )
 * })
 */
export const mockPieVaultQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<PieVaultQueryVariables>,
    GraphQLContext<PieVaultQuery>,
    any
  >,
) => graphql.query<PieVaultQuery, PieVaultQueryVariables>('pieVault', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockFindUserQuery((req, res, ctx) => {
 *   const { address } = req.variables;
 *   return res(
 *     ctx.data({ user })
 *   )
 * })
 */
export const mockFindUserQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<FindUserQueryVariables>,
    GraphQLContext<FindUserQuery>,
    any
  >,
) => graphql.query<FindUserQuery, FindUserQueryVariables>('findUser', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAllUsersQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ allUsers })
 *   )
 * })
 */
export const mockAllUsersQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<AllUsersQueryVariables>,
    GraphQLContext<AllUsersQuery>,
    any
  >,
) => graphql.query<AllUsersQuery, AllUsersQueryVariables>('allUsers', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProductsBySymbolQuery((req, res, ctx) => {
 *   const { symbols, currency } = req.variables;
 *   return res(
 *     ctx.data({ tokensBySymbol })
 *   )
 * })
 */
export const mockGetProductsBySymbolQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetProductsBySymbolQueryVariables>,
    GraphQLContext<GetProductsBySymbolQuery>,
    any
  >,
) =>
  graphql.query<GetProductsBySymbolQuery, GetProductsBySymbolQueryVariables>(
    'getProductsBySymbol',
    resolver,
  );

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetVaultsQuery((req, res, ctx) => {
 *   const { currency } = req.variables;
 *   return res(
 *     ctx.data({ vaults })
 *   )
 * })
 */
export const mockGetVaultsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetVaultsQueryVariables>,
    GraphQLContext<GetVaultsQuery>,
    any
  >,
) =>
  graphql.query<GetVaultsQuery, GetVaultsQueryVariables>('getVaults', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetTokenChartQuery((req, res, ctx) => {
 *   const { symbol, currency, interval } = req.variables;
 *   return res(
 *     ctx.data({ getTokenChart })
 *   )
 * })
 */
export const mockGetTokenChartQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetTokenChartQueryVariables>,
    GraphQLContext<GetTokenChartQuery>,
    any
  >,
) =>
  graphql.query<GetTokenChartQuery, GetTokenChartQueryVariables>(
    'getTokenChart',
    resolver,
  );
