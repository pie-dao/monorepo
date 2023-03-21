import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Container from '../Container/Container';
import LeftRightContainer from '../LeftRightContainer/LeftRightContainer';
import Feature1Image from '../../public/images/home/features/feature1.svg';
import Feature2Image from '../../public/images/home/features/feature2.svg';
import AUXO from '../../public/tokens/AUXO.svg';
import ARVIcon from '../../public/tokens/32x32/ARV.svg';
import PRVIcon from '../../public/tokens/32x32/PRV.svg';
import Link from 'next/link';
import RiveComponent, { Fit, Layout, Alignment } from '@rive-app/react-canvas';
import classNames from '../../utils/classnames';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import {
  formatBalance,
  formatBalanceCurrency,
} from '../../utils/formatBalance';

const AuxoDAO: React.FC = () => {
  const { t } = useTranslation();
  const auxoFeature = [
    {
      title: (
        <Trans
          i18nKey="AUXOFeatureTitle"
          components={{ treasury: <span className="text-secondary" /> }}
          ns="common"
        />
      ),
      description: (
        <span className="flex flex-col gap-y-4">
          <span className="font-medium">
            <Trans i18nKey="AUXOFeatureSubtitle" ns="common" />
          </span>
          <span>
            <Trans i18nKey="AUXOFeatureDescription1" ns="common" />
          </span>
          <span>
            <Trans i18nKey="AUXOFeatureDescription2" ns="common" />
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
      title: t('ARVFeatureTitle'),
      description: t('ARVFeatureDescription'),
      image: {
        alt: 'ARVFeatureTitle',
        src: Feature1Image,
      },
      button: {
        image: ARVIcon,
        text: 'ARV',
        link: '/',
      },
    },
    {
      title: t('PRVFeatureTitle'),
      description: t('PRVFeatureDescription'),
      image: {
        alt: 'PRVFeatureTitle',
        src: Feature2Image,
      },
      button: {
        image: PRVIcon,
        text: 'PRV',
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
          viewBox="0 0 32 32"
          className="w-8 h-8"
        >
          <path
            fill="#7378A5"
            d="M27.7981 27.4933 5.83812 5.53333c-.12098-.1289-.28989-.20202-.46667-.20202s-.34569.07312-.46666.20202L4.19812 6.24c-.1289.12098-.20203.28989-.20203.46667s.07313.34569.20203.46666l3.8 3.78667c-1.61429 2.2576-2.54046 4.9342-2.66667 7.7067.00583 4.2686 2.55591 8.1226 6.48235 9.7971 3.9265 1.6745 8.4731.8469 11.5577-2.1038l2.7866 2.7733c.121.1289.2899.2021.4667.2021s.3457-.0732.4667-.2021l.7066-.7066c.1289-.121.202-.2899.202-.4667s-.0731-.3457-.202-.4667Zm-11.8-.8266c-4.4183 0-7.99998-3.5818-7.99998-8 .09363-2.065.75827-4.0636 1.92-5.7734L21.4781 24.4667c-1.4793 1.4053-3.4396 2.1923-5.48 2.2ZM14.5448 7.21333l1.4533-1.44 1.4534 1.44c4.4 4.41337 6.5466 8.15997 6.5466 11.45337.001.5241-.0526 1.0469-.16 1.56l2.1467 2.1466c.4508-1.1837.6812-2.44.68-3.7066 0-5.08-3.8133-9.81337-7.3333-13.33337l-2.4267-2.42666c-.1958-.1682-.449-.25419-.7067-.24h-.4c-.2651.00023-.5193.10574-.7066.29333l-2.4267 2.37333c-.6.6-1.2133 1.24-1.8133 1.90667l1.8933 1.89333c.5867-.62666 1.1467-1.25333 1.8-1.92Z"
          />
        </svg>
      ),
      background: "bg-[url('/images/background/home-gradient-box-1.png')]",
    },
    {
      title: t('yieldFeatureTitle2'),
      description: t('yieldFeatureDescription2'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 32 32"
          className="w-8 h-8"
        >
          <path
            fill="#7378A5"
            d="m28.99 13.9333-.2531-.2666c-.1919-.2097-.462-.3304-.7461-.3334h-.5195c-1.8265.0012-3.6356.3542-5.3287 1.04-.0908-4.3303-1.9317-8.43873-5.1022-11.38663-.2237-.20945-.5197-.32413-.826-.32h-.4262c-.3063-.00413-.6023.11055-.826.32-3.1705 2.9479-5.01143 7.05633-5.10221 11.38663-1.69306-.6858-3.50222-1.0388-5.32868-1.04h-.51955c-.27741.0031-.54174.1186-.73269.32l-.25311.2667c-.22011.1854-.34693.4588-.34637.7467-.31015 7.7111 5.62273 14.2429 13.32171 14.6666 7.699-.4237 13.6319-6.9555 13.3217-14.6666 0-.2811-.1214-.5485-.333-.7334Zm-16.479.7334c-.0042-3.3159 1.2423-6.51107 3.4903-8.9467 2.248 2.43563 3.4945 5.6308 3.4903 8.9467V15.84c-.7232.4791-1.401 1.0236-2.0249 1.6267-.5323.5486-1.0222 1.137-1.4654 1.76-.4432-.623-.9331-1.2114-1.4654-1.76-.607-.6005-1.2668-1.1449-1.9716-1.6267-.0266-.3867-.0533-.7733-.0533-1.1733Zm10.8039 8.6666c-1.9565 1.9575-4.5539 3.1413-7.3136 3.3334C10.2807 26.2852 5.72504 21.7256 5.34394 16c2.75186.1924 5.34076 1.3766 7.28696 3.3333.4321.4436.8285.9207 1.1856 1.4267l.9459 1.3333c.2487.3496.6503.558 1.079.56h.2665c.4287-.002.8303-.2104 1.079-.56l.9459-1.3333c.3571-.506.7535-.9831 1.1856-1.4267 1.9597-1.9684 4.5697-3.1536 7.3403-3.3333-.1911 2.7689-1.3792 5.3745-3.3438 7.3333Z"
          />
        </svg>
      ),
      background: "bg-[url('/images/background/home-gradient-box-2.png')]",
    },
    {
      title: t('yieldFeatureTitle3'),
      description: t('yieldFeatureDescription3'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 32 32"
          className="w-8 h-8"
        >
          <path
            fill="#7378A5"
            d="M27.7067 11.3467 17.48 4.34667c-.33-.2256-.7203-.34641-1.12-.34667h-.72c-.3997.00026-.79.12107-1.12.34667L4.29333 11.3467c-.18357.1212-.29382.3266-.29333.5466v.2134c-.00049.22.10976.4254.29333.5466l10.22667 7c.33.2256.7203.3464 1.12.3467h.72c.3997-.0003.79-.1211 1.12-.3467l10.2267-7c.1835-.1212.2938-.3266.2933-.5466v-.2134c.0005-.22-.1098-.4254-.2933-.5466Zm-11.56 5.9866h-.2934L8 12l7.8-5.33333h.2933L24 12l-7.8533 5.3333Zm11.56 2.0134-2.8134-1.9334-2.36 1.6134L24 20l-7.8 5.3333h-.2933L8 20l1.41333-.9733-2.30666-1.6134-2.81334 1.9334c-.18357.1212-.29382.3266-.29333.5466v.2134c-.00049.22.10976.4254.29333.5466l10.22667 7c.33.2256.7203.3464 1.12.3467h.72c.3997-.0003.79-.1211 1.12-.3467l10.2267-7c.1835-.1212.2938-.3266.2933-.5466v-.2134c.0005-.22-.1098-.4254-.2933-.5466Z"
          />
        </svg>
      ),
      background: "bg-[url('/images/background/home-gradient-box-3.png')]",
    },
  ];
  return (
    <section
      id="auxodao"
      className="scroll-mt-14 py-16 sm:scroll-mt-38 sm:py-20 lg:py-38"
    >
      <Container size="xl" className="flex flex-col">
        <h5 className="text-center text-secondary text-lg font-bold">
          {t('yieldCrossChain')}
        </h5>
        <h2 className="text-center text-4xl font-bold text-primary mt-2 mb-4">
          <Trans
            i18nKey="organicYield"
            ns="common"
            components={{
              secondary: <span className="text-secondary" />,
            }}
          />
        </h2>
        <p className="text-base text-center text-primary">
          <Trans
            i18nKey="organicYieldDescription"
            ns="common"
            components={{
              bold: <span className="font-bold" />,
            }}
          />
        </p>
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-3 lg:text-center">
          {yieldFeatures.map((feature, index) => (
            <div key={index} className="flex gap-y-4 relative isolate">
              <div className="flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-background shadow-md relative z-10 left-6 -top-2">
                {feature.icon}
              </div>
              <div
                className={classNames(
                  'relative w-full pl-8 pr-4 py-3 bg-bottom bg-no-repeat rounded-lg text-left',
                  feature.background,
                )}
              >
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
        size="wide"
        className="flex flex-col gap-y-12 scroll-mt-14 py-8 sm:scroll-mt-38 sm:py-20 lg:py-38 bg-gradient-major-secondary-predominant md:rounded-lg my-24 lg:mx-24"
      >
        <h3 className="text-4xl font-semibold text-white text-center">
          {t('participate')}
        </h3>
        <p className="lg:max-w-2xl text-white text-base">
          {t('participateDescription')}
        </p>
      </Container>
      <LeftRightContainer features={features} />
      <div className="w-full bg-[url('/images/background/bg-farm.png')] bg-cover relative gap-y-12 scroll-mt-14 py-16 sm:scroll-mt-38 sm:py-20 lg:py-38 my-48">
        <div className="absolute inset-0 bg-primary opacity-70" />
        <Container
          size="xl"
          className="flex flex-col text-white text-center isolate relative pb-20 lg:pb-48"
        >
          <h3 className="text-3xl lg:text-4xl font-semibold text-center uppercase">
            {t('farmSeriously')}
          </h3>
          <h5 className="text-base text-white font-semibold mt-2">
            {t('farmSeriouslyDescription')}
          </h5>
          <Link passHref href="/farms">
            <button className="w-fit mx-auto px-20 py-2 text-lg font-medium text-white bg-transparent rounded-full ring-inset ring-2 ring-white enabled:hover:bg-white enabled:hover:text-primary disabled:opacity-70 mt-8">
              {t('farmNow')}
            </button>
          </Link>
          <div className="grid grid-cols-1 gap-y-10 gap-x-3 sm:grid-cols-3 lg:text-center -ml-2 md:ml-0 xl:-mx-10 mt-20">
            <div className="md:mt-8 flex flex-col items-center text-base">
              <p className="flex font-bold text-5xl bg-background/20 rounded-full h-24 w-24 place-items-center">
                <span className="w-full">32</span>
              </p>
              <p className="font-bold text-lg mt-3">{t('common:ARV')}</p>
              <p className="text-sm mt-2">{t('maxRewards')}</p>
            </div>
            <div className="flex flex-col items-center mb-2 text-base">
              <p className="font-bold text-5xl">
                <AnimatedAmount value={4_000_000} />
              </p>
              <p className="font-bold text-lg mt-5">{t('common:AUXO')}</p>
              <p className="text-sm mt-2">{t('intrinsicValue')}</p>
            </div>
            <div className="md:mt-8 flex flex-col items-center text-base">
              <p className="flex font-bold text-5xl bg-background/20 rounded-full h-24 w-24 place-items-center">
                <span className="w-full">12</span>
              </p>
              <p className="font-bold text-lg mt-3">{t('common:PRV')}</p>
              <p className="text-sm mt-2">{t('keepLiquidity')}</p>
            </div>
          </div>
        </Container>
        <Container
          size="xl"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-80 sm:-translate-y-16 w-full"
        >
          <div className="h-[460px] md:h-[780px] w-full rounded-lg overflow-hidden isolate">
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

function AnimatedAmount({ value }: { value: number }) {
  const { defaultLocale, defaultCurrency } = useAppSelector(
    (state) => state.preferences,
  );
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: value > 1_000_000 ? 1800 : 2500,
  });

  const isInView = useInView(ref, {
    once: true,
  });
  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(
    () =>
      springValue.onChange((latest) => {
        if (ref.current) {
          ref.current.textContent = formatBalanceCurrency(
            latest,
            defaultLocale,
            defaultCurrency,
            false,
            0,
          );
        }
      }),
    [defaultCurrency, defaultLocale, springValue],
  );

  return <span ref={ref} />;
}

export default AuxoDAO;
