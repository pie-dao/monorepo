import { Dispatch, SetStateAction, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  Variants,
} from 'framer-motion';
import { TrendingUpIcon, XIcon } from '@heroicons/react/outline';
import {
  ArvIcon,
  PrvIcon,
  BanknotesIcon,
  AuxoLogotype,
  AuxoLogo,
} from '../Icons/Icons';
import classNames from '../../utils/classnames';
import { Socials } from '../';
import { useMediaQuery } from 'usehooks-ts';
import MenuIcon from '../Header/MenuIcon';

type DragEvent = MouseEvent | TouchEvent | PointerEvent;

export default function Navigation({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);

  const navigation = [
    { name: t('ARV'), href: '/ARV', icon: ArvIcon },
    { name: t('PRV'), href: '/PRV', icon: PrvIcon },
    { name: t('rewards'), href: '/rewards', icon: BanknotesIcon },
    { name: t('migration'), href: '/migration', icon: TrendingUpIcon },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1920px)');

  const sidebarVariants = useMemo(
    (): Variants =>
      !isDesktop
        ? {
            visible: {
              width: 180,
              x: 0,
              opacity: 1,
            },
            hidden: {
              width: 0,
              x: -180,
              opacity: 0,
              transition: { duration: 0.3 },
            },
          }
        : {
            visible: {
              width: 180,
              x: 0,
            },
            hidden: {
              width: 60,
              x: 0,
              transition: { duration: 0.3 },
            },
          },
    [isDesktop],
  );

  const listVariants = useMemo(
    (): Variants =>
      !isDesktop
        ? {
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.4,
                staggerChildren: 0.1,
              },
            },
          }
        : {
            hidden: {},
            visible: {},
          },
    [isDesktop],
  );

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      marginLeft: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
    },
  };

  const titleVariants: Variants = !isDesktop
    ? {
        hidden: {
          opacity: 0,
          width: 0,
        },
        visible: {
          opacity: 1,
          width: 180,
        },
      }
    : {
        hidden: {
          opacity: 1,
          width: 180,
          x: 0,
          transition: { delay: 0, duration: 0.2 },
        },
        visible: {
          opacity: 1,
          x: 15,
          width: 40,
        },
      };

  const x = useMotionValue(0);
  const handleDragEnd = (_event: DragEvent, info: PanInfo) => {
    if (info.offset.x < -80) {
      setOpen(false);
    }
    handleDrag(_event, info);
  };

  const handleDrag = (_event: DragEvent, info: PanInfo) => {
    if (info.offset.x > 0) {
      x.set(0);
    }
  };

  const { pathname } = useRouter();
  const splitPath = pathname.split('/');
  const path = `/${splitPath[1]}`;

  if (!mounted) return null;

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        <motion.aside
          className={classNames(
            'fixed inset-y-0 left-0 flex-col place-items-start flex p-0 my-4 duration-300 transition-all bg-white border-0 ease-in-out z-20 w-full lg:ml-4 rounded-2xl lg:translate-x-0 shadow',
            isDesktop
              ? open
                ? 'max-w-[11rem] overflow-y-auto'
                : 'max-w-[3.5rem] overflow-hidden'
              : open
              ? 'translate-x-0 max-w-[11rem]'
              : '-translate-x-full max-w-[11rem]',
          )}
        >
          <AnimatePresence exitBeforeEnter>
            {open && (
              <motion.div
                key={1}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-shrink-0 pb-8 pt-3 w-full h-16 overflow-hidden mx-2"
              >
                <AuxoLogotype />
              </motion.div>
            )}
            {!open && (
              <motion.div
                key={2}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-shrink-0 mb-8 mt-3 w-10 h-10 overflow-hidden mx-auto shadow-lg rounded-full"
              >
                <AuxoLogo />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="block w-full">
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col pl-0 mb-0 list-none mx-2 gap-y-2"
            >
              {navigation.map((item) => {
                const active = path === item.href;
                return (
                  <motion.li
                    key={item.name}
                    variants={itemVariants}
                    whileHover={
                      !active && {
                        scale: 1.03,
                      }
                    }
                    whileTap={
                      !active && {
                        scale: 0.95,
                      }
                    }
                  >
                    <Link href={item.href} passHref>
                      <button
                        disabled={active}
                        className={classNames(
                          active
                            ? 'cursor-default bg-primary text-white border'
                            : 'text-primary cursor-pointer hover:text-white hover:bg-primary',
                          'group w-full flex items-center p-2 text-sm font-medium rounded-lg  gap-x-2',
                        )}
                        onClick={() => {
                          if (!isDesktop) {
                            setOpen(false);
                          }
                        }}
                      >
                        <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                          <item.icon />
                        </div>
                        <motion.span
                          variants={itemVariants}
                          className="text-base"
                          initial="hidden"
                          animate={open ? 'visible' : 'hidden'}
                        >
                          {item.name}
                        </motion.span>
                      </button>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
          <Socials open={open} />
        </motion.aside>
      </AnimatePresence>
      <motion.button
        type="button"
        className={classNames(
          'focus:outline-none -pl-8 fixed flex z-20 self-start top-0 transition-all duration-300 mt-7',
          open ? 'left-36 md:left-40' : 'left-5 md:left-6 lg:left-20',
        )}
        onClick={() => setOpen(!open)}
      >
        <MenuIcon open={open} />
      </motion.button>
    </div>
  );
}
