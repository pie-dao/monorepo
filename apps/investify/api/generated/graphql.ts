import { api } from '../baseApi';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  marketCap: Scalars['String'];
  marketCapRank: Scalars['Float'];
  timestamp: Scalars['Timestamp'];
  totalVolume: Scalars['String'];
  twentyFourHourChange: Scalars['String'];
};


export type MarketDataEntityCurrentPriceArgs = {
  currency?: Scalars['String'];
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
  symbol: Scalars['String'];
};

export type TokenInterface = {
  address: Scalars['String'];
  chain: Scalars['String'];
  coinGeckoId: Scalars['String'];
  decimals: Scalars['Float'];
  kind: Scalars['String'];
  marketData: Array<MarketDataEntity>;
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String'];
  pieVaults: Array<UserTokenEntity>;
  totalBalance: Scalars['Float'];
  twentyFourHourChange: Scalars['Float'];
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
  symbol: Scalars['String'];
};

export type UserYieldVaultEntity = YieldVaultInterface & {
  __typename?: 'UserYieldVaultEntity';
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalEarnings: Scalars['Float'];
  twentyFourHourEarnings: Scalars['Float'];
};

export type YieldVaultEntity = YieldVaultInterface & {
  __typename?: 'YieldVaultEntity';
  name: Scalars['String'];
  symbol: Scalars['String'];
  underlyingToken: TokenEntity;
};

export type YieldVaultInterface = {
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type FindUserQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type FindUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', address: string, totalBalance: number, twentyFourHourChange: number, pieVaults: Array<{ __typename?: 'UserTokenEntity', symbol: string, name: string }>, yieldVaults: Array<{ __typename?: 'UserYieldVaultEntity', name: string, symbol: string, twentyFourHourEarnings: number, totalEarnings: number }> } | null };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', allUsers?: Array<{ __typename?: 'User', address: string } | null> | null };

export type UserFieldsFragment = { __typename?: 'User', address: string, totalBalance: number, twentyFourHourChange: number, pieVaults: Array<{ __typename?: 'UserTokenEntity', symbol: string, name: string }>, yieldVaults: Array<{ __typename?: 'UserYieldVaultEntity', name: string, symbol: string, twentyFourHourEarnings: number, totalEarnings: number }> };

export type GetProductsBySymbolQueryVariables = Exact<{
  symbols: Array<Scalars['String']> | Scalars['String'];
  currency: Scalars['String'];
}>;


export type GetProductsBySymbolQuery = { __typename?: 'Query', tokensBySymbol?: Array<{ __typename?: 'TokenEntity', symbol: string, marketData: Array<{ __typename?: 'MarketDataEntity', currentPrice: number, twentyFourHourChange: string }> } | null> | null };

export type GetVaultsQueryVariables = Exact<{
  currency: Scalars['String'];
}>;


export type GetVaultsQuery = { __typename?: 'Query', vaults?: Array<{ __typename?: 'YieldVaultEntity', symbol: string, name: string, underlyingToken: { __typename?: 'TokenEntity', marketData: Array<{ __typename?: 'MarketDataEntity', currentPrice: number }> } } | null> | null };

export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  address
  totalBalance
  pieVaults {
    symbol
    name
  }
  twentyFourHourChange
  yieldVaults {
    name
    symbol
    twentyFourHourEarnings
    totalEarnings
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
      twentyFourHourChange
    }
    symbol
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
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    findUser: build.query<FindUserQuery, FindUserQueryVariables>({
      query: (variables) => ({ document: FindUserDocument, variables })
    }),
    allUsers: build.query<AllUsersQuery, AllUsersQueryVariables | void>({
      query: (variables) => ({ document: AllUsersDocument, variables })
    }),
    getProductsBySymbol: build.query<GetProductsBySymbolQuery, GetProductsBySymbolQueryVariables>({
      query: (variables) => ({ document: GetProductsBySymbolDocument, variables })
    }),
    getVaults: build.query<GetVaultsQuery, GetVaultsQueryVariables>({
      query: (variables) => ({ document: GetVaultsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useFindUserQuery, useLazyFindUserQuery, useAllUsersQuery, useLazyAllUsersQuery, useGetProductsBySymbolQuery, useLazyGetProductsBySymbolQuery, useGetVaultsQuery, useLazyGetVaultsQuery } = injectedRtkApi;



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
export const mockFindUserQuery = (resolver: ResponseResolver<GraphQLRequest<FindUserQueryVariables>, GraphQLContext<FindUserQuery>, any>) =>
  graphql.query<FindUserQuery, FindUserQueryVariables>(
    'findUser',
    resolver
  )

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
export const mockAllUsersQuery = (resolver: ResponseResolver<GraphQLRequest<AllUsersQueryVariables>, GraphQLContext<AllUsersQuery>, any>) =>
  graphql.query<AllUsersQuery, AllUsersQueryVariables>(
    'allUsers',
    resolver
  )

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
export const mockGetProductsBySymbolQuery = (resolver: ResponseResolver<GraphQLRequest<GetProductsBySymbolQueryVariables>, GraphQLContext<GetProductsBySymbolQuery>, any>) =>
  graphql.query<GetProductsBySymbolQuery, GetProductsBySymbolQueryVariables>(
    'getProductsBySymbol',
    resolver
  )

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
export const mockGetVaultsQuery = (resolver: ResponseResolver<GraphQLRequest<GetVaultsQueryVariables>, GraphQLContext<GetVaultsQuery>, any>) =>
  graphql.query<GetVaultsQuery, GetVaultsQueryVariables>(
    'getVaults',
    resolver
  )
