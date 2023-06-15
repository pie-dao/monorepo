import { NavBar } from '../components/NavBar/NavBar';
import { AuxoDAO, Lend, Footer } from '../components/Home';
import ParallaxSection from '../components/Parallax/ParallaxSection';
import { useBodyClass } from '../hooks/useBodyClass';

export default function Home() {
  useBodyClass();
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
