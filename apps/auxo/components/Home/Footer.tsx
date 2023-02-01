import Link from 'next/link';
import Container from '../Container/Container';
import {
  discord,
  twitter,
  medium,
  github,
  notion,
} from '../../utils/social-icons';
import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: 'About',
    link: '/about',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Contact',
    link: '/contact',
  },
];

const SocialIcons = [
  { path: discord, href: 'https://discord.gg/VjYCxQVF' },
  { path: twitter, href: 'https://twitter.com/PieDAO_DeFi' },
  { path: medium, href: 'https://medium.com/piedao' },
  { path: github, href: 'https://github.com/pie-dao' },
  { path: notion, href: 'https://www.notion.so/piedao/' },
];

const Footer: React.FC = () => (
  <footer>
    <Container
      size="lg"
      className="flex justify-between py-2 flex-wrap gap-x-12 gap-y-2"
    >
      <div>
        <ul className="flex items-center justify-center gap-6 my-2">
          {footerLinks.map((el, i) => (
            <li
              key={i}
              className="font-medium text-sub-dark hover:text-secondary"
            >
              <Link href={el.link}>{el.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="flex items-center justify-center gap-4 my-2">
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
        </ul>
      </div>
    </Container>
  </footer>
);
export default Footer;
