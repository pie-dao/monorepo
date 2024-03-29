import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { addMonths } from '../../utils/dates';
import boostImage from '../../public/images/icons/boost.svg';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { setIsOpen, setStep, setSwap } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { useUserLockAmount } from '../../hooks/useToken';

const BoostStake: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const tokenLocker = useStakingTokenContract('ARV');
  const userLockAmount = useUserLockAmount('ARV');

  const boostToMax = () => {
    dispatch(setStep(STEPS.BOOST_STAKE_ARV));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: 'AUXO',
            amount: userLockAmount,
          },
          to: {
            token: 'ARV',
            amount: userLockAmount,
          },
          stakingTime: 36,
          spender: tokenLocker.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 rounded-md shadow-md bg-white space-y-3 divide-y border-custom-border">
      <div className="flex items-center justify-between w-full">
        <div className="flex-shrink-0">
          <Image src={boostImage} alt="boost" width={64} height={64} />
        </div>
        <div className="w-full flex flex-col">
          <h3 className="text-lg font-medium text-secondary">
            {t('boostPosition')}
          </h3>
          <p className="text-base text-sub-dark">
            {t('boostPositionDescription')}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-full pt-4">
        <div className="w-full flex justify-between flex-col gap-y-6">
          <div className="w-full text-center">
            <p className="text-base text-primary font-bold">
              {t('boostFor36Months')}
            </p>
          </div>
          <div className="flex">
            <dt className="text-base text-sub-dark flex items-center gap-x-2">
              {t('newStakingDates')}
            </dt>
            <dd className="flex ml-auto pr-2 font-medium text-base text-primary">
              Today to{' '}
              {addMonths(36).toLocaleDateString(defaultLocale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </dd>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center pt-4">
        <button
          onClick={boostToMax}
          className="w-fit px-4 py-0.5 text-base text-secondary bg-transparent rounded-2xl ring-inset ring-1 ring-secondary enabled:hover:bg-secondary enabled:hover:text-white disabled:opacity-70 flex gap-x-2 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="fill-current w-3 h-3"
            viewBox="0 0 16 16"
          >
            <path d="M8.70772.766568 11.0701 3.1199c.128.13188.128.34146 0 .47333L8.70772 5.94657c-.06266.0631-.14794.0986-.23691.0986-.08897 0-.17426-.0355-.23691-.0986l-.13347-.13333c-.06517-.06272-.10142-.14961-.1001-.24001V3.9999c-2.21141 0-4.00411 1.79086-4.00411 4-.00123.64831.15689 1.287.46047 1.86.0691.12998.04469.2898-.06006.3933l-.48716.4867c-.0738.073-.17741.1075-.28029.0933-.10321-.0156-.1939-.0768-.24692-.1666-.9532-1.64933-.95372-3.68122-.00137-5.331.95235-1.64978 2.71304-2.66708 4.61944-2.66903V1.1399c-.00132-.09039.03493-.177281.1001-.239998L8.2339.766568c.06265-.063104.14794-.098599.23691-.098599.08897 0 .17425.035495.23691.098599ZM7.29293 10.0532l-2.36242 2.3534c-.12798.1318-.12798.3414 0 .4733l2.36242 2.3533c.06266.0631.14794.0986.23691.0986.08897 0 .17426-.0355.23691-.0986l.13347-.1333c.06517-.0627.10142-.1496.10011-.24v-1.5267c1.90639-.0019 3.66707-1.0192 4.61947-2.669.9523-1.64978.9518-3.68167-.0014-5.33097-.0545-.08728-.1449-.1459-.2469-.16-.1029-.01415-.2065.02035-.2803.09334l-.4939.49333c-.1027.1045-.1269.26299-.06.39333.3066.56733.4671 1.20194.4671 1.84667 0 2.2091-1.7927 4-4.00407 4v-1.5733c.00131-.0904-.03494-.1773-.10011-.24l-.13347-.1334c-.06265-.06307-.14794-.09856-.23691-.09856-.08897 0-.17425.03549-.23691.09856Z" />
          </svg>
          {t('boostNow')}
        </button>
      </div>
    </div>
  );
};

export default BoostStake;
