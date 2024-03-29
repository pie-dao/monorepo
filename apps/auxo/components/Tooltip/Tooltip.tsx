import { useState } from 'react';
import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { AnimatePresence, motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/outline';
import classNames from '../../utils/classnames';

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

const variants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const Tooltip: React.FC<Props> = ({
  children,
  className,
  icon = <InformationCircleIcon />,
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [10, 1],
        },
      },
    ],
  });

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            ref={setReferenceElement}
            className={classNames(
              'flex focus:outline-none w-4 h-4 text-primary',
              className,
            )}
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {icon}
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <>
                <Popover.Panel
                  static
                  ref={setPopperElement}
                  style={styles.popper}
                  as={motion.div}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white rounded-md shadow-md px-4 py-3 z-40 max-w-md"
                  {...attributes.popper}
                >
                  {children}
                </Popover.Panel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
};

export default Tooltip;
