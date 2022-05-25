import classNames from '../../utils/classnames';
import { motion, Variants } from 'framer-motion';
import {
  discord,
  twitter,
  medium,
  github,
  notion,
} from '../../utils/social-icons';
import useTranslation from 'next-translate/useTranslation';

const SocialIcons = [
  { path: discord, href: 'https://discord.gg/VjYCxQVF' },
  { path: twitter, href: 'https://twitter.com/PieDAO_DeFi' },
  { path: medium, href: 'https://medium.com/piedao' },
  { path: github, href: 'https://github.com/pie-dao' },
  { path: notion, href: 'https://www.notion.so/piedao/' },
];

const variants: Variants = {
  visible: {
    x: 0,
    opacity: 1,
  },
  hidden: {
    x: -180,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function Socials({ open }: { open: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="gap-2 flex flex-col px-2">
      <div className="flex gap-2 self-center items-center w-full justify-center border-b pb-2">
        <motion.h3
          animate={open ? 'visible' : 'hidden'}
          variants={variants}
          initial="visible"
          exit="hidden"
          className="text-xs text-sub-dark font-medium"
        >
          {open && t('copyright')}
        </motion.h3>
        <span aria-hidden="true">🍰</span>
      </div>
      <motion.ul
        className={classNames(
          'flex items-center justify-center gap-2 my-2',
          open ? 'flex-row' : 'flex-col',
        )}
        layout
      >
        {SocialIcons.map(({ path, href }) => (
          <motion.li
            key={href}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <svg
                className="h-5 w-5 text-sub-dark hover:text-secondary"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d={path} />
              </svg>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
