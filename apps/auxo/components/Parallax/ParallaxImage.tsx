import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import {
  motion,
  useViewportScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import classNames from '../../utils/classnames';

type ParallaxProps = {
  children: ReactNode;
  offset?: number;
  className?: string;
  speed?: number;
};

const Parallax: React.FC<ParallaxProps> = ({
  children,
  offset = 50,
  className,
  speed = 1,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const ref = useRef(null);

  const { scrollY } = useViewportScroll();

  const yRange = useTransform(scrollY, (value) => value * (1 / speed));
  // spring with different stiffness based on speed prop value
  const y = yRange;

  useLayoutEffect(() => {
    const element = ref.current;
    const onResize = () => {
      setElementTop(
        element.getBoundingClientRect().top + window.scrollY ||
          window.pageYOffset,
      );
      setClientHeight(window.innerHeight);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ref]);

  // Don't parallax if the user has "reduced motion" enabled
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        ref={ref}
        style={{ y }}
        className={classNames('absolute min-h-full', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Parallax;
