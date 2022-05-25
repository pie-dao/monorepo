import { motion } from 'framer-motion';

const variants = {
  enter: () => {
    return {
      x: 200,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: () => {
    return {
      zIndex: 0,
      x: -200,
      opacity: 0,
    };
  },
};

export default function SidebarBox({ children, key, ...props }) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      exit="exit"
      key={key}
      {...props}
    >
      {children}
    </motion.div>
  );
}
