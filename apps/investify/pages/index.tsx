import { ReactElement, useEffect } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import useMediaQuery from '../hooks/useMediaQuery';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../hooks/useServerHandoffComplete';
import UserCard from '../components/UserCard/UserCard';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../hooks';
import { thunkGetProductsData } from '../store/products/thunks';
import { stat } from 'fs';
export default function Page({ title }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();
  const { uniqueNetworks, totalAssets } = useAppSelector(
    (state) => state.dashboard.products,
  );

  useEffect(() => {
    if (!account) return;
    dispatch(thunkGetProductsData({ account }));
  }, [account, dispatch]);

  return (
    <div className="flex-1 flex items-stretch">
      <main className="flex-1">
        <section className="min-w-0 flex-1 h-full flex flex-col">
          {!mq && ready && (
            <h1 className="text-2xl font-medium main-title w-fit mb-8">
              {t(title)}
            </h1>
          )}
          {account && <UserCard />}
          <section>
            <h2 className="text-2xl font-medium">
              {uniqueNetworks &&
                totalAssets &&
                t('dashboard:funds', {
                  assets: totalAssets,
                  networks: uniqueNetworks,
                })}
            </h2>
          </section>
        </section>
      </main>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Page Title' },
  };
});
