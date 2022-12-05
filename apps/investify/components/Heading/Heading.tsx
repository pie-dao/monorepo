import useTranslation from 'next-translate/useTranslation';

type Props = {
  title: string;
  subtitle?: string;
  locks?: number;
};

const Heading: React.FC<Props> = ({ title, subtitle, locks = 0 }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-y-3 my-8">
      <h1 className="text-4xl font-medium text-secondary text-center">
        {title}
      </h1>
      <p className="text-base text-center max-w-sm">{subtitle}</p>
      <div className="flex px-2 py-1 bg-gradient-major-colors rounded-md text-white font-medium text-lg">
        <span>
          {locks === 1 ? t('singleLock') : t('lockAmount', { locks })}
        </span>
      </div>
    </div>
  );
};

export default Heading;
