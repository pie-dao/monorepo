import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Container from '../Container/Container';

const lendFeatures = [
  {
    title: 'lendFeatureTitle1',
    description: 'lendFeatureDescription1',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 27 24"
        className="w-6 h-6"
      >
        <path
          fill="currentColor"
          d="M26.487 6.88 20.9537.866667C20.4503.316413 19.7395.00210413 18.9937 0H8.00703c-.74578.00210413-1.4566.316413-1.96.866667L.513695 6.88c-.225369.24793-.349134.57162-.346667.90667v.4C.16642 8.4982.27492 8.80012.473695 9.04L12.4737 23.52c.2538.3047.6301.4806 1.0267.48.3965.0006.7728-.1753 1.0266-.48l12-14.48c.1988-.23988.3073-.5418.3067-.85333v-.4c.0025-.33505-.1213-.65874-.3467-.90667ZM13.5004 20.6133 9.7937 8.93333C9.6127 8.35559 9.06516 7.97231 8.46036 8H3.1137l4.89333-5.33333H18.9937L15.1804 6.88c-.1809.19496-.2285.47874-.1213.72208.1071.24335.3487.39973.6146.39792h8.2133L13.5004 20.6133Z"
        />
      </svg>
    ),
  },
  {
    title: 'lendFeatureTitle2',
    description: 'lendFeatureDescription2',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 23 25"
        className="w-6 h-6"
      >
        <path
          fill="currentColor"
          d="M22.1693 1.47941v7.01333c-.001 1.06051-.423 2.07726-1.1734 2.82666l-2.44 2.44c-.2463.2484-.3852.5836-.3866.9333v9.4534c0 .3682-.2985.6666-.6667.6666h-2.6667c-.3682 0-.6666-.2984-.6666-.6666v-5.4534c-.0015-.3497-.1404-.6849-.3867-.9333l-.56-.56c-.2483-.2463-.5835-.3852-.9333-.3867h-1.5734c-.3497.0015-.6849.1404-.9333.3867l-.56.56c-.24632.2484-.38519.5836-.38666.9333v5.4534c0 .3682-.29848.6666-.66667.6666H5.5026c-.36819 0-.66666-.2984-.66666-.6666v-9.4534c-.00148-.3497-.14034-.6849-.38667-.9333l-2.44-2.44C1.25891 10.57.836871 9.55325.835938 8.49274V1.47941c0-.36819.298472-.666666.666662-.666666h2.66667c.36819 0 .66667.298476.66667.666666v2.66667c0 .36819.29847.66666.66666.66666h2.66667c.36819 0 .66667-.29847.66667-.66666V1.47941c0-.36819.29847-.666666.66666-.666666h4c.3682 0 .6667.298476.6667.666666v2.66667c0 .36819.2984.66666.6666.66666h2.6667c.3682 0 .6667-.29847.6667-.66666V1.47941c0-.36819.2984-.666666.6666-.666666h2.6667c.3682 0 .6667.298476.6667.666666Z"
        />
      </svg>
    ),
  },
  {
    title: 'lendFeatureTitle3',
    description: 'lendFeatureDescription3',
    icon: (
      <svg
        width="25"
        height="30"
        viewBox="0 0 25 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <path
          d="M23.3267 5.63933L18.62 0.932664C18.1189 0.428611 17.4374 0.145434 16.7267 0.145997H8.27333C7.56261 0.145434 6.88106 0.428611 6.38 0.932664L1.67333 5.63933C0.922974 6.38876 0.500934 7.40549 0.5 8.466V16.266C0.502469 19.5557 2.02276 22.6603 4.62 24.6793L10.06 28.9193C10.5291 29.2834 11.1062 29.4804 11.7 29.4793H13.3C13.8938 29.4804 14.4709 29.2834 14.94 28.9193L20.38 24.6793C22.9772 22.6603 24.4975 19.5557 24.5 16.266V8.466C24.4991 7.40549 24.077 6.38876 23.3267 5.63933ZM21.8333 16.306C21.8439 18.776 20.6996 21.109 18.74 22.6127L13.3 26.8127H11.7L6.26 22.5727C4.3004 21.069 3.15608 18.736 3.16667 16.266V8.466C3.16814 8.11621 3.30701 7.78101 3.55333 7.53266L8.27333 2.81266H16.7267L21.4467 7.53266C21.693 7.78101 21.8319 8.11621 21.8333 8.466V16.306ZM17.94 11.1593L14.4733 10.8927L13.14 7.65266C13.0353 7.40683 12.7939 7.24728 12.5267 7.24728C12.2595 7.24728 12.0181 7.40683 11.9133 7.65266L10.58 10.8927L7.11333 11.1593C6.84954 11.1893 6.62731 11.37 6.54421 11.6222C6.46112 11.8743 6.53237 12.1518 6.72667 12.3327L9.39333 14.5993L8.5 17.986C8.43577 18.2467 8.53415 18.5204 8.74962 18.6806C8.96509 18.8407 9.25559 18.856 9.48667 18.7193L12.5 16.8927L15.5 18.7193C15.7311 18.856 16.0216 18.8407 16.237 18.6806C16.4525 18.5204 16.5509 18.2467 16.4867 17.986L15.6733 14.5993L18.34 12.3327C18.5352 12.15 18.6052 11.8699 18.5189 11.6168C18.4326 11.3638 18.2061 11.1848 17.94 11.1593Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const Lend: React.FC = () => {
  const { t } = useTranslation('home');
  return (
    <section
      id="lend"
      className="scroll-mt-14 pb-16 sm:scroll-mt-24 sm:pb-20 lg:pb-38"
    >
      <Container
        size="lg"
        className="py-16 place-items-center flex flex-col bg-primary md:rounded-lg"
      >
        <h3 className="text-4xl font-bold text-center text-white">
          {t('lendTitle')}
        </h3>
        <h5 className="text-base text-sub-light text-center font-medium">
          {t('lendDescription')}
        </h5>
        <Container size="sm">
          <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-3 lg:text-center">
            {lendFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex gap-y-4 relative isolate place-items-center"
              >
                <div className="flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-background/10 shadow-md text-secondary">
                  {feature.icon}
                </div>
                <div className="relative w-full pl-8 pr-4 py-3 rounded-lg text-left">
                  <p className="text-white font-bold">
                    {t(feature.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
        <Link passHref href="/farms">
          <button className="w-fit mx-auto px-16 py-1 text-lg font-medium text-white bg-transparent rounded-2xl ring-inset ring-2 ring-white enabled:hover:bg-white enabled:hover:text-primary disabled:opacity-70 mt-8">
            {t('lendNow')}
          </button>
        </Link>
      </Container>
    </section>
  );
};

export default Lend;
