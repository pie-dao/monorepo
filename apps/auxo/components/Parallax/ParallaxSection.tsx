import React, { useRef } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import Image from 'next/image';
import grid from '../../public/images/home/hero/grid.jpg';
import AuxoLogotype from '../../public/images/home/hero/auxo-text.webp';
import AuxoBg from '../../public/images/home/hero/auxo-bg.webp';
import AuxoFluid from '../../public/images/home/hero/auxo-fluid.webp';
import uno from '../../public/images/home/hero/1.webp';
import dos from '../../public/images/home/hero/2.webp';
import tres from '../../public/images/home/hero/3.webp';
import bg from '../../public/images/home/hero/bg.webp';
import quatro from '../../public/images/home/hero/4.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import RiveComponent, { Fit, Layout, Alignment } from '@rive-app/react-canvas';

const ParallaxSection: React.FC = () => {
  const parallax = useRef<IParallax>(null);
  {
    /* put scroll opacity on font */
  }
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 0.5, 1], [1, 0.5, 0]);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Parallax ref={parallax} pages={2}>
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={3}
          className="mix-blend-color-dodge"
        >
          <Image
            src={bg}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={0}
          speed={0.3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              width: '45%',
            }}
          >
            <Image src={AuxoLogotype} alt="AuxoDAO" />
          </motion.div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.2}
          speed={0.2}
          factor={3}
          className="mix-blend-color-dodge"
        >
          <Image
            src={tres}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.1}
          speed={0.4}
          factor={3}
          style={{ width: '30%', marginLeft: '60%' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image src={uno} alt="AuxoDAO" />
          </motion.div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0.8}
          speed={0.4}
          factor={3}
          style={{ width: '45%', marginLeft: '3%' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image src={dos} alt="AuxoDAO" />
          </motion.div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0.9}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div className="flex h-[550px] w-[75%] md:w-[55%] mx-auto">
            <RiveComponent
              layout={
                new Layout({
                  fit: Fit.Contain,
                  alignment: Alignment.Center,
                })
              }
              src="/animations/hero-x-nocubes.riv"
            />
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          speed={1}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center text-white"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center">1</h1>
            <p className="text-center">Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center">2</h1>
            <p className="text-center">Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center">3</h1>
            <p className="text-center">Lorem ipsum dolor sit amet.</p>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};
export default ParallaxSection;
