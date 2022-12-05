import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import router from 'next/router';
import {
  setCurrentStep,
  setPreviousStep,
} from '../../store/migration/migration.slice';
import { STEPS_LIST } from '../../store/migration/migration.types';

type Props = {
  token?: string;
  goTo?: STEPS_LIST;
};

const BackBar: React.FC<Props> = ({ goTo }) => {
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
      dispatch(setCurrentStep(goTo ? goTo : currentStep - 1));
      dispatch(setPreviousStep(goTo ? goTo - 1 : currentStep - 1));
    }
  };

  return (
    <div className="flex flex-col rounded-md justify-center p-4 bg-white shadow-md w-full">
      <button className="flex items-center" onClick={goBack}>
        <ChevronLeftIcon className="h-7 w-7 text-sub-dark" aria-hidden="true" />
        <span className="text-sub-dark">{t('back')}</span>
      </button>
    </div>
  );
};

export default BackBar;
