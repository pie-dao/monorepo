import { z } from 'zod';

export const basicStrapiResponse = z.object({
  data: z.array(z.object({})),
  meta: z.object({
    pagination: z.object({
      page: z.number().nullish(),
      pageSize: z.number().nullish(),
      pageCount: z.number().nullish(),
      total: z.number().nullish(),
    }),
  }),
});

export const Media = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    alternativeText: z.string(),
    caption: z.string(),
    width: z.number().nullish(),
    height: z.number().nullish(),
    formats: z
      .object({
        thumnbail: z
          .object({
            name: z.string(),
            hash: z.string(),
            ext: z.string(),
            mime: z.string(),
            width: z.number(),
            height: z.number(),
            size: z.number(),
            url: z.string(),
          })
          .nullish(),
      })
      .nullish(),
    hash: z.string(),
    ext: z.string(),
    mime: z.string(),
    size: z.number(),
    url: z.string(),
    previewUrl: z.null(),
    provider: z.string(),
    provider_metadata: z.null(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const Report = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string().nullish(),
    Commentary: z.string().nullish(),
    Coverage_period: z.string().nullish(),
    createdAt: z.string().nullish(),
    publishedAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
    tvl: z.number(),
    tvl_in_eth: z.number(),
    capital_utilisation: z.number(),
    avg_apr: z.number().nullish(),
    avg_apr_arv: z.number().nullish(),
    avg_apr_prv: z.number().nullish(),
    report_url: z.string().nullish(),
  }),
});

export const Token = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    coingeckoId: z.string().nullish(),
    createdAt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    iconUrl: z.string().nullish(),
    symbol: z.string().nullish(),
    decimals: z.number().nullish(),
    icon: z.object({
      data: Media,
    }),
  }),
});

export const Strategy = z.object({
  id: z.number(),
  attributes: z.object({
    Title: z.string(),
    Description: z.string().nullish(),
    LP_Volatile: z.boolean().nullish(),
    LP_Stable: z.boolean().nullish(),
    createdAt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const Protocol = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    createdAt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    icon: z.object({
      data: z.array(Media),
    }),
  }),
});

export const PositionFarming = z.object({
  id: z.number(),
  attributes: z.object({
    Network: z.string().nullish(),
    Notes: z.string().nullish(),
    Risk_Taxonomy: z.string().nullish(),
    closed: z.boolean().nullish(),
    createdAt: z.string().nullish(),
    open: z.string().nullish(),
    principal_amount: z.number().nullish(),
    publishedAt: z.string().nullish(),
    txhash: z.string().nullish(),
    updatedAt: z.string().nullish(),
    principal: z.object({
      data: Token.nullish(),
    }),
    rewards: z.object({
      data: z.array(Token),
    }),
    strategies: z.object({
      data: z.array(Strategy),
    }),
    protocol: z.object({
      data: Protocol.nullish(),
    }),
    report: z.object({
      data: Report.nullish(),
    }),
  }),
});

export const Exposure = z.object({
  id: z.number(),
  attributes: z.object({
    Title: z.string(),
    createdAt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    positions_farmings: z.object({
      data: z.array(PositionFarming),
    }),
    Icon: z.object({
      data: Media,
    }),
  }),
});

export const Update = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string().nullish(),
    text: z.string().nullish(),
    type: z.string().nullish(),
    createdAt: z.string().nullish(),
    publishedAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  }),
});

export const Breakdown = z.object({
  id: z.number(),
  attributes: z.object({
    value: z.number(),
    label: z.string(),
  }),
});

const createResponse = <T extends z.ZodType<any, any>>(schema: T) =>
  basicStrapiResponse.extend({ data: schema });
const createListResponse = <T extends z.ZodType<any, any>>(schema: T) =>
  basicStrapiResponse.extend({ data: z.array(schema) });

export const UpdateApiResponse = createResponse(Update);
export const UpdateListApiResponse = createListResponse(Update);

export const ReportApiResponse = createResponse(Report);
export const ReportListApiResponse = createListResponse(Report);

export const PositionFarmingApiResponse = createResponse(PositionFarming);
export const PositionFarmingListApiResponse =
  createListResponse(PositionFarming);

export const BreakdownApiResponse = createResponse(Breakdown);
export const BreakdownListApiResponse = createListResponse(Breakdown);

export const TokenApiResponse = createResponse(Token);
export const TokenListApiResponse = createListResponse(Token);

export const ExposureApiResponse = createResponse(Exposure);
export const ExposureListApiResponse = createListResponse(Exposure);

export const StrategyApiResponse = createResponse(Strategy);
export const StrategyListApiResponse = createListResponse(Strategy);

export const ProtocolApiResponse = createResponse(Protocol);
export const ProtocolListApiResponse = createListResponse(Protocol);

export type TypesMap = {
  position: z.infer<typeof PositionFarming>;
  positions: z.infer<typeof PositionFarmingListApiResponse>;
  breakdown: z.infer<typeof Breakdown>;
  breakdowns: z.infer<typeof BreakdownListApiResponse>;
  report: z.infer<typeof Report>;
  reports: z.infer<typeof ReportListApiResponse>;
  update: z.infer<typeof Update>;
  updates: z.infer<typeof UpdateListApiResponse>;
  token: z.infer<typeof Token>;
  tokens: z.infer<typeof TokenListApiResponse>;
  exposure: z.infer<typeof Exposure>;
  exposures: z.infer<typeof ExposureListApiResponse>;
  strategy: z.infer<typeof Strategy>;
  strategies: z.infer<typeof StrategyListApiResponse>;
  protocol: z.infer<typeof Protocol>;
  protocols: z.infer<typeof ProtocolListApiResponse>;
};

export const ResponseList = {
  position: PositionFarmingApiResponse,
  positions: BreakdownListApiResponse,
  breakdown: BreakdownApiResponse,
  breakdowns: BreakdownListApiResponse,
  report: ReportApiResponse,
  reports: ReportListApiResponse,
  update: UpdateApiResponse,
  updates: UpdateListApiResponse,
  token: TokenApiResponse,
  tokens: TokenListApiResponse,
  exposure: ExposureApiResponse,
  exposures: ExposureListApiResponse,
  strategy: StrategyApiResponse,
  strategies: StrategyListApiResponse,
  protocol: ProtocolApiResponse,
  protocols: ProtocolListApiResponse,
};
