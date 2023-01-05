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
import diamond from '../../public/images/icons/diamond.svg';
import xAUXOIcon from '../../public/tokens/xAUXO.svg';
import veAUXOIcon from '../../public/tokens/veAUXO.svg';
import classNames from '../../utils/classnames';
import { Socials } from '../';
import { useMediaQuery } from 'usehooks-ts';
import AUXOLogo from '../../public/images/auxoIcon.svg';

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
    // { name: t('Homepage'), href: '/', icon: diamond },
    // { name: t('Dashboard'), href: '/treasury', icon: diamond },
    { name: t('veAUXO'), href: '/veAUXO', icon: veAUXOIcon },
    { name: t('xAUXO'), href: '/xAUXO', icon: xAUXOIcon },
    { name: t('migration'), href: '/migration', icon: diamond },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

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
              transition: { duration: 0.5 },
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
              transition: { duration: 0.5 },
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
  if (!mounted) return null; // Skeleton UI probably needed here since we're checking for mobile on client side
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.aside
          animate={open ? 'visible' : 'hidden'}
          exit="hidden"
          drag="x"
          variants={sidebarVariants}
          dragConstraints={{
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          style={{ x }}
          dragElastic={0.8}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className={classNames(
            'h-full w-[180px] fixed z-50 lg:z-0 lg:static bg-sidebar',
          )}
        >
          <div className="flex flex-col flex-grow pt-5 h-full">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex flex-shrink-0">
                <Image src={AUXOLogo} alt="AUXO Logo" />
              </div>
              <motion.h2
                className="text-xl font-medium text-primary"
                animate={open ? 'visible' : 'hidden'}
                initial="visible"
                exit="hidden"
                variants={titleVariants}
              >
                {open && 'Auxo'}
              </motion.h2>
            </div>
            <nav className="mt-10 flex-1 overflow-y-auto px-2 space-y-1 overflow-hidden font-medium ">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {navigation.map((item) => {
                  const active = pathname === item.href;
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
                        <div
                          className={classNames(
                            active
                              ? 'text-primary cursor-default bg-white'
                              : 'text-gray-400 cursor-pointer hover:text-primary',
                            'group flex items-center p-2 text-sm font-medium rounded-full border border-customBorder hover:bg-white hover:drop-shadow-sm',
                          )}
                          onClick={() => {
                            if (!isDesktop) {
                              setOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={24}
                              height={24}
                            />
                          </div>
                          <motion.span
                            variants={itemVariants}
                            className="text-base ml-5"
                            initial="hidden"
                            animate={open ? 'visible' : 'hidden'}
                          >
                            {item.name}
                          </motion.span>
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>
            <Socials open={open} />
          </div>
        </motion.aside>
      </AnimatePresence>
      {!isDesktop && open && (
        <>
          <div
            className="absolute inset z-40 fixed inset-0 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </>
  );
}
