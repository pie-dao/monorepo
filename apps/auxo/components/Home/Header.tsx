import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="absolute w-full py-5 bg-transparent z-30 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 32 4"
            className="w-8 h-1 fill-current relative -left-1"
          >
            <rect width="32" height="4" fill="#0B78DD" rx="2" />
          </svg>
        </div>
        <div className="flex items-center gap-x-6">
          <Link passHref href="/ARV">
            <button className="w-fit px-8 py-2 text-base text-white bg-secondary rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary flex gap-x-2 items-center font-medium">
              {t('launchApp')}
            </button>
          </Link>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 4"
              className="w-8 h-1 fill-current relative -right-1"
            >
              <rect width="32" height="4" fill="#0B78DD" rx="2" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
