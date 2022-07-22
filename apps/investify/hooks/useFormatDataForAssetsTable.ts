import { useEffect, useMemo } from 'react';
import { useLazyGetProductsBySymbolQuery } from '../api/generated/graphql';
import productsConfig from '../config/products.json';
import { formatAsPercent, formatBalanceCurrency } from '../utils/formatBalance';
import { ethers } from 'ethers';
import { Products } from '../store/products/products.types';
import chainImages from '../utils/chainImages';
import { chainMap } from '../utils/networks';
import { isEmpty, pickBy } from 'lodash';

export type ProductTableData = {
  image: string;
  name: {
    main: string;
    sub: string;
  };
  symbol: string;
  price: {
    value: string;
    twentyFourHours: {
      price: string;
      change: string;
    };
  };
  balance: string;
  portfolioPercentage: string;
  value: string;
  subRows: {
    chainImage: string;
    chainName: string;
    balance: string;
    value: string;
    allocationPercentage: string;
  }[];
};

type TableStatus = {
  isLoading: boolean;
  isError: boolean;
  formattedProducts: ProductTableData[];
};

export function useFormatDataForAssetsTable(
  products: Products,
  totalBalance: number,
  currency: string,
  locale: string,
): TableStatus {
  const [trigger, { isLoading, isError, data: productsData }] =
    useLazyGetProductsBySymbolQuery();

  useEffect(() => {
    if (!isEmpty(products)) {
      const filterProducts = pickBy(
        products,
        ({ totalBalance }) => totalBalance && totalBalance.label !== 0,
      );
      if (!filterProducts) return;
      trigger({
        symbols: Object.keys(filterProducts),
        currency,
      });
    }
  }, [currency, products, totalBalance, trigger]);

  const formattedProducts = useMemo(() => {
    const shouldReturn =
      isLoading ||
      isError ||
      !totalBalance ||
      currency.length === 0 ||
      isEmpty(products) ||
      isEmpty(productsData?.tokensBySymbol);
    console.log(productsData);

    if (shouldReturn) return;

    const orderProducts = Object.values(productsData.tokensBySymbol).map(
      (value) => {
        const { marketData, symbol } = value;
        const dataFromConfig = productsConfig[symbol];
        return {
          image: dataFromConfig.image,
          name: {
            main: dataFromConfig.name,
            sub: dataFromConfig.description,
          },
          symbol,
          price: {
            value: formatBalanceCurrency(
              marketData[0].currentPrice,
              locale,
              currency,
              true,
            ),
            twentyFourHours: {
              price: formatBalanceCurrency(
                marketData[0].twentyFourHourChange.price,
                locale,
                currency,
                true,
              ),
              change: formatAsPercent(
                marketData[0].twentyFourHourChange.change,
                locale,
              ),
            },
          },
          portfolioPercentage: `${(
            (+products[symbol].totalBalance.label / Number(totalBalance)) *
            100
          ).toFixed()}%`,
          balance: products[symbol].totalBalance.label.toFixed(2),
          value: formatBalanceCurrency(
            marketData[0].currentPrice * +products[symbol].totalBalance.label,
            locale,
            currency,
            true,
          ),
          subRows: Object.entries(products[symbol].balances)
            .filter(([, value]) => value.label !== 0)
            .map(([balanceKey, balanceValue]) => ({
              chainImage: chainImages(Number(balanceKey)),
              chainName: chainMap[Number(balanceKey)].chainName,
              balance: balanceValue.label.toFixed(2),
              allocationPercentage: `${(
                (Number(
                  ethers.utils.formatUnits(
                    balanceValue.value,
                    products[symbol].productDecimals,
                  ),
                ) /
                  +products[symbol].totalBalance.label) *
                100
              ).toFixed(2)}%`,
              value: formatBalanceCurrency(
                marketData[0].currentPrice *
                  +ethers.utils.formatUnits(
                    balanceValue.value,
                    products[symbol].productDecimals,
                  ),
                locale,
                currency,
                true,
              ),
            })),
        };
      },
    );
    return orderProducts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currency,
    isError,
    isLoading,
    locale,
    products,
    productsData,
    totalBalance,
    productsData?.tokensBySymbol,
  ]);
  return { formattedProducts, isLoading, isError };
}
