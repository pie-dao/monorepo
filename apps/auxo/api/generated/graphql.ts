import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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

function fetcher<TData, TVariables>(
  endpoint: string,
  requestInit: RequestInit,
  query: string,
  variables?: TVariables,
) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  Timestamp: any;
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Int']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type GlpStat = {
  __typename?: 'GlpStat';
  aumInUsdg: Scalars['BigInt'];
  distributedEsgmx: Scalars['BigInt'];
  distributedEsgmxCumulative: Scalars['BigInt'];
  distributedEsgmxUsd: Scalars['BigInt'];
  distributedEsgmxUsdCumulative: Scalars['BigInt'];
  distributedEth: Scalars['BigInt'];
  distributedEthCumulative: Scalars['BigInt'];
  distributedUsd: Scalars['BigInt'];
  distributedUsdCumulative: Scalars['BigInt'];
  glpSupply: Scalars['BigInt'];
  id: Scalars['ID'];
  period: Period;
  timestamp?: Maybe<Scalars['Int']>;
};

export enum GlpStat_OrderBy {
  AumInUsdg = 'aumInUsdg',
  DistributedEsgmx = 'distributedEsgmx',
  DistributedEsgmxCumulative = 'distributedEsgmxCumulative',
  DistributedEsgmxUsd = 'distributedEsgmxUsd',
  DistributedEsgmxUsdCumulative = 'distributedEsgmxUsdCumulative',
  DistributedEth = 'distributedEth',
  DistributedEthCumulative = 'distributedEthCumulative',
  DistributedUsd = 'distributedUsd',
  DistributedUsdCumulative = 'distributedUsdCumulative',
  GlpSupply = 'glpSupply',
  Id = 'id',
  Period = 'period',
  Timestamp = 'timestamp',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export enum Period {
  Daily = 'daily',
  Hourly = 'hourly',
  Monthly = 'monthly',
  Total = 'total',
}

export type Query = {
  __typename?: 'Query';
  glpStats: Array<GlpStat>;
};

export type QueryGlpStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GlpStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
};

export type GetGlpStatsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  orderBy?: InputMaybe<GlpStat_OrderBy>;
}>;

export type GetGlpStatsQuery = {
  __typename?: 'Query';
  glpStats: Array<{
    __typename?: 'GlpStat';
    id: string;
    aumInUsdg: any;
    glpSupply: any;
  }>;
};

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGlpStatsQuery((req, res, ctx) => {
 *   const { first, orderDirection, orderBy } = req.variables;
 *   return res(
 *     ctx.data({ glpStats })
 *   )
 * })
 */
export const mockGetGlpStatsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetGlpStatsQueryVariables>,
    GraphQLContext<GetGlpStatsQuery>,
    any
  >,
) =>
  graphql.query<GetGlpStatsQuery, GetGlpStatsQueryVariables>(
    'getGlpStats',
    resolver,
  );

export const GetGlpStatsDocument = `
    query getGlpStats($first: Int, $orderDirection: OrderDirection, $orderBy: GlpStat_orderBy) {
  glpStats(first: $first, orderDirection: $orderDirection, orderBy: $orderBy) {
    id
    aumInUsdg
    glpSupply
  }
}
    `;
export const useGetGlpStatsQuery = <TData = GetGlpStatsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: GetGlpStatsQueryVariables,
  options?: UseQueryOptions<GetGlpStatsQuery, TError, TData>,
) =>
  useQuery<GetGlpStatsQuery, TError, TData>(
    variables === undefined ? ['getGlpStats'] : ['getGlpStats', variables],
    fetcher<GetGlpStatsQuery, GetGlpStatsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      GetGlpStatsDocument,
      variables,
    ),
    options,
  );
