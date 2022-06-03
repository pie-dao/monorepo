import { ReactElement } from 'react';
import { Layout } from '../components';
import { wrapper } from '../store';
import { setStep, setOpenModal } from '../store/sidebar/sidebar.slice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { title: 'Page Title' },
  };
});

export default function Page() {
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.sidebar);

  return (
    <div className="flex-1 flex items-stretch overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <section className="min-w-0 flex-1 h-full flex flex-col">
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
