import { ReactElement } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Layout } from '../components';
import { wrapper } from '../store';
import { setStep } from '../store/sidebar/sidebar.slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useCycle } from 'framer-motion';

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { someKey: 'returned from getStaticProps' },
  };
});

export default function Page() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.sidebar);

  const title = t('title');
  return (
    <div className="flex-1 flex items-stretch overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <section className="min-w-0 flex-1 h-full flex flex-col">
          <h1>{title}</h1>
          <button
            onClick={() =>
              dispatch(setStep(step === 'quote' ? 'swap' : 'quote'))
            }
          >
            Change
          </button>
        </section>
      </main>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
