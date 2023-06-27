import useTranslation from 'next-translate/useTranslation';

export const MobileAccordionContent = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-4 py-1 lg:hidden">
      <dt className="text-sm text-sub-dark">{t(title)}</dt>
      <dd className="text-sm font-medium text-primary mt-0 text-right truncate">
        {content}
      </dd>
    </div>
  );
};
