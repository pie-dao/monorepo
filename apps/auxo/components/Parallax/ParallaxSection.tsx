import React, { useRef } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import Image from 'next/image';
import { motion } from 'framer-motion';
import RiveComponent, { Fit, Layout, Alignment } from '@rive-app/react-canvas';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Container from '../Container/Container';
import AuxoLogotype from '../../public/images/home/hero/auxo-text.webp';
import cloudOne from '../../public/images/home/hero/cloudOne.webp';
import cloudTwo from '../../public/images/home/hero/cloudTwo.webp';
import fluid from '../../public/images/home/hero/fluid.webp';
import bg from '../../public/images/home/hero/bg.webp';
import classNames from '../../utils/classnames';

const tokens = [
  {
    name: 'ARV',
    image: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
        <rect
          width="32"
          height="32"
          fill="#0B78DD"
          rx="16"
          transform="matrix(1 -9e-8 -9e-8 -1 0 32)"
        />
        <path
          fill="#fff"
          d="M18.1951 24.9102h-4.9415L7.20019 8.68925h4.22901l3.0119.98884h2.5664l3.0183-.98884h3.9746L18.1951 24.9102Zm-5.5847-12.6456 3.0183 8.9622h.1934c.0399-.1144.0777-.2375.1177-.3735l2.8984-8.5887-1.8286.9889h-2.5664l-1.8307-.9889h-.0021Z"
        />
      </svg>
    ),
    description: 'maxRewards',
    button: {
      text: 'common:stake',
      link: '/ARV',
    },
    bg: 'bg-secondary/30',
  },
  {
    name: 'AUXO',
    image: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24">
        <rect width="24" height="24" x=".5" fill="#1F0860" rx="12" />
        <path
          fill="#fff"
          d="M14.1456 5.31738h-3.7062L5.89941 17.4831h3.17172l2.25897-.7417h1.9248l2.2637.7417h2.981l-4.354-12.16572ZM9.95707 14.8015l2.26373-6.72162h.145c.03.08582.0583.17812.0883.28014l2.1738 6.44148-1.3714-.7416h-1.9248l-1.37306.7416h-.00157Z"
        />
      </svg>
    ),
    description: 'intrinsicValue',
    button: {
      text: 'common:getNow',
      link: '/treasury',
    },
    bg: 'bg-primary/30',
  },
  {
    name: 'PRV',
    image: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
        <rect
          width="32"
          height="32"
          fill="#1F0860"
          rx="16"
          transform="matrix(1 -9e-8 -9e-8 -1 0 32)"
        />
        <path
          fill="#fff"
          d="m14.596 14.895-1.4284-1.7431.081.0188-3.75019-4.80237L8 8v4.027l1.42843 2.868v2.4458L8 20.2135V24l1.10597-.2604 5.49003-6.3988V14.895Zm3.1901 2.2088 1.4285 1.7431-.081-.0176 3.7502 4.8024 1.497.3683v-4.027l-1.4271-2.8692v-2.4446l1.4271-2.8739V8l-1.1046.26041-5.4901 6.39879v2.4446Z"
        />
      </svg>
    ),
    description: 'keepLiquidity',
    button: {
      text: 'common:stake',
      link: '/PRV',
    },
    bg: 'bg-sub-dark/30',
  },
];

const ParallaxSection: React.FC = () => {
  const { t } = useTranslation('home');
  const parallax = useRef<IParallax>(null);

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
            src={fluid}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="start"
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          speed={0.7}
          factor={3}
          style={{ width: '30%', marginLeft: '70%' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image src={cloudOne} alt="cloud" />
          </motion.div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0.8}
          speed={1}
          factor={3}
          style={{ width: '45%', marginLeft: '3%' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Image src={cloudTwo} alt="cloud" />
          </motion.div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0.8}
          speed={0.1}
          className="flex mt-16 md:mt-0 md:place-items-center"
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
          offset={1.2}
          speed={0.2}
          className="flex sm:place-items-center"
        >
          <Container
            size="lg"
            className="w-full flex flex-col items-center content-center pointer-events-none lg:grid lg:grid-cols-3 gap-y-7 place-items-center text-white"
          >
            {tokens.map((token, i) => (
              <div
                className={classNames(
                  'flex flex-col items-center justify-center gap-y-3 lg:gap-y-6',
                  i % 2 === 0 && 'lg:mt-36',
                )}
                key={i}
              >
                <div className={`rounded-full ${token.bg} flex p-3 shadow-sm`}>
                  <div
                    className={classNames(
                      'w-10 h-10',
                      i % 2 !== 0 && 'top-[1px] relative',
                    )}
                  >
                    {token.image}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-center">
                    {t(token.name)}
                  </h2>
                  <p className="text-center">{t(token.description)}</p>
                </div>
                <div>
                  <Link passHref href={token.button.link}>
                    <button className="w-fit mx-auto px-16 py-1 text-lg font-medium text-white bg-transparent rounded-2xl ring-inset ring-2 ring-white enabled:hover:bg-white enabled:hover:text-primary disabled:opacity-70">
                      {t(token.button.text)}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Container>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};
export default ParallaxSection;
