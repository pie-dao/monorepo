import { NavBar } from '../components/NavBar/NavBar';
import { AuxoDAO, Lend, Support } from '../components/Home';
import Parallax from '../components/Parallax/ParallaxImage';
import Image from 'next/image';
import head from '../public/images/home/hero/auxo-text.webp';
import faded from '../public/images/home/hero/auxo-fluid.webp';
import bg from '../public/images/home/hero/auxo-bg.webp';

export default function Home() {
  return (
    <>
      {/* <div className="relative h-0 pb-[65%] bg-[#00000c] overflow-hidden">
        <div className="absolute inset-0">
          <Parallax offset={0} className="z-10" speed={1}>
            <Image
              priority
              src={head}
              alt="hero image example"
              className="w-full"
            />
          </Parallax>
          <Parallax offset={0} className="z-0" speed={1.2}>
            <Image
              priority
              src={bg}
              alt="hero image example"
              className="w-full"
            />
          </Parallax>
          <Parallax offset={0} className="z-20 mt-36" speed={1.5}>
            <Image
              priority
              src={faded}
              alt="hero image example"
              className="w-full"
            />
          </Parallax>
        </div>
      </div> */}
      <NavBar />
      <AuxoDAO />
      <Lend />
      <Support />
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
