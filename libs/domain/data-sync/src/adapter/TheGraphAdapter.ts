import axios, { AxiosResponse } from 'axios';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { failure } from 'io-ts/lib/PathReporter';
import { TokenContractCodec } from './codec/TokenContractData';
import { flow, pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';

const BASE_URL =
  'https://api.thegraph.com/subgraphs/name/gbonumore/piedao-tokens';

const query = `query tokenContract($id: String!) {
  erc20Contract(id: $id) {
    id
    getSwapFee
    getAnnualFee
  }
}`;

const graphQlPost = (
  url: string,
  query: string,
  variables: {
    id: string;
  },
) =>
  TE.tryCatch<Error, AxiosResponse>(
    () =>
      axios.post(
        url,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    (reason) => new Error(String(reason)),
  );

//takes a url and a decoder and gives you back an Either<Error, A>
const getFromUrl = <A>(
  url: string,
  query: string,
  variables: {
    id: string;
  },
  codec: t.Decoder<unknown, A>,
) =>
  pipe(
    graphQlPost(url, query, variables),
    TE.map((x) => x.data),
    TE.chain(decodeWith(codec)),
  );

const decodeWith = <A>(decoder: t.Decoder<unknown, A>) =>
  flow(
    decoder.decode,
    E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
    TE.fromEither,
  );

export class TheGraphAdapter {
  public getTheGraphData(address: string) {
    const variables = { id: address };
    return getFromUrl(BASE_URL, query, variables, TokenContractCodec);
  }
}
