import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch } from '../hooks';
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

const Index: NextPage<{ someKey?: string }> = (props) => {
  const { t } = useTranslation();
  const title = t('title');
  const dispatch = useAppDispatch();
  const [input] = useState(props.someKey ?? '');
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => dispatch(setX(input))}>Change</button>
      <Link href="/example">example page</Link>
    </div>
  );
};

export default Index;
