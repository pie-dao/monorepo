import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import router from 'next/router';
import {
  setCurrentStep,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { STEPS_LIST } from '../../store/migration/migration.types';
import classNames from '../../utils/classnames';

type Props = {
  token?: string;
  goTo?: STEPS_LIST;
  children?: React.ReactNode;
  title: string;
  singleCard?: boolean;
};

const BackBar: React.FC<Props> = ({ goTo, children, title, singleCard }) => {
  const { t } = useTranslation();
  const { currentStep } = useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();

  const goBack = () => {
    if (
      currentStep === STEPS_LIST.CHOOSE_MIGRATION_TYPE ||
      currentStep === STEPS_LIST.MIGRATE_SUCCESS
    ) {
      router.push('/migration');
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
        'flex flex-col rounded-md justify-center p-4 bg-white shadow-md mx-auto md:min-w-[44rem]',
        singleCard ? 'w-fit' : 'w-full',
      )}
    >
      <div className="flex justify-between items-center">
        <button className="w-fit flex items-center" onClick={goBack}>
          <ChevronLeftIcon
            className="h-7 w-7 text-sub-dark"
            aria-hidden="true"
          />
          <span className="text-sub-dark">{t('back')}</span>
        </button>
        <h2 className="text-base font-medium text-primary">{title}</h2>
      </div>
      <hr className="my-4 border-sub-light" />
      {children}
    </div>
  );
};

export default BackBar;
