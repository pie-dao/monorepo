import type { NextPage } from 'next';
import { wrapper } from '../store';

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  // this gets rendered on the server, then not on the client
  return {
    // does not seem to work with key `initialState`
    props: { someKey: 'returned from getStaticProps' },
  };
});

const Index: NextPage<{ someKey?: string }> = (props) => {
  return <></>;
};

export default Index;
