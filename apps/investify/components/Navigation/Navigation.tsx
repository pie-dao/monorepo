import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TemplateIcon, UsersIcon } from '@heroicons/react/solid';
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
import classNames from '../../utils/classnames';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Socials } from '../';

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
    { name: t('Homepage'), href: '/', icon: TemplateIcon },
    { name: t('Dashboard'), href: '/dashboard', icon: TemplateIcon },
    { name: t('Discover'), href: '/discover', icon: UsersIcon },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const sidebarVariants = !isDesktop
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
      };

  const listVariants: Variants = !isDesktop
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
      };

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
          initial="hidden"
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
            'h-full w-[180px] fixed z-50 lg:z-0 lg:static bg-background',
          )}
        >
          <div className="flex flex-col flex-grow pt-5 h-full">
            <div className="flex-shrink-0 flex items-center px-4 overflow-hidden">
              <motion.h2
                className="text-2xl font-medium text-primary"
                animate={open ? 'visible' : 'hidden'}
                initial="visible"
                exit="hidden"
                variants={titleVariants}
              >
                {open ? t('Investify') : 'In'}
              </motion.h2>
            </div>
            <nav className="mt-10 flex-1 overflow-y-auto px-2 space-y-1 overflow-hidden font-medium ">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
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
                        <span
                          className={classNames(
                            active
                              ? 'text-primary cursor-default bg-white'
                              : 'text-gray-400 cursor-pointer hover:text-primary',
                            'group flex items-center p-2 text-sm font-medium rounded-full border border-customBorder hover:bg-white hover:drop-shadow-sm',
                          )}
                        >
                          <item.icon
                            className="flex-shrink-0 h-6 w-6 text-primary"
                            aria-hidden="true"
                          />
                          <motion.span
                            variants={itemVariants}
                            className="text-base ml-5"
                            initial="hidden"
                            animate={open ? 'visible' : 'hidden'}
                          >
                            {item.name}
                          </motion.span>
                        </span>
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
