import { useState } from 'react';
import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { AnimatePresence, motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/solid';

type Props = {
  children: React.ReactNode;
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

const Tooltip: React.FC<Props> = ({ children }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            ref={setReferenceElement}
            className="focus:outline-none w-4 h-4 text-primary"
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <InformationCircleIcon />
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
                  className="p-3 bg-gradient-primary rounded-md shadow-md z-50 max-w-xs"
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
