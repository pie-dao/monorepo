import { ReactElement } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import useMediaQuery from '../hooks/useMediaQuery';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../hooks/useServerHandoffComplete';

export default function Home({ title }) {
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();

  return (
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
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Home' },
  };
});
