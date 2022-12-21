import classNames from '../../utils/classnames';
import { motion } from 'framer-motion';
import {
  discord,
  twitter,
  medium,
  github,
  notion,
} from '../../utils/social-icons';

const SocialIcons = [
  { path: discord, href: 'https://discord.gg/VjYCxQVF' },
  { path: twitter, href: 'https://twitter.com/PieDAO_DeFi' },
  { path: medium, href: 'https://medium.com/piedao' },
  { path: github, href: 'https://github.com/pie-dao' },
  { path: notion, href: 'https://www.notion.so/piedao/' },
];

export default function Socials({ open }: { open: boolean }) {
  return (
    <div className="gap-2 flex flex-col px-2">
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
