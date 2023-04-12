import React from 'react';
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
import ARVImage from '../../public/tokens/32x32/ARV.svg';
import AUXOImage from '../../public/tokens/AUXO.svg';
import PRVImage from '../../public/tokens/32x32/PRV.svg';

const tokens = [
  {
    name: 'ARV',
    image: <Image src={ARVImage} alt="ARV" width={42} height={42} />,
    description: 'maxRewards',
    button: {
      text: 'common:stake',
      link: '/ARV',
    },
    bg: 'bg-secondary/30',
  },
  {
    name: 'AUXO',
    image: <Image src={AUXOImage} alt="AUXO" width={42} height={42} />,
    description: 'intrinsicValue',
    button: {
      text: 'common:getNow',
      link: '/treasury',
    },
    bg: 'bg-primary/30',
  },
  {
    name: 'PRV',
    image: <Image src={PRVImage} alt="PRV" width={42} height={42} />,
    description: 'keepLiquidity',
    button: {
      text: 'common:stake',
      link: '/PRV',
    },
    bg: 'bg-sub-dark/30',
  },
];

const ParallaxSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={bg}
            alt="AuxoDAO"
            layout="fill"
            objectFit="cover"
            objectPosition="top"
            className="mix-blend-color-dodge"
            priority
          />

          <Image
            src={fluid}
            alt="AuxoDAO"
            layout="responsive"
            objectFit="cover"
            objectPosition="bottom"
            className="mix-blend-color-dodge"
            priority
          />
        </div>
        <div className="relative inset-0 z-10 overflow-hidden">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              height: '100dvh',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-[80%] md:w-[55%]"
            >
              <Image src={AuxoLogotype} alt="AuxoDAO" priority />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-primary font-bold text-lg sm:text-2xl lg:text-4xl max-w-sm lg:max-w-xl text-center relative -top-8 lg:-top-10 xl:-top-12"
            >
              {t('subtitle')}
            </motion.h3>
          </div>

          <div
            style={{
              width: '30%',
              marginLeft: '65%',
              marginTop: '10%',
              position: 'absolute',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image src={cloudOne} alt="cloud" priority />
            </motion.div>
          </div>
          <div
            style={{
              width: '45%',
              marginLeft: '3%',
              marginTop: '-10%',
              position: 'absolute',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image src={cloudTwo} alt="cloud" priority />
            </motion.div>
          </div>
          <div className="flex mt-16 md:mt-0 md:place-items-center">
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
          </div>
          <Container
            size="xl"
            className="w-full flex flex-col items-center content-start pointer-events-none lg:grid lg:grid-cols-3 gap-y-7 place-items-start text-white mb-32"
          >
            {tokens.map((token, i) => (
              <div
                className={classNames(
                  'flex flex-col items-center justify-start gap-y-3 lg:gap-y-6',
                  i % 2 === 0 && 'lg:mt-16',
                )}
                key={i}
              >
                <div className={`rounded-full ${token.bg} flex p-3 shadow-sm`}>
                  <div
                    className={classNames(
                      'w-[42px] h-[42px]',
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
        </div>
      </div>
    </>
  );
};
export default ParallaxSection;
