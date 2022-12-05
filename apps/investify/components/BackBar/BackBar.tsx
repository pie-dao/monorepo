import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslation from 'next-translate/useTranslation';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import router from 'next/router';
import {
  setCurrentStep,
  setPreviousStep,
} from '../../store/migration/migration.slice';

type Props = {
  token?: string;
};

const BackBar: React.FC<Props> = ({ token }) => {
  const { t } = useTranslation();
  const { currentStep } = useAppSelector((state) => state.migration);
  const dispatch = useAppDispatch();

  const goBack = () => {
    if (currentStep === 1) {
      router.push('/migration');
    } else {
      dispatch(setCurrentStep(currentStep - 1));
      dispatch(setPreviousStep(currentStep - 1));
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
