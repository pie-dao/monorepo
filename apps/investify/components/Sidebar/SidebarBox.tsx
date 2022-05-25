import { motion } from 'framer-motion';
import { Key } from 'react';

const variants = {
  enter: {
    x: 200,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: -200,
    opacity: 1,
  },
};

export default function SidebarBox({ children, ...props }, key: Key) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      key={key}
      {...props}
    >
      {children}
    </motion.div>
  );
}
