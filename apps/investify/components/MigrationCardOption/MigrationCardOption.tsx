import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

type Props = {
  title: string;
  icon: React.ReactNode;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  button: {
    text: string;
    url: string;
  };
};

const MigrationCardOption: React.FC<Props> = ({
  title,
  icon,
  description,
  features,
  button,
}) => {
  const { t } = useTranslation('migration');
  return (
    <div className="flex flex-col px-4 py-4 rounded-md bg-gradient-primary shadow-md bg gap-y-3 items-center divide-y w-full font-medium">
      <div className="rounded-full bg-light-gray flex p-4 shadow-sm ">
        {icon}
      </div>
      <div className="flex flex-col items-center w-full border-hidden">
        <h3 className="text-lg font-bold text-primary">{t(title)}</h3>
        <p className="text-sm text-sub-dark">{t(description)}</p>
      </div>
      <div className="flex w-full flex-col pt-4">
        {features.map(({ title, description }) => (
          <div
            className="flex items-center justify-between gap-y-2 text-base w-full"
            key={title}
          >
            <dt className="text-primary flex-shrink-0 mr-2">{t(title)}</dt>
            <dd className="text-green truncate">{t(description)}</dd>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full text-center pt-4">
        <Link href={button.url} passHref>
          <button className="w-full px-4 py-2 text-base text-secondary bg-transparent rounded-full ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center justify-center">
            {t(button.text)}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MigrationCardOption;
