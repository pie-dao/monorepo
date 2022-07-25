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

export type MarketDataEntity = {
  __typename?: 'MarketDataEntity';
  circulatingSupply: Scalars['Float'];
  currentPrice: Scalars['Float'];
  discount: Scalars['Float'];
  fromInception: Scalars['Float'];
  interests: Scalars['Float'];
  marketCap: Scalars['String'];
  marketCapRank: Scalars['Float'];
  nav: Scalars['Float'];
  timestamp: Scalars['Timestamp'];
  totalVolume: Scalars['String'];
  twentyFourHourChange: PriceChange;
};

export type MarketDataEntityCurrentPriceArgs = {
  currency?: Scalars['String'];
};

export type PriceChange = {
  __typename?: 'PriceChange';
  change: Scalars['Float'];
  price: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<User>>>;
  me: User;
  token?: Maybe<TokenEntity>;
  tokens?: Maybe<Array<Maybe<TokenEntity>>>;
  tokensBySymbol?: Maybe<Array<Maybe<TokenEntity>>>;
  user?: Maybe<User>;
  vaults?: Maybe<Array<Maybe<YieldVaultEntity>>>;
};

export type QueryTokenArgs = {
  symbol: Scalars['String'];
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

export type TokenEntity = TokenInterface & {
  __typename?: 'TokenEntity';
  address: Scalars['String'];
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
  kind: Scalars['String'];
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
  kind: Scalars['String'];
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  riskGrade: Scalars['String'];
  symbol: Scalars['String'];
  underlyingTokens: Array<UnderlyingTokenEntity>;
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

export type UserTokenEntity = TokenInterface & {
  __typename?: 'UserTokenEntity';
  address: Scalars['String'];
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
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
    marketData: Array<{
      __typename?: 'MarketDataEntity';
      currentPrice: number;
      fromInception: number;
      discount: number;
      interests: number;
      nav: number;
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
  } | null> | null;
};

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
      interests
      nav
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
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export { injectedRtkApi as api };
export const {
  useFindUserQuery,
  useLazyFindUserQuery,
  useAllUsersQuery,
  useLazyAllUsersQuery,
  useGetProductsBySymbolQuery,
  useLazyGetProductsBySymbolQuery,
  useGetVaultsQuery,
  useLazyGetVaultsQuery,
} = injectedRtkApi;

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
