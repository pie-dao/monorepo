import products from '../config/products.json';

const addToken = async (
  address: string,
  symbol: string,
  image: string,
  decimals = 18,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wasAddded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    });
    return console.log('token added', wasAddded);
  } catch (e) {
    console.error(e);
  }
};

export const addTokenToWallet = async (
  chainId: number,
  tokenName: string,
  displayName?: string,
) => {
  await addToken(
    products?.[tokenName]?.addresses?.[chainId]?.address,
    displayName ?? tokenName,
    `${window.location.origin}/tokens/metamask/${tokenName}.svg`,
  );
};

export default addTokenToWallet;
