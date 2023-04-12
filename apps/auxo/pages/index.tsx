import { NavBar } from '../components/NavBar/NavBar';
import { AuxoDAO, Lend, Footer } from '../components/Home';

import ParallaxSection from '../components/Parallax/ParallaxSection';

export default function Home() {
  return (
    <>
      <NavBar />
      <ParallaxSection />
      <div>
        <AuxoDAO />
        <Lend />
      </div>
      <Footer />
    </>
  );
}
