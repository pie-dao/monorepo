import React, { useRef } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import Image from 'next/image';
import grid from '../../public/images/home/hero/grid.jpg';
import AuxoLogotype from '../../public/images/home/hero/auxo-text.webp';
import AuxoBg from '../../public/images/home/hero/auxo-bg.webp';
import AuxoFluid from '../../public/images/home/hero/auxo-fluid.webp';
import uno from '../../public/images/home/hero/1.png';
import dos from '../../public/images/home/hero/2.png';
import tres from '../../public/images/home/hero/3.png';
import quatro from '../../public/images/home/hero/4.png';
import { motion } from 'framer-motion';
import RiveComponent, { Fit, Layout, Alignment } from '@rive-app/react-canvas';

const ParallaxSection: React.FC = () => {
  const parallax = useRef<IParallax>(null);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Parallax ref={parallax} pages={2}>
        <ParallaxLayer offset={0} speed={0.4} factor={2}>
          <Image
            src={tres}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
            className="mix-blend-color-dodge"
          />
          <Image
            src={quatro}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
          />
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.6} factor={2}>
          <Image
            src={dos}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
          />
        </ParallaxLayer>

        {/*
        <ParallaxLayer
          offset={-0.3}
          speed={1}
          style={{ backgroundColor: '#fff' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <ParallaxLayer offset={0} speed={0.3} factor={2}>
            <Image
              src={AuxoBg}
              alt="AuxoDAO"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </ParallaxLayer>
        </motion.div>

        <ParallaxLayer
          offset={0}
          speed={0.1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image src={AuxoLogotype} alt="AuxoDAO" />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0} factor={2}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image
              src={AuxoFluid}
              alt="AuxoDAO"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </motion.div>
        </ParallaxLayer>


        <ParallaxLayer
          offset={1.8}
          speed={1}
          factor={2}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center place-items-start"
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
        </ParallaxLayer> */}
        <ParallaxLayer
          offset={0.9}
          className="flex place-items-center h-[350px]"
          factor={1}
          speed={2}
        >
          <RiveComponent
            layout={
              new Layout({
                fit: Fit.ScaleDown,
                alignment: Alignment.TopCenter,
              })
            }
            src="/animations/hero-x.riv"
          />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};
export default ParallaxSection;
