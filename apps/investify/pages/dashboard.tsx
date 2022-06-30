import { ReactElement, useEffect } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import useMediaQuery from '../hooks/useMediaQuery';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../hooks/useServerHandoffComplete';
import UserCard from '../components/UserCard/UserCard';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  thunkGetProductsData,
  thunkGetVaultsData,
  thunkGetUserVaultsData,
} from '../store/products/thunks';
import DashboardTable from '../components/ProductTable/DashboardTable';

export default function DashboardPage({ title }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();
  const { networks, assets } = useAppSelector((state) => state.dashboard.stats);

  useEffect(() => {
    if (!account) return;
    dispatch(thunkGetProductsData(account));
    dispatch(thunkGetUserVaultsData(account));
  }, [account, dispatch]);

  useEffect(() => {
    dispatch(thunkGetVaultsData());
  }, [dispatch]);

  return (
    <div className="flex-1 flex items-stretch">
      <div className="flex-1">
        <section className="min-w-0 flex-1 h-full flex flex-col gap-y-5">
          {!mq && ready && (
            <h1 className="text-2xl font-medium text-primary w-fit">
              {t(title)}
            </h1>
          )}
          {account && <UserCard />}
          <section>
            {account &&
              networks?.total !== 0 &&
              assets?.totalProductsUsed !== 0 && (
                <h2 className="text-2xl font-medium">
                  <Trans
                    i18nKey="dashboard:funds"
                    values={{
                      assets: assets.totalProductsUsed,
                      networks: networks.total,
                    }}
                    components={{
                      assets: <span className="text-secondary" />,
                      network: <span className="text-secondary" />,
                    }}
                  />
                </h2>
              )}
            {account && <DashboardTable />}
          </section>
        </section>
      </div>
    </div>
  );
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Dashboard' },
  };
});
