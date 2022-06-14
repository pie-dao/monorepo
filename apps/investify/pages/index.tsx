import { ReactElement } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import { setStep, setOpenModal } from '../store/sidebar/sidebar.slice';
import { useAppDispatch, useAppSelector } from '../hooks';
import useMediaQuery from '../hooks/useMediaQuery';
import useTranslation from 'next-translate/useTranslation';
import { useServerHandoffComplete } from '../hooks/useServerHandoffComplete';

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Page Title' },
  };
});

export default function Page({ title }) {
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.sidebar);
  const { t } = useTranslation();
  const mq = useMediaQuery('(min-width: 1024px)');
  const ready = useServerHandoffComplete();

  return (
    <div className="flex-1 flex items-stretch overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <section className="min-w-0 flex-1 h-full flex flex-col">
          {!mq && ready && (
            <h1 className="text-2xl font-medium main-title w-fit">
              {t(title)}
            </h1>
          )}
          <button
            onClick={() => {
              dispatch(setStep(step === 'quote' ? 'swap' : 'quote'));
              dispatch(setOpenModal(true));
            }}
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
