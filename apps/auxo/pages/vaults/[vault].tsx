import { useAppDispatch, useAppSelector } from '../../hooks';
import { ReactElement, useEffect } from 'react';
import Image from 'next/image';
import { Layout } from '../../components';
import { useSelectedVault } from '../../hooks/useSelectedVault';
import { useFormatDataForSingleVault } from '../../hooks/useFormatDataForSingleVault';
import { wrapper } from '../../store';
import { useServerHandoffComplete } from '../../hooks/useServerHandoffComplete';
import useTranslation from 'next-translate/useTranslation';
import { useMediaQuery } from 'usehooks-ts';
import { useGetVaultsQuery } from '../../api/generated/graphql';
import { setActiveVault } from '../../store/products/products.slice';
import { setIsOpen } from '../../store/modal/modal.slice';
import { getVault } from '../../utils/mdxUtils';
import { VaultTabs } from '../../components/VaultTabs/VaultTabs';
import { vaults } from '../../config/auxoVaults';

export default function VaultPage({
  vault,
  title,
  source,
}: {
  vault: string;
  title: string;
  source: {
    compiledSourceAbout: string;
  };
}) {
  const dispatch = useAppDispatch();
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();
  const activeVault = useSelectedVault();
  const { data, isLoading } = useGetVaultsQuery({
    currency: defaultCurrency,
  });

  useEffect(() => {
    dispatch(setActiveVault(vault));
  }, [dispatch, vault]);

  const singleVault = useFormatDataForSingleVault(
    data,
    activeVault,
    defaultCurrency,
    defaultLocale,
  );

  if (isLoading || !activeVault) {
    return 'I am loading';
  }

  return (
    <>
      <div className="flex-1 flex items-stretch">
        <div className="flex-1">
          <section className="min-w-0 flex-1 h-full flex flex-col gap-y-5">
            {!mq && ready && (
              <h1 className="text-2xl font-medium text-primary w-fit">
                {t(title)}
              </h1>
            )}
          </section>
        </div>
      </div>
      {singleVault && (
        <>
          <section>
            <div className="flex-1 flex items-center gap-x-2">
              <Image
                src={singleVault.image}
                alt={singleVault.name.sub}
                width={40}
                height={40}
              />
              <h2 className="text-lg font-medium text-primary w-fit">
                {singleVault.name.main}
              </h2>
            </div>
          </section>
          <section>
            <VaultTabs tabsData={singleVault.tabs} source={source} />
            <button onClick={() => dispatch(setIsOpen(true))}>Click me</button>
          </section>
        </>
      )}
    </>
  );
}

VaultPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(
  () =>
    async ({ params }) => {
      const { vault } = params as { vault: string };
      const { source } = await getVault(vault.toLowerCase());

      return {
        props: {
          vault,
          title: 'Vault',
          source,
        },
        notFound: true,
      };
    },
);

export async function getStaticPaths() {
  return {
    paths: Object.values(vaults).map(({ address }) => ({
      params: { vault: address },
    })),
    fallback: false,
  };
}
