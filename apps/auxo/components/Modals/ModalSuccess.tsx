import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
  type Transition,
} from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { useEffect, useMemo, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import AuxoLogo from '../../public/tokens/32x32/AUXO.svg';
import classNames from '../../utils/classnames';
import { formatBalance } from '../../utils/formatBalance';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  useChainExplorer,
  useUserEndDate,
  useUserLevel,
  useUserLockDuration,
} from '../../hooks/useToken';
import Coin from '../../public/images/animations/coin.svg';
import {
  setIsOpen,
  setShowCompleteModal,
  setSwap,
  setTx,
} from '../../store/modal/modal.slice';

const transition = (delay: number): Transition => ({
  duration: 5,
  ease: 'easeOut',
  repeat: 400,
  delay,
});

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
      delay: 0.4,
    },
  },
};

const childrenVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.6, delay: 1.4 },
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const scaleSVGVariant: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    origin: 'center',
    transition: {
      duration: 0.8,
      delay: 0.8,
      ease: 'easeInOut',
    },
  },
};

const footerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 2 },
  },
};

export default function ModalSuccess() {
  const { t } = useTranslation();
  const { swap, tx, showCompleteModal } = useAppSelector(
    (state) => state.modal,
  );
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

  const lock = useUserLockDuration(swap?.to?.token);
  const userLevel = useUserLevel(lock);
  const endDate = useUserEndDate();

  const chainExplorer = useChainExplorer();

  const numEmojis = useMemo(() => {
    if (userLevel >= 28) {
      return Math.min(userLevel - 27, 3);
    }
    return 0;
  }, [userLevel]);

  const fireEmojis = useMemo(
    () =>
      Array.from({ length: numEmojis }, (_, index) => (
        <span key={index} role="img" aria-label="fire">
          🔥
        </span>
      )),
    [numEmojis],
  );

  const closeAllModals = () => {
    dispatch(setShowCompleteModal(false));
    dispatch(setIsOpen(false));
    dispatch(setTx(null));
    dispatch(
      setSwap({
        swap: null,
      }),
    );
  };

  return (
    <AnimatePresence initial={true}>
      <Dialog
        as="div"
        className="relative z-30"
        open={showCompleteModal}
        onClose={closeAllModals}
      >
        <BouncingCoin coins={5} />

        <div className="w-screen h-screen fixed inset-0 bg-primary" />
        {/* add an image layer of stars */}
        <motion.div
          className="w-screen h-screen fixed inset-0 z-10 bg-[url('/images/background/top-stars.png')] bg-repeat-y bg-cover"
          animate={{
            y: ['0%', '-100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 90,
            ease: 'linear',
          }}
        />

        <motion.div
          className="w-screen h-screen fixed inset-0 z-20 bg-[url('/images/background/bottom-stars.png')] bg-repeat-y bg-cover"
          animate={{
            y: ['0%', '-100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: 'linear',
          }}
        />
        <motion.div className="w-screen h-screen fixed inset-0 z-20 bg-[url('/images/background/bottom-stars.png')] bg-repeat-y bg-cover" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-center p-2 text-center">
            <Dialog.Panel className="flex flex-col items-center w-full transform overflow-hidden bg-transparent p-6 text-center transition-all gap-y-4 h-full pt-36">
              <div className="w-[120px]">
                {swap?.from?.token === 'ARV' ? (
                  <AnimatedArvLogo />
                ) : (
                  <AnimatedPrvLogo />
                )}
              </div>
              <motion.ul
                variants={variants}
                initial="hidden"
                animate="visible"
                className="gap-y-2 flex flex-col items-center"
              >
                <motion.li
                  variants={childrenVariants}
                  className="text-2xl sm:text-4xl font-bold bg-clip-text bg-gradient-major-colors text-transparent"
                >
                  {t('journeyStarted')}
                </motion.li>
                <motion.li
                  variants={childrenVariants}
                  className="text-4xl sm:text-7xl font-medium text-white"
                >
                  <AnimatedNumberFramerMotion value={swap?.to?.amount?.label} />{' '}
                  <span className="uppercase">{swap?.from?.token}</span>
                </motion.li>
                {swap?.from?.token === 'ARV' && (
                  <>
                    <Box className="mt-8">
                      {t('staked')}:{' '}
                      {formatBalance(swap?.from?.amount?.label, defaultLocale)}{' '}
                      AUXO{' '}
                      <Image src={AuxoLogo} width={32} height={32} alt="AUXO" />
                    </Box>
                    <Box>
                      {t('unlock')} {endDate}
                    </Box>
                    <Box>
                      {t('rewardLevel')} {userLevel} <span>{fireEmojis}</span>
                    </Box>
                  </>
                )}
              </motion.ul>
            </Dialog.Panel>
          </div>
        </div>
        <motion.div
          variants={footerVariants}
          initial="hidden"
          animate="visible"
          className="fixed bottom-0 mb-8 w-full flex flex-col gap-y-4 items-center z-40"
        >
          <button
            onClick={closeAllModals}
            type="button"
            className="w-fit px-16 py-2.5 text-lg font-medium uppercase text-white bg-secondary rounded-full ring-inset ring-2 hover:ring-white enabled:hover:bg-transparent enabled:hover:text-white disabled:opacity-70"
          >
            {t('goToPage')}
          </button>
          {tx?.hash && (
            <div className="flex items-center self-center justify-between w-fit py-2 gap-x-4">
              <div className="text-sm text-white font-medium flex items-center gap-x-2">
                <Image
                  src={'/images/icons/etherscan-white.svg'}
                  alt={'etherscan'}
                  width={24}
                  height={24}
                />
                <span className="text-sm text-white font-medium">
                  {t('TX')}:
                </span>
              </div>
              <div className="text-sm text-sub-dark font-medium flex items-center gap-x-2 truncate max-w-xs">
                <a
                  href={
                    chainExplorer?.url
                      ? `${chainExplorer?.url}/tx/${tx?.hash}`
                      : '#'
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-white hover:text-white hover:underline truncate"
                >
                  <span className="text-white font-bold"> {tx?.hash}</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </Dialog>
    </AnimatePresence>
  );
}

function AnimatedNumberFramerMotion({ value }: { value: number }) {
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: value > 1_000_000 ? 1800 : 2500,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(
    () =>
      springValue.onChange((latest) => {
        if (ref.current) {
          ref.current.textContent = formatBalance(
            latest,
            defaultLocale,
            4,
            'standard',
          );
        }
      }),
    [defaultLocale, springValue],
  );

  return <span ref={ref} />;
}

function AnimatedArvLogo() {
  return (
    <motion.svg
      variants={scaleSVGVariant}
      initial="hidden"
      animate="visible"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 120 120"
    >
      <path
        fill="#fff"
        d="m79.2 1.3-38.4.1L1.5 85.5 29 102.3l28.4 16.4h.1V88.1h-.2l-20-12.6 20-50h5.4l20 50-20 12.6h-.1v30.6h.1l28.4-16.5 27.4-16.7z"
      />
    </motion.svg>
  );
}

function AnimatedPrvLogo() {
  return (
    <motion.svg
      variants={scaleSVGVariant}
      initial="hidden"
      animate="visible"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 120 120"
    >
      <path
        fill="#fff"
        d="m79.2 1.3-38.4.1L1.5 85.5 29 102.3l28.4 16.4h.1V88.1h-.2l-20-12.6 20-50h5.4l20 50-20 12.6h-.1v30.6h.1l28.4-16.5 27.4-16.7z"
      />
    </motion.svg>
  );
}

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const Box = ({ children, className }: BoxProps) => {
  return (
    <motion.li
      variants={childrenVariants}
      className={classNames(
        'text-lg sm:text-2xl text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant px-4 py-2 rounded-lg',
        className,
      )}
    >
      {children}
    </motion.li>
  );
};

const BouncingCoin = ({ coins }: { coins: number }) => {
  return (
    <div className="fixed inset-0 z-30 w-full">
      {[...Array(coins)].map((_, index) => {
        return (
          <div
            className={`absolute top-0`}
            style={{
              left: `${Math.random() * 100}%`,
            }}
            key={index}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
              <motion.path
                d="m44 515c0 0 0.5-227 107-227 106.5 0 126 236 126 236"
                fill="transparent"
                strokeWidth="0"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={transition(0.5 + index * 0.5)}
              />
            </svg>
            <motion.div
              className="[offset-path:path('m44_515c0_0_0.5-227_107-227_106.5_0_126_236_126_236')] absolute"
              initial={{
                offsetDistance: '0%',
                scale: 1,
                rotate: `${-180}deg`,
              }}
              animate={{
                offsetDistance: '100%',
                scale: 1,
                rotate: '-90deg',
              }}
              transition={transition(0.5 + index * 1.5)}
            >
              <Image src={Coin} width={87} height={50} alt="Coin" />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
