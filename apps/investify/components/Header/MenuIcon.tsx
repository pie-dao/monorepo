import { motion } from 'framer-motion';

export default function MenuIcon({ open }: { open: boolean }) {
  const variants = {
    visible: {
      x: 0,
    },
    hidden: {
      x: 10,
      transition: { duration: 0.2 },
    },
  };
  return (
    <svg
      width="25"
      height="15"
      viewBox="0 0 25 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 7.5C0 6.67157 0.543654 6 1.21429 6H15.7857C16.4563 6 17 6.67157 17 7.5C17 8.32843 16.4563 9 15.7857 9H1.21429C0.543654 9 0 8.32843 0 7.5Z"
        fill="#0B78DD"
        animate={open ? 'visible' : 'hidden'}
        variants={variants}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 1.5C3 0.671573 3.54365 0 4.21429 0H18.7857C19.4563 0 20 0.671573 20 1.5C20 2.32843 19.4563 3 18.7857 3H4.21429C3.54365 3 3 2.32843 3 1.5Z"
        fill="#0B78DD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 13.5C3 12.6716 3.54365 12 4.21429 12H18.7857C19.4563 12 20 12.6716 20 13.5C20 14.3284 19.4563 15 18.7857 15H4.21429C3.54365 15 3 14.3284 3 13.5Z"
        fill="#0B78DD"
      />
    </svg>
  );
}
