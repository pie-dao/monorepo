import products from '../config/products.json';

const addTokenToWallet = async (
  address: string,
  symbol: string,
  image: string,
  decimals?: number,
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
          decimals: decimals ?? 18,
          image,
        },
      },
    });
    return console.log('token added', wasAddded);
  } catch (e) {
    console.error(e);
  }
};

export default addTokenToWallet;

export const addAuxoToWallet = async () => {
  await addTokenToWallet(
    '0x0000000000000000000000000000',
    'AUXO',
    `${window.location.origin}/images/auxoIcon.svg`,
  );
};

export const addVeAUXOToWallet = async () => {
  await addTokenToWallet(
    '0x0000000000000000000000000000',
    'veAUXO',
    `${window.location.origin}/tokens/veAUXO.svg`,
  );
};

export const addXAUXOToWallet = async () => {
  await addTokenToWallet(
    products['xAUXO'].addresses[5].address,
    'xAUXO',
    `${window.location.origin}/tokens/xAUXO.svg`,
  );
};
