import { motion } from 'framer-motion';
import { Key } from 'react';

const variants = {
  enter: {
    x: 100,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: -100,
    opacity: 1,
  },
};

export type Props = {
  children: React.ReactNode;
  className?: string;
  key?: Key;
};

const ModalBox = ({ children, key, className }: Props) => {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      key={key}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ModalBox;
