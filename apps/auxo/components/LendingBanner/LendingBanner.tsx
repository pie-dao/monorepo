import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

const LendingBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="mt-6">
      <div className="lg:w-full mx-auto my-2 relative overflow-hidden">
        <div className="relative h-[328px] flex-[0_0_100%] min-w-0 overflow-hidden">
          <div className="overflow-hidden shadow-sm items-start w-full font-medium transition-all mx-auto bg-center bg-no-repeat bg-[url('/images/background/pools.png')] bg-cover h-full relative rounded-lg">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center py-4 px-6 md:py-6 md:px-20 w-max flex rounded-lg flex-col place-items-center bg-gradient-primary space-y-4">
              <p className="text-xl font-medium text-white bg-gradient-major-secondary-predominant rounded-lg py-1 px-4">
                {t('yieldInAdvance')}
              </p>
              <Trans
                i18nKey="lendingSlideTitle"
                components={{
                  highlight: <p className="text-2xl text-primary font-bold" />,
                }}
              />
              <p className=" max-w-sm text-primary font-semibold text-xl mt-2 mx-auto">
                <Trans
                  i18nKey="LendingSlideDescription"
                  components={{
                    br: <br />,
                  }}
                />
              </p>
              <button className="w-fit px-12 md:px-20 py-2 text-lg font-medium text-white bg-primary rounded-full ring-inset ring-2 ring-primary enabled:hover:bg-transparent enabled:hover:text-primary disabled:opacity-70">
                {t('joinPool')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LendingBanner;
