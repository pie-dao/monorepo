import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import {
  setCurrentStep,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { STEPS_LIST } from '../../store/migration/migration.types';
import classNames from '../../utils/classnames';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
  goTo?: STEPS_LIST;
  children?: React.ReactNode;
  title: string;
  singleCard?: boolean;
  hideBack?: boolean;
};

const BackBar: React.FC<Props> = ({
  goTo,
  children,
  title,
  singleCard,
  hideBack = false,
}) => {
  const { t } = useTranslation();
  const { currentStep } = useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const goBack = () => {
    if (
      currentStep === STEPS_LIST.CHOOSE_MIGRATION_TYPE ||
      currentStep === STEPS_LIST.MIGRATE_SUCCESS
    ) {
      if (router.pathname === '/migration/start') {
        router.push('/migration');
      } else {
        router.push('/migration/start');
      }
      dispatch(setCurrentStep(STEPS_LIST.CHOOSE_MIGRATION_TYPE));
      dispatch(setPreviousStep(null));
    } else {
      dispatch(setCurrentStep(goTo ?? currentStep - 1));
      dispatch(setPreviousStep(goTo ? goTo - 1 : currentStep - 1));
    }
  };

  return (
    <div
      className={classNames(
        'flex flex-col rounded-md justify-center p-4 bg-white shadow-sm mx-auto',
        ((singleCard && !router.pathname.startsWith('/migration/start')) ||
          currentStep === STEPS_LIST.MIGRATE_SELECT_WALLET) &&
          'w-full md:max-w-5xl',
        !singleCard &&
          !router.pathname.startsWith('/migration/start') &&
          currentStep !== STEPS_LIST.MIGRATE_SELECT_WALLET &&
          'w-full md:max-w-7xl',
      )}
    >
      <div className="w-full">
        <div className="flex justify-between items-center gap-x-4">
          {!hideBack && (
            <button className="w-fit flex items-center" onClick={goBack}>
              <ChevronLeftIcon
                className="h-7 w-7 text-sub-dark"
                aria-hidden="true"
              />
              <span className="text-sub-dark">{t('back')}</span>
            </button>
          )}
          <h2 className="text-base font-medium text-primary text-right ml-auto">
            {title}
          </h2>
        </div>
        <hr className="my-4 border-custom-border" />
        {children}
      </div>
    </div>
  );
};

export default BackBar;
