import useTranslation from 'next-translate/useTranslation';

type Props = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

const ContentBanner: React.FC<Props> = ({ title, icon, description }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col px-4 py-4 rounded-md shadow-md bg-white gap-y-3 items-center">
      <div className="rounded-full bg-light-gray flex p-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-secondary">{t(title)}</h3>
      <p className="text-sm text-sub-dark">{t(description)}</p>
    </div>
  );
};

export default ContentBanner;
