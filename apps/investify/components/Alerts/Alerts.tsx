import { ExclamationIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from '../../utils/classnames';

const variants = {
  visible: {
    opacity: 1,
    y: 0,
    marginTop: '1rem',
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  hidden: {
    opacity: 0,
    marginTop: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

export function Alert({
  open,
  children,
}: {
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={classNames(
            'bg-yellow-50 rounded-md border-yellow-400 p-3 flex',
          )}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-1">
              <p className="text-xs text-yellow-700">{children}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
