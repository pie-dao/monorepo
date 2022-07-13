import { ReactElement } from 'react';
import { useWeb3React } from '@web3-react/core';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { Layout } from '../components';
import UserCard from '../components/UserCard/UserCard';
import DashboardTable from '../components/ProductTable/DashboardTable';
import ProfitPerformance from '../components/ProfitPerformance/ProfitPerformance';
import { wrapper } from '../store';
import { useMediaQuery } from 'usehooks-ts';
import { useServerHandoffComplete } from '../hooks/useServerHandoffComplete';
import { useAppSelector } from '../hooks';

export default function DashboardPage({ title }) {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();
  const { networks, assets } = useAppSelector((state) => state.dashboard.stats);

  return (
    <div className="flex-1 flex items-stretch">
      <div className="flex-1">
        <section className="min-w-0 flex-1 h-full flex flex-col gap-y-5">
          {!mq && ready && (
            <h1 className="text-2xl font-medium text-primary w-fit">
              {t(title)}
            </h1>
          )}
          {account && (
            <div className="flex-1 flex flex-row gap-5 flex-wrap">
              <UserCard />
              <ProfitPerformance />
            </div>
          )}
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
