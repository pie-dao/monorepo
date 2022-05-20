import { ReactElement } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { Layout } from '../components';
import { wrapper } from '../store';
import { setX } from '../store/example/example.slice';

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  store.dispatch(setX('Set as a dispatch from getStaticProps'));
  return {
    // does not seem to work with key `initialState`
    props: { someKey: 'returned from getStaticProps' },
  };
});

export default function Page() {
  const { t } = useTranslation();
  const title = t('title');
  return (
    <div className="flex-1 flex items-stretch overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <section className="min-w-0 flex-1 h-full flex flex-col">
          <h1>{title}</h1>
      <Link href="/example">example page</Link>
        </section>
      </main>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
