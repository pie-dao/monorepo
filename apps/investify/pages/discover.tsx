import { ReactElement } from 'react';
import Link from 'next/link';
import products from '../config/products.json';
import { vaults } from '../config/auxoVaults';
import { Layout } from '../components';
import { wrapper } from '../store';

function DiscoverPage() {
  const productsList = Object.values(products).map((value) => value.name);
  const vaultsList = Object.values(vaults).map((value) => ({
    symbol: value.symbol,
    address: value.address,
  }));

  return (
    <div className="grid grid-cols-2">
      <div>
        <h3 className="text-lg mb-2 font-bold">Products</h3>
        <ul>
          {productsList.map((product) => (
            <li key={product}>
              <Link href={`/products/${product}`}>{product}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg mb-2 font-bold">Vaults</h3>
        <ul>
          {vaultsList.map(({ symbol, address }) => (
            <li key={address}>
              <Link href={`/vaults/${address}`}>{symbol}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

DiscoverPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Discover' },
  };
});

export default DiscoverPage;
