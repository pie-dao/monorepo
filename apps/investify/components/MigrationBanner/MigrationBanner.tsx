import { ExclamationIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

export default function MigrationBanner() {
  const { t } = useTranslation('migration');
  return (
    <div className="bg-warning rounded-lg items-center py-1 justify-center">
      <div className="flex items-center justify-center w-full max-w-7xl gap-x-3 mx-auto">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-lg text-primary font-medium">
            {t('timeToMigrateSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
