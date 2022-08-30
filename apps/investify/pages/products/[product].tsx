import { ReactElement, useMemo } from 'react';
import Image from 'next/image';
import { find, isEmpty } from 'lodash';
import { useMediaQuery } from 'usehooks-ts';
import useTranslation from 'next-translate/useTranslation';
import products from '../../config/products.json';
import { Layout } from '../../components';
import Tooltip from '../../components/Tooltip/Tooltip';
import UnderlyingAssets from '../../components/UnderlyingAssets/UnderlyingAssets';
import { wrapper } from '../../store';
import { useAppSelector } from '../../hooks';
import { usePieVaultQuery } from '../../api/generated/graphql';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';
import classNames from '../../utils/classnames';
import { getProduct } from '../../utils/mdxUtils';
import { ProductTabs } from '../../components/ProductTabs/ProductTabs';
import ChartWrapper from '../../components/PriceChart/ChartWrapper';

type ProductConfig = {
  name: string;
  image: string;
  description: string;
  addresses: {
    [chainString: string]: {
      address?: string;
      exclude?: boolean;
    };
  };
  prospectus?: string;
  coingeckoId: string;
  investmentFocusImage?: string;
};

type ProductsConfig = {
  [tokenSymbol: string]: ProductConfig;
};

const ProductPage = ({
  config,
  source,
}: {
  config: ProductConfig;
  source: {
    compiledSourceDescription: string;
    compiledSourceThesis: string;
    compiledSourceInvestmentFocus: string;
  };
}) => {
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const { tokens } = useAppSelector((state) => state.dashboard);
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const {
    name,
    description,
    image,
    prospectus,
    coingeckoId,
    investmentFocusImage,
    addresses,
  } = config;
  const { data, isLoading } = usePieVaultQuery({
    address: addresses['1'].address,
    currency: defaultCurrency ?? 'USD',
  });

  const productData = useMemo(() => {
    return find(
      tokens,
      (token) => token.addresses[1] === addresses['1'].address,
    );
  }, [addresses, tokens]);

  const tabsData = useMemo(
    () => ({
      marketCap: data?.pieVault?.marketData[0]?.marketCap
        ? formatBalanceCurrency(
            data?.pieVault?.marketData[0]?.marketCap,
            defaultLocale,
            defaultCurrency,
          )
        : null,
      numberOfHolders: data?.pieVault?.marketData[0]?.numberOfHolders
        ? data?.pieVault?.marketData[0]?.numberOfHolders
        : null,
      ath: data?.pieVault?.marketData[0]?.allTimeHigh
        ? formatBalanceCurrency(
            data?.pieVault?.marketData[0]?.allTimeHigh,
            defaultLocale,
            defaultCurrency,
          )
        : null,
      atl: data?.pieVault?.marketData[0]?.allTimeLow
        ? formatBalanceCurrency(
            data?.pieVault?.marketData[0]?.allTimeLow,
            defaultLocale,
            defaultCurrency,
          )
        : null,
      inceptionDate: data?.pieVault?.inceptionDate
        ? new Date(data?.pieVault?.inceptionDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      swapFee: data?.pieVault?.marketData[0]?.swapFee
        ? formatAsPercent(data?.pieVault?.marketData[0]?.swapFee, defaultLocale)
        : null,
      totalSupply: data?.pieVault?.marketData[0]?.totalSupply
        ? formatBalance(
            data?.pieVault?.marketData[0]?.totalSupply,
            defaultLocale,
          )
        : null,
      managementFee: data?.pieVault?.marketData[0]?.totalSupply
        ? formatAsPercent(
            data?.pieVault?.marketData[0]?.managementFee,
            defaultLocale,
          )
        : null,
      governance: !isEmpty(data?.pieVault?.governance)
        ? data?.pieVault?.governance
        : null,
      prospectus,
      coingeckoId,
      investmentFocusImage,
      address: config.addresses['1'].address,
    }),
    [
      coingeckoId,
      config.addresses,
      data?.pieVault?.governance,
      data?.pieVault?.inceptionDate,
      data?.pieVault?.marketData,
      defaultCurrency,
      defaultLocale,
      investmentFocusImage,
      prospectus,
    ],
  );

  if (!productData) return null;

  return (
    <>
      <div className="flex-1 flex items-stretch">
        <div className="flex-1">
          <section className="min-w-0 flex-1 h-full flex flex-col gap-y-5">
            {!mq && (
              <h1 className="text-2xl font-medium text-primary w-fit mb-4">
                {t(description)}
              </h1>
            )}
          </section>
        </div>
      </div>
      {config && (
        <>
          <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap">
            <div className="flex flex-1 items-center gap-x-2 bg-gradient-primary rounded-full shadow-card self-center w-full xl:w-auto">
              <Image src={image} alt={name} width={40} height={40} />
              <h2
                className="text-lg font-medium text-primary w-fit"
                data-cy="product-name"
              >
                {name}
              </h2>
              {!isLoading && (
                <div className="flex ml-auto mr-2 gap-x-2 items-center">
                  <div className="hidden lg:flex gap-x-1">
                    <span>{t('riskGrade')}</span>
                    <Tooltip>{t('riskGradeTooltip')}</Tooltip>
                  </div>
                  <span
                    className="border border-secondary rounded-full px-3"
                    data-cy="product-risk-grade"
                  >
                    {data?.pieVault?.riskGrade
                      ? data?.pieVault?.riskGrade
                      : 'N/A'}
                  </span>
                </div>
              )}
            </div>
            {!isLoading && (
              <div className="flex gap-x-2 items-start">
                <div className="flex flex-col min-w-max bg-primary text-white rounded-md p-2 border border-custom-border text-xs sm:text-sm">
                  <p className="font-medium" data-cy="product-inception">
                    {data?.pieVault?.marketData[0]?.fromInception
                      ? formatAsPercent(
                          data?.pieVault?.marketData[0]?.fromInception,
                          defaultLocale,
                        )
                      : 'N/A'}
                  </p>
                  <p className="text-white">{t('fromInception')}</p>
                </div>
                <div className="flex min-w-max bg-gradient-primary text-primary rounded-md p-2 border border-custom-border text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <p className="font-medium" data-cy="product-discount">
                      {data?.pieVault?.marketData[0]?.deltaToNav
                        ? formatAsPercent(
                            data?.pieVault?.marketData[0]?.deltaToNav,
                            defaultLocale,
                          )
                        : 'N/A'}
                    </p>
                    <p className="text-sub-dark">
                      {data?.pieVault?.marketData[0]?.deltaToNav >= 0
                        ? t('discount')
                        : t('premium')}
                    </p>
                  </div>
                  <Tooltip>{t('discountTooltip')}</Tooltip>
                </div>
                <div className="flex min-w-max bg-gradient-primary text-primary rounded-md p-2 border border-custom-border text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <p className="font-medium" data-cy="product-interests">
                      {data?.pieVault?.marketData[0]?.interests?.apy
                        ? formatAsPercent(
                            data?.pieVault?.marketData[0]?.interests.apy,
                            defaultLocale,
                          )
                        : 'N/A'}
                    </p>
                    <p className="text-sub-dark">{t('interests')}</p>
                  </div>
                  <Tooltip>{t('interestTooltip')}</Tooltip>
                </div>
              </div>
            )}
          </section>
          <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap mt-4">
            <div className="flex flex-1 items-center gap-x-6 self-center w-full xl:w-auto">
              <div className="flex-shrink-0">
                <p
                  className="text-2xl font-bold text-primary"
                  data-cy="product-current-price"
                >
                  {data?.pieVault?.marketData[0]?.currentPrice
                    ? formatBalanceCurrency(
                        data?.pieVault?.marketData[0]?.currentPrice,
                        defaultLocale,
                        defaultCurrency,
                      )
                    : 'N/A'}
                </p>
                <p
                  className={classNames(
                    data?.pieVault?.marketData[0]?.twentyFourHourChange
                      ?.change > 0
                      ? 'text-green'
                      : 'text-red',
                    'text-base font-medium',
                  )}
                >
                  <span data-cy="product-24-hour-change-price">
                    {data?.pieVault?.marketData[0]?.twentyFourHourChange?.price
                      ? formatBalanceCurrency(
                          data?.pieVault?.marketData[0]?.twentyFourHourChange
                            ?.price,
                          defaultLocale,
                          defaultCurrency,
                        )
                      : 'N/A'}
                  </span>
                  {' / '}
                  <span data-cy="product-24-hour-change-change">
                    {data?.pieVault?.marketData[0]?.twentyFourHourChange?.change
                      ? formatAsPercent(
                          data.pieVault.marketData[0].twentyFourHourChange
                            .change,
                          defaultLocale,
                        )
                      : 'N/A'}
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-full bg-gradient-primary rounded-md py-1 px-4">
                <p
                  className="font-bold text-sub-dark text-xl"
                  data-cy="product-nav"
                >
                  {data?.pieVault?.marketData[0]?.nav
                    ? formatBalanceCurrency(
                        data.pieVault.marketData[0].nav,
                        defaultLocale,
                        defaultCurrency,
                      )
                    : 'N/A'}
                </p>
                <div className="flex text-base text-sub-dark font-medium gap-x-1">
                  {t('nav')}
                  <Tooltip>{t('navTooltip')}</Tooltip>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <ChartWrapper symbol={name} />

      {!isLoading && <ProductTabs tabsData={tabsData} source={source} />}
      {data?.pieVault?.underlyingTokens && (
        <UnderlyingAssets tokens={data.pieVault.underlyingTokens} />
      )}
    </>
  );
};

export default ProductPage;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(
  () =>
    async ({ params }) => {
      const { product } = params;
      const { source } = await getProduct(product);

      const _products = products as ProductsConfig;
      const config = _products[product.toString()];

      return {
        props: {
          config,
          title: config.description,
          source,
        },
      };
    },
);

export async function getStaticPaths() {
  return {
    paths: Object.keys(products).map((key) => ({
      params: { product: key },
    })),
    fallback: false,
  };
}
