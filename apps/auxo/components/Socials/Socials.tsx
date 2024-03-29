import classNames from '../../utils/classnames';
import { motion } from 'framer-motion';
import { discord, twitter, github } from '../../utils/social-icons';

const SocialIcons = [
  { path: discord, href: 'https://discord.gg/x3kmf4bpJc' },
  { path: twitter, href: 'https://twitter.com/AuxoDAO' },
  { path: github, href: 'https://github.com/AuxoDAO' },
];

const variants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  closed: {
    opacity: [0, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

export default function Socials({ open }: { open: boolean }) {
  return (
    <div className="block w-full mt-auto">
      <motion.ul
        className={classNames(
          'flex items-center justify-between mx-2 py-2 border-t border-custom-border px-2 gap-y-2',
          open ? 'flex-row' : 'flex-col',
        )}
        variants={variants}
        initial="closed"
        animate={open ? 'open' : 'closed'}
      >
        {SocialIcons.map(({ path, href }) => (
          <motion.li
            key={href}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              {path && (
                <svg
                  className="h-5 w-5 text-sub-dark hover:text-secondary"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {path}
                </svg>
              )}
            </a>
          </motion.li>
        ))}
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <a
            href={'https://mirror.xyz/auxo.eth'}
            target="_blank"
            rel="noopener noreferrer"
            className="h-5 w-5 text-sub-dark hover:text-secondary flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 144 185"
              className="h-5 w-5 text-sub-dark hover:text-secondary"
            >
              <path
                fill="currentColor"
                d="M0 71.6129C0 32.0622 32.0622 0 71.6129 0c39.5511 0 71.6131 32.0622 71.6131 71.6129V174.118c0 6.01-4.872 10.882-10.883 10.882H10.8824C4.87222 185 0 180.128 0 174.118V71.6129Z"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M134.717 176.111V71.8216c0-34.9532-28.252-63.28834-63.1041-63.28834-34.8516 0-63.10444 28.33514-63.10444 63.28834V176.111c0 .197.15873.356.35452.356H134.363c.196 0 .354-.159.354-.356ZM71.6129 0C32.0622 0 0 32.1556 0 71.8216V176.111C0 181.02 3.96809 185 8.86298 185H134.363c4.895 0 8.863-3.98 8.863-8.889V71.8216C143.226 32.1556 111.164 0 71.6129 0Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </motion.li>
      </motion.ul>
    </div>
  );
}

export const Discord = () => (
  <a
    href={SocialIcons.find(({ path }) => path === discord)?.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 group"
  >
    <span className=" group-hover:underline text-primary">AUXO Discord</span>
    <svg
      className="h-5 w-5 text-sub-dark group-hover:text-primary"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {discord}
    </svg>
  </a>
);
