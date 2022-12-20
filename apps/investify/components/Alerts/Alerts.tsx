import { ExclamationIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from '../../utils/classnames';

const variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  hidden: {
    opacity: 0,
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
            'rounded-lg items-center py-1 justify-center bg-warning',
          )}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex w-full items-center gap-x-3 mx-auto px-2">
            <div className="flex-shrink-0">
              <ExclamationIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm text-primary font-medium">{children}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
