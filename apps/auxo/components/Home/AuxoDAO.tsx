import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Container from '../Container/Container';
import LeftRightContainer from '../LeftRightContainer/LeftRightContainer';
import Feature1Image from '../../public/images/home/features/feature1.svg';
import Feature2Image from '../../public/images/home/features/feature2.svg';
import AUXO from '../../public/tokens/AUXO.svg';
import veAUXOIcon from '../../public/tokens/veAUXO.svg';
import xAUXOIcon from '../../public/tokens/xAUXO.svg';
import Link from 'next/link';
import RiveComponent, { Fit, Layout, Alignment } from '@rive-app/react-canvas';

const AuxoDAO: React.FC = () => {
  const { t } = useTranslation('home');
  const auxoFeature = [
    {
      title: (
        <Trans
          i18nKey="AUXOFeatureTitle"
          components={{ treasury: <span className="text-secondary" /> }}
          ns="home"
        />
      ),
      description: (
        <span className="flex flex-col gap-y-4">
          <span className="font-medium">
            <Trans i18nKey="AUXOFeatureSubtitle" ns="home" />
          </span>
          <span>
            <Trans i18nKey="AUXOFeatureDescription1" ns="home" />
          </span>
          <span>
            <Trans i18nKey="AUXOFeatureDescription2" ns="home" />
          </span>
        </span>
      ),
      image: {
        alt: 'AUXOFeatureTitle',
        src: Feature1Image,
      },
      button: {
        image: AUXO,
        text: 'AUXO',
        link: '/',
      },
    },
  ];

  const features = [
    {
      title: t('veAUXOFeatureTitle'),
      description: t('veAUXOFeatureDescription'),
      image: {
        alt: 'veAUXOFeatureTitle',
        src: Feature1Image,
      },
      button: {
        image: veAUXOIcon,
        text: 'veAUXO',
        link: '/',
      },
    },
    {
      title: t('xAUXOFeatureTitle'),
      description: t('xAUXOFeatureDescription'),
      image: {
        alt: 'xAUXOFeatureTitle',
        src: Feature2Image,
      },
      button: {
        image: xAUXOIcon,
        text: 'xAUXO',
        link: '/',
      },
    },
  ];

  const yieldFeatures = [
    {
      title: t('yieldFeatureTitle1'),
      description: t('yieldFeatureDescription1'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 36 28"
          className="w-10 h-10"
        >
          <path
            fill="#7378A5"
            d="M35.5 8.75C35.5 3.91751 31.5825-6e-8 26.75-6e-8 24.8555-.00767524 23.011.607174 21.5 1.75H4C2.067 1.75.5 3.317.5 5.25V24.5C.5 26.433 2.067 28 4 28h26.25c1.933 0 3.5-1.567 3.5-3.5V14c1.1428-1.511 1.7577-3.3555 1.75-5.25ZM25.21 4.375c0-.48325.3918-.875.875-.875h1.33c.4832 0 .875.39175.875.875V7.21h2.835c.4832 0 .875.39175.875.875v1.33c0 .48325-.3918.875-.875.875H28.29v2.835c0 .4832-.3918.875-.875.875h-1.33c-.4832 0-.875-.3918-.875-.875V10.29h-2.835c-.4833 0-.875-.39175-.875-.875v-1.33c0-.48325.3917-.875.875-.875h2.835V4.375ZM4 5.25h14.735c-.4863 1.10268-.7366 2.29486-.735 3.5.0045.58747.0631 1.17327.175 1.75H4V5.25ZM4 24.5v-8.75h17.5c2.5112 1.914 5.8673 2.3033 8.75 1.015V24.5H4Z"
          />
        </svg>
      ),
    },
    {
      title: t('yieldFeatureTitle2'),
      description: t('yieldFeatureDescription2'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 42 42"
          className="w-10 h-10"
        >
          <g clipPath="url(#a)">
            <g clipPath="url(#b)">
              <path
                fill="#7378A5"
                d="m37.73 12.635-7.14-7.1225c-.1588-.16919-.3805-.26516-.6125-.26516-.232 0-.4537.09597-.6125.26516l-.63.6125c-.3356.34617-.3356.89633 0 1.2425l3.64 3.64v4.1475c.0006.696.2776 1.3632.77 1.855l2.73 2.7475V30.625c0 .9665-.7835 1.75-1.75 1.75s-1.75-.7835-1.75-1.75V22.75c0-1.933-1.567-3.5-3.5-3.5H26.25V8.75c0-1.933-1.567-3.5-3.5-3.5h-10.5c-1.933 0-3.5 1.567-3.5 3.5v24.5c0 .9665.7835 1.75 1.75 1.75h14c.9665 0 1.75-.7835 1.75-1.75V21.875h2.625c.4832 0 .875.3918.875.875v7.875c0 2.4162 1.9588 4.375 4.375 4.375s4.375-1.9588 4.375-4.375V14.5075c-.0035-.7005-.2797-1.3721-.77-1.8725ZM22.75 15.75h-10.5v-7h10.5v7Z"
              />
              <path
                fill="#F77070"
                stroke="url(#c)"
                d="M5.95711 33.1987h41v6h-41z"
                transform="rotate(-45 5.95711 33.1987)"
              />
            </g>
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h42v42H0z" />
            </clipPath>
            <clipPath id="b">
              <path fill="#fff" d="M1.75 0h42v42h-42z" />
            </clipPath>
            <linearGradient
              id="c"
              x1="5.25"
              x2="45.6242"
              y1="34.5496"
              y2="38.8234"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#F6F7FF" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      title: t('yieldFeatureTitle3'),
      description: t('yieldFeatureDescription3'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 42 42"
          className="w-10 h-10"
        >
          <g clipPath="url(#a)">
            <path
              fill="#7378A5"
              d="M35 19.25h-3.5V14c0-1.933-1.567-3.5-3.5-3.5h-5.25V7c0-1.933-1.567-3.5-3.5-3.5H7C5.067 3.5 3.5 5.067 3.5 7v12.25c0 1.933 1.567 3.5 3.5 3.5h3.5V28c0 1.933 1.567 3.5 3.5 3.5h5.25V35c0 1.933 1.567 3.5 3.5 3.5H35c1.933 0 3.5-1.567 3.5-3.5V22.75c0-1.933-1.567-3.5-3.5-3.5Zm-28 0V7h12.25v3.5H14c-1.933 0-3.5 1.567-3.5 3.5v5.25H7ZM35 35H22.75v-3.5H28c1.933 0 3.5-1.567 3.5-3.5v-5.25H35V35Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h42v42H0z" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];
  return (
    <section
      id="auxodao"
      className="scroll-mt-14 py-16 sm:scroll-mt-38 sm:py-20 lg:py-38"
    >
      <Container size="lg" className="flex flex-col">
        <h5 className="text-center text-secondary text-lg font-bold">
          {t('yieldCrossChain')}
        </h5>
        <h2 className="text-center text-4xl font-bold text-primary mt-2 mb-4">
          <Trans
            i18nKey="organicYield"
            ns="home"
            components={{
              secondary: <span className="text-secondary" />,
            }}
          />
        </h2>
        <p className="text-base text-center text-primary">
          <Trans
            i18nKey="organicYieldDescription"
            ns="home"
            components={{
              bold: <span className="font-bold" />,
            }}
          />
        </p>
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-3 lg:text-center -ml-2 md:ml-0 xl:-mx-10">
          {yieldFeatures.map((feature, index) => (
            <div key={index} className="flex gap-y-4 relative isolate">
              <div className="flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-background shadow-md relative z-10 left-6 -top-2">
                {feature.icon}
              </div>
              <div className="relative w-full pl-8 pr-4 py-3 bg-background rounded-lg text-left">
                <h3 className="text-xl font-bold text-primary">
                  {feature.title}
                </h3>
                <p className="text-sub-dark">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <LeftRightContainer features={auxoFeature} textPosition="left" />
      <Container
        size="lg"
        className="flex flex-col gap-y-12 scroll-mt-14 py-16 sm:scroll-mt-38 sm:py-20 lg:py-38"
      >
        <h3 className="text-4xl font-bold text-primary text-center">
          {t('participate')}
        </h3>
        <p className="lg:max-w-2xl">{t('participateDescription')}</p>
      </Container>
      <LeftRightContainer features={features} />
      <div className="w-full bg-[url('/images/background/bg-farm.png')] bg-cover relative gap-y-12 scroll-mt-14 py-16 sm:scroll-mt-38 sm:py-20 lg:py-38 my-48">
        <div className="absolute inset-0 bg-primary opacity-70" />
        <Container
          size="xl"
          className="flex flex-col text-white text-center isolate relative pb-20 lg:pb-48"
        >
          <h3 className="text-4xl font-bold text-center uppercase">
            {t('farmSeriously')}
          </h3>
          <h5 className="text-base text-sub-light mt-1">
            {t('farmSeriouslyDescription')}
          </h5>
          <Link passHref href="/farms">
            <button className="w-fit mx-auto px-16 py-1 text-lg font-medium text-white bg-transparent rounded-2xl ring-inset ring-2 ring-white enabled:hover:bg-white enabled:hover:text-primary disabled:opacity-70 mt-8">
              {t('farmNow')}
            </button>
          </Link>
          <div className="grid grid-cols-1 gap-y-10 gap-x-3 sm:grid-cols-3 lg:text-center -ml-2 md:ml-0 xl:-mx-10 mt-20">
            <div className="md:mt-8 flex flex-col items-center text-base">
              <p className="flex font-bold text-5xl bg-background/20 rounded-full h-24 w-24 place-items-center">
                <span className="w-full">32</span>
              </p>
              <p className="font-bold mt-3">{t('common:veAUXO')}</p>
              <p>{t('maxRewards')}</p>
            </div>
            <div className="flex flex-col items-center mb-2 text-base">
              <p className="font-bold text-5xl">$&nbsp;2.000.000</p>
              <p className="font-bold mt-5">{t('common:AUXO')}</p>
              <p>{t('intrinsicValue')}</p>
            </div>
            <div className="md:mt-8 flex flex-col items-center text-base">
              <p className="flex font-bold text-5xl bg-background/20 rounded-full h-24 w-24 place-items-center">
                <span className="w-full">12</span>
              </p>
              <p className="font-bold mt-3">{t('common:xAUXO')}</p>
              <p>{t('keepLiquidity')}</p>
            </div>
          </div>
        </Container>
        <Container
          size="xl"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-24 sm:-translate-y-16 w-full"
        >
          <div className="h-[780px] w-full rounded-lg overflow-hidden isolate">
            <RiveComponent
              src="/animations/auxo-flow.riv"
              layout={
                new Layout({
                  fit: Fit.ScaleDown,
                  alignment: Alignment.Center,
                })
              }
            />
          </div>
        </Container>
      </div>
    </section>
  );
};

export default AuxoDAO;
