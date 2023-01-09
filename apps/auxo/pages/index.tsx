import { NavBar } from '../components/NavBar/NavBar';
import { AuxoDAO, Lend, Support, Footer } from '../components/Home';

import ParallaxSection from '../components/Parallax/ParallaxSection';

export default function Home() {
  return (
    <>
      <ParallaxSection />
      <div>
        <NavBar />
        <AuxoDAO />
        <Lend />
        <Support />
      </div>
      <Footer />
    </>
  );
}

// export const getStaticProps = wrapper.getStaticProps(() => () => {
//   // this gets rendered on the server, then not on the client
//   return {
//     // does not seem to work with key `initialState`
//     props: { title: 'Home' },
//   };
// });
